"""Optional DistilBART summary + gTTS audio (same behaviour as Streamlit helpers)."""

from __future__ import annotations

import os
import tempfile


_bart_bundle: tuple | None | str = None  # unset | None failed | (tok, model)


def load_bart():
    global _bart_bundle
    if _bart_bundle is not None:
        return _bart_bundle if isinstance(_bart_bundle, tuple) else (None, None)
    try:
        from transformers import BartForConditionalGeneration, BartTokenizer

        tok = BartTokenizer.from_pretrained("sshleifer/distilbart-cnn-12-6")
        model = BartForConditionalGeneration.from_pretrained("sshleifer/distilbart-cnn-12-6")
        model.eval()
        _bart_bundle = (tok, model)
        return _bart_bundle
    except Exception:
        _bart_bundle = None
        return None, None


def warmup_summarizer() -> None:
    """Download/load DistilBART once — avoids a multi‑minute stall on first /api/analyze."""

    load_bart()


def get_bert_summary(report_text: str) -> str | None:
    tok, bmodel = load_bart()
    if tok is None:
        return None
    try:
        clean = report_text.replace("=", "").replace("•", "").replace("\n", " ")
        clean = " ".join(clean.split())[:1024]
        inputs = tok([clean], max_length=1024, return_tensors="pt", truncation=True)
        ids = bmodel.generate(
            inputs["input_ids"], num_beams=4, max_length=80, min_length=20, early_stopping=True
        )
        return tok.decode(ids[0], skip_special_tokens=True)
    except Exception:
        return None


def generate_audio(text: str, lang: str = "en") -> bytes | None:
    try:
        from gtts import gTTS

        tts = gTTS(text=text[:600], lang=lang, slow=False)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
            tts.save(f.name)
            with open(f.name, "rb") as af:
                data = af.read()
        os.unlink(f.name)
        return data
    except Exception:
        return None
