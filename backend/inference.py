"""Model loading, prediction, Grad-CAM, validation — mirrors legacy Streamlit logic."""

from __future__ import annotations

import base64
import io
import logging
import os
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from torchvision.models import EfficientNet_B0_Weights, efficientnet_b0

from advisory import ADVISORY, ADVISORY_UR, CLASS_NAMES, DISEASE_COLORS, DISPLAY_NAME_UR, IMG_SIZE

log = logging.getLogger(__name__)

_REPO_ROOT = Path(__file__).resolve().parent.parent
# First existing file wins. `new.pth` at repo root is the default shipping path for the latest weights.
_MODEL_CANDIDATES = (
    _REPO_ROOT / "new.pth",
    _REPO_ROOT / "models" / "new.pth",
    _REPO_ROOT / "models" / "best_corn_model.pth",
    _REPO_ROOT / "KhetiBari" / "best_corn_model.pth",
)
_env_path = os.environ.get("KHETIBARI_MODEL_PATH", "").strip()
_DEFAULT_MODEL = Path(_env_path) if _env_path else _MODEL_CANDIDATES[0]
MODEL_PATH = _DEFAULT_MODEL if _env_path else next((p for p in _MODEL_CANDIDATES if p.is_file()), _MODEL_CANDIDATES[0])

_device = torch.device("cpu")
_model: nn.Module | None = None

_UR_ADVISORY_CACHE: dict[str, dict[str, Any]] = {}

def model_available() -> bool:
    return MODEL_PATH.is_file()


def load_model() -> nn.Module | None:
    global _model
    if _model is not None:
        return _model
    if not model_available():
        return None
    try:
        m = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)
        m.classifier[1] = nn.Linear(1280, len(CLASS_NAMES))
        try:
            ckpt = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
        except TypeError:
            ckpt = torch.load(MODEL_PATH, map_location="cpu")
        if not isinstance(ckpt, dict):
            log.error("Checkpoint is not a dict: %s", MODEL_PATH)
            return None
        state = ckpt.get("model_state_dict") or ckpt.get("state_dict")
        if state is None:
            log.error("No model_state_dict/state_dict in %s", MODEL_PATH)
            return None
        saved_names = ckpt.get("class_names")
        if saved_names is not None and list(saved_names) != list(CLASS_NAMES):
            log.warning(
                "Checkpoint class_names %s != app CLASS_NAMES %s — labels may not match advisory.",
                saved_names,
                CLASS_NAMES,
            )
        m.load_state_dict(state)
        m.eval()
        _model = m
        log.info("Loaded vision weights from %s", MODEL_PATH)
        return _model
    except Exception:
        log.exception("Vision model load failed: %s", MODEL_PATH)
        return None


def generate_gradcam(model: nn.Module, image_pil: Image.Image, pred_class_idx: int, device: torch.device):
    """Generate Grad-CAM heatmap overlay (same algorithm as Streamlit app)."""
    try:
        transform = transforms.Compose(
            [
                transforms.Resize((IMG_SIZE, IMG_SIZE)),
                transforms.ToTensor(),
                transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
            ]
        )
        img_tensor = transform(image_pil).unsqueeze(0).to(device)
        img_array = np.array(image_pil.resize((IMG_SIZE, IMG_SIZE))).astype(np.float32) / 255.0

        target_layer = model.features[-1]
        gradients: list = []
        activations: list = []

        def fwd_hook(module, inp, out):
            activations.append(out.detach())

        def bwd_hook(module, grad_in, grad_out):
            gradients.append(grad_out[0].detach())

        fh = target_layer.register_forward_hook(fwd_hook)
        bh = target_layer.register_full_backward_hook(bwd_hook)

        model.zero_grad()
        output = model(img_tensor)
        loss = output[0, pred_class_idx]
        loss.backward()

        fh.remove()
        bh.remove()

        if not gradients or not activations:
            return None

        grads = gradients[0]
        acts = activations[0]
        weights = grads.mean(dim=(2, 3), keepdim=True)
        cam = (weights * acts).sum(dim=1).squeeze()
        cam = torch.relu(cam).cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        cam_resized = cv2.resize(cam, (IMG_SIZE, IMG_SIZE))

        heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        overlay = np.clip(0.55 * img_array + 0.45 * heatmap, 0, 1)
        return Image.fromarray((overlay * 255).astype(np.uint8))
    except Exception:
        return None


def pil_to_png_base64(im: Image.Image) -> str:
    buf = io.BytesIO()
    im.convert("RGB").save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")


def predict_probs(image_rgb: Image.Image, model: nn.Module, device: torch.device) -> tuple[list[float], int]:
    _transform = transforms.Compose(
        [
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )
    img_tensor = _transform(image_rgb).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
    prob_list = probs.tolist()
    conf_idx = int(probs.argmax().item())
    return prob_list, conf_idx


def _rejection_thresholds() -> tuple[float, float]:
    """Min top-1 confidence (%) and min (top1 − top2) margin in % — override for Level 1 OOD guard."""
    min_conf = float(os.environ.get("KHETIBARI_MIN_CONF_PCT", "45"))
    min_margin = float(os.environ.get("KHETIBARI_MIN_MARGIN_PCT", "12"))
    return min_conf, min_margin


def validate_probs(confidence_pct: float, prob_list: list[float]) -> tuple[bool, str | None]:
    """Returns (ok, reject_code)."""
    min_conf, min_margin = _rejection_thresholds()
    all_probs = sorted(prob_list, reverse=True)
    second_highest = all_probs[1] * 100
    if confidence_pct < min_conf:
        return False, "low_confidence"
    if confidence_pct - second_highest < min_margin:
        return False, "ambiguous"
    return True, None


def _build_report_ur_static(disease: str, confidence: float) -> str:
    """Full Urdu report when Marian MT is disabled or unavailable."""
    info = ADVISORY_UR[disease]
    dn = DISPLAY_NAME_UR[disease]
    if confidence >= 90:
        sev = "اعلیٰ اعتماد"
    elif confidence >= 70:
        sev = "درمیانی اعتماد"
    else:
        sev = "کم اعتماد"
    report = "مکئی پتے کی بیماری — تشخیصی رپورٹ\n"
    report += "پائے جانے والی حالت: " + dn + "\n"
    report += "اعتماد کی شرح: " + "{:.1f}".format(confidence) + "%\n"
    report += "شدت/اعتماد کی سطح: " + sev + "\n\n"
    report += "تفصیل: " + info["description"] + "\n\n"
    report += "تجویز کردہ علاج:\n"
    for t in info["treatment"]:
        report += "  - " + t + "\n"
    report += "\nاحتیاطی تدابیر:\n"
    for p in info["prevention"]:
        report += "  - " + p + "\n"
    report += "\nنوٹ: یہ مشورہ AI کی بنیاد پر ہے۔ شدید متاثر ہونے پر زراعت کے ماہر سے رجوع کریں۔"
    return report


def build_report(disease: str, confidence: float) -> str:
    info = ADVISORY[disease]
    severity = (
        "HIGH CONFIDENCE"
        if confidence >= 90
        else "MODERATE CONFIDENCE"
        if confidence >= 70
        else "LOW CONFIDENCE"
    )
    report = "Corn Leaf Disease Diagnosis Report\n"
    report += "Detected Disease: " + disease.replace("_", " ") + "\n"
    report += "Confidence Score: " + "{:.1f}".format(confidence) + "%\n"
    report += "Severity Level: " + severity + "\n\n"
    report += "Description: " + info["description"] + "\n\n"
    report += "Recommended Treatment:\n"
    for t in info["treatment"]:
        report += "  - " + t + "\n"
    report += "\nPrevention Tips:\n"
    for p in info["prevention"]:
        report += "  - " + p + "\n"
    report += "\nNote: This is an AI-generated advisory. For severe infections, consult an agronomist."
    return report


def cached_advisory_ur(disease: str) -> dict[str, Any]:
    """Urdu advisory: always from bundled ADVISORY_UR (never MT — Marian often echoes English)."""
    if disease not in _UR_ADVISORY_CACHE:
        _UR_ADVISORY_CACHE[disease] = ADVISORY_UR[disease].copy()
    return _UR_ADVISORY_CACHE[disease]


def preload_all_advisory_ur() -> None:
    """Fill Urdu advisory cache once at startup so /api/meta/diseases does not stall the browser."""
    for key in CLASS_NAMES:
        cached_advisory_ur(key)


def build_report_ur(disease: str, confidence: float) -> str:
    """Always native Urdu report text; do not use Marian (unreliable for full reports)."""
    return _build_report_ur_static(disease, confidence)


def advisory_payload_for_lang(disease: str, lang: str) -> dict[str, Any]:
    row = ADVISORY[disease].copy()
    if lang == "ur":
        row = cached_advisory_ur(disease).copy()
    display_en = disease.replace("_", " ")
    if lang == "ur":
        row["display_name"] = DISPLAY_NAME_UR[disease]
    else:
        row["display_name"] = display_en
    return row


def confidence_band(confidence: float, lang: str) -> str:
    if lang == "ur":
        hi, md, lo = (
            "اعلیٰ اعتماد",
            "درمیانی اعتماد",
            "کم اعتماد — زراعت کے ماہر سے مشورہ کریں",
        )
        if confidence >= 90:
            return hi
        if confidence >= 70:
            return md
        return lo
    if confidence >= 90:
        return "High confidence"
    if confidence >= 70:
        return "Moderate confidence"
    return "Low confidence — consult an agronomist"


def fallback_summary_en(disease: str, confidence: float) -> str:
    return (
        "Your corn leaf shows "
        + disease.replace("_", " ")
        + " with "
        + "{:.1f}".format(confidence)
        + "% confidence. "
        + ADVISORY[disease]["short"]
        + " Immediate action: "
        + ADVISORY[disease]["treatment"][0].lower()
        + "."
    )


def fallback_summary_ur(disease: str, confidence: float) -> str:
    dn = DISPLAY_NAME_UR[disease]
    conf_s = "{:.1f}".format(confidence)
    short = ADVISORY_UR[disease]["short"]
    action = ADVISORY_UR[disease]["treatment"][0]
    return (
        f"مکئی پتے کی تشخیص: {dn} (اعتماد {conf_s}٪)۔ {short} "
        f"فوری اقدام: {action}"
    )
