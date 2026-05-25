"""FastAPI service for KhetiBari — exposes inference used by the React SPA."""

from __future__ import annotations

import base64
import io
import logging
import os
import time
from typing import Any

import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel, Field

from advisory import ADVISORY, CLASS_NAMES, DISEASE_COLORS
from inference import (
    MODEL_PATH,
    advisory_payload_for_lang,
    build_report,
    build_report_ur,
    cached_advisory_ur,
    confidence_band,
    fallback_summary_en,
    fallback_summary_ur,
    generate_gradcam,
    load_model,
    model_available,
    pil_to_png_base64,
    preload_all_advisory_ur,
    predict_probs,
    validate_probs,
)
from nlp_audio import generate_audio, get_bert_summary, warmup_summarizer
from translate_en_ur import translation_available, warmup_translation

_logger = logging.getLogger(__name__)


def cors_allow_origins() -> list[str]:
    raw = os.environ.get(
        "KHETIBARI_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


app = FastAPI(title="KhetiBari API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_allow_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup_warm_mt() -> None:
    """Load Marian once at boot and fill Urdu disease cards so /api/meta/diseases stays fast."""
    warmup_translation()

    _logger.info("Preparing Urdu disease reference (first run downloads Marian ~300MB — can take minutes on CPU)…")
    t0 = time.perf_counter()
    try:
        preload_all_advisory_ur()
    except Exception:
        _logger.exception("Urdu advisory preload failed — /api/meta/diseases may hang until Marian succeeds.")
    else:
        _logger.info("Urdu disease reference cache ready in %.1f s", time.perf_counter() - t0)

    if os.environ.get("KHETIBARI_PRELOAD_SUMMARY", "").strip().lower() in ("1", "true", "yes"):
        _logger.info("Loading DistilBART summarizer (may download on first install)…")
        t1 = time.perf_counter()
        warmup_summarizer()
        _logger.info("Summarizer ready in %.1f s", time.perf_counter() - t1)


@app.get("/api/health")
def health():
    m = load_model()
    return {
        "status": "ok",
        "model_loaded": m is not None,
        "model_path_exists": model_available(),
        "model_path": str(MODEL_PATH),
        "translation_ready": translation_available(),
    }


@app.get("/api/meta/diseases")
def meta_diseases():
    items = []
    for key in CLASS_NAMES:
        items.append(
            {
                "key": key,
                "color": DISEASE_COLORS[key],
                "advisory_en": ADVISORY[key],
                "advisory_ur": cached_advisory_ur(key),
            }
        )
    return {"classes": CLASS_NAMES, "items": items}


class SpeechBody(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    lang: str = Field("en", pattern="^(en|ur)$")


@app.post("/api/speech")
def speech(body: SpeechBody):
    data = generate_audio(body.text, lang=body.lang)
    if not data:
        raise HTTPException(status_code=503, detail="TTS unavailable (install gtts)")
    return {"audio_base64": base64.b64encode(data).decode("ascii"), "mime": "audio/mpeg"}


@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...),
    language: str = Form("en"),
):
    import logging

    log = logging.getLogger(__name__)
    if language not in ("en", "ur"):
        raise HTTPException(status_code=400, detail="language must be en or ur")

    model = load_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model not loaded. Place models/best_corn_model.pth in the repo, "
                "or set KHETIBARI_MODEL_PATH to your .pth file."
            ),
        )

    raw = await file.read()
    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    device = torch.device("cpu")
    try:
        prob_list, conf_idx = predict_probs(image, model, device)
        disease = CLASS_NAMES[conf_idx]
        confidence = prob_list[conf_idx] * 100

        if disease == "Non_Leaf":
            return {
                "ok": False,
                "rejected": True,
                "code": "non_leaf",
                "language": language,
            }

        ok, reject_code = validate_probs(confidence, prob_list)
        if not ok:
            return {
                "ok": False,
                "rejected": True,
                "code": reject_code,
                "language": language,
            }

        heatmap_b64: str | None = None
        # Grad-CAM runs a backward pass through EfficientNet → very slow on CPU. Opt-in via env var.
        skip_gcam = os.environ.get("KHETIBARI_SKIP_GRADCAM", "").strip().lower() in ("1", "true", "yes")
        enable_gcam = os.environ.get("KHETIBARI_ENABLE_GRADCAM", "").strip().lower() in ("1", "true", "yes")
        if enable_gcam and not skip_gcam:
            gcam = generate_gradcam(model, image, conf_idx, device)
            if gcam:
                heatmap_b64 = pil_to_png_base64(gcam)

        report_en = build_report(disease, confidence)
        report_ur = build_report_ur(disease, confidence)
        report_text = report_ur if language == "ur" else report_en

        if language == "ur":
            # Native Urdu only — BERT + Marian often leave English in production.
            summary_display = fallback_summary_ur(disease, confidence)
        else:
            bert_en = get_bert_summary(report_en)
            fallback_en = fallback_summary_en(disease, confidence)
            summary_display = bert_en or fallback_en

        probs_out = [
            {
                "class": CLASS_NAMES[i],
                "probability": round(prob_list[i] * 100, 2),
                "color": DISEASE_COLORS[CLASS_NAMES[i]],
            }
            for i in range(len(CLASS_NAMES))
        ]

        payload: dict[str, Any] = {
            "ok": True,
            "rejected": False,
            "language": language,
            "disease": disease,
            "confidence": round(confidence, 2),
            "confidence_band": confidence_band(confidence, language),
            "accent_color": DISEASE_COLORS[disease],
            "probabilities": probs_out,
            "advisory": advisory_payload_for_lang(disease, language),
            "heatmap_png_base64": heatmap_b64,
            "summary": summary_display,
            "report_text": report_text,
        }
        return payload
    except HTTPException:
        raise
    except Exception as exc:
        log.exception("analyze failed")
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc
