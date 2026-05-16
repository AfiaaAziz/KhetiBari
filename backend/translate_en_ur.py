"""Offline English→Urdu translation via Helsinki-NLP Marian MT (local inference).

Default weights: ``Helsinki-NLP/opus-mt-en-ur`` (~300MB). First run downloads into the
Hugging Face cache (works offline afterward).

Environment:

- ``KHETIBARI_DISABLE_MT=1`` — skip Marian; analyzer Urdu copy uses bundled ``ADVISORY_UR`` / static report text instead of English fallbacks.
- ``KHETIBARI_MT_MODEL=<hub id>`` — override pretrained id (advanced).
"""

from __future__ import annotations

import logging
import os
from collections import OrderedDict
from threading import Lock

log = logging.getLogger(__name__)

_MODEL_NAME = os.environ.get("KHETIBARI_MT_MODEL", "Helsinki-NLP/opus-mt-en-ur")

_model = None
_tokenizer = None
_load_lock = Lock()
_load_failed = False

_CACHE: OrderedDict[str, str] = OrderedDict()
_CACHE_MAX = 4096


def mt_disabled() -> bool:
    return os.environ.get("KHETIBARI_DISABLE_MT", "").strip().lower() in ("1", "true", "yes")


def translation_available() -> bool:
    if mt_disabled():
        return False
    if _load_failed:
        return False
    _ensure_loaded()
    return _model is not None


def _ensure_loaded() -> None:
    global _model, _tokenizer, _load_failed
    if mt_disabled() or _load_failed:
        return
    if _model is not None:
        return
    with _load_lock:
        if _model is not None:
            return
        try:
            import torch
            from transformers import MarianMTModel, MarianTokenizer

            tok = MarianTokenizer.from_pretrained(_MODEL_NAME)
            mdl = MarianMTModel.from_pretrained(_MODEL_NAME)
            mdl.eval()
            _tokenizer = tok
            _model = mdl
            log.info("Loaded Marian MT: %s (device=%s)", _MODEL_NAME, torch.device("cpu"))
        except Exception as exc:
            log.warning("Marian MT load failed (%s): %s", _MODEL_NAME, exc)
            _load_failed = True


def _cache_get(key: str) -> str | None:
    if key not in _CACHE:
        return None
    _CACHE.move_to_end(key)
    return _CACHE[key]


def _cache_put(key: str, val: str) -> None:
    _CACHE[key] = val
    _CACHE.move_to_end(key)
    while len(_CACHE) > _CACHE_MAX:
        _CACHE.popitem(last=False)


def _chunk_text(text: str, max_chars: int = 420) -> list[str]:
    """Split long strings so each Marian forward pass stays within practical limits."""
    text = text.strip()
    if not text:
        return []
    if len(text) <= max_chars:
        return [text]
    out: list[str] = []
    i = 0
    n = len(text)
    while i < n:
        j = min(i + max_chars, n)
        if j < n:
            cut = text.rfind(". ", i + 48, j)
            if cut == -1:
                cut = text.rfind("\n", i + 48, j)
            if cut == -1:
                cut = text.rfind(" ", i + 48, j)
            if cut == -1 or cut <= i:
                cut = j
            else:
                cut += 1
        else:
            cut = j
        chunk = text[i:cut].strip()
        if chunk:
            out.append(chunk)
        i = cut if cut > i else j
    return out if out else [text[:max_chars]]


def _translate_chunk(text: str) -> str:
    import torch

    assert _tokenizer is not None and _model is not None
    inputs = _tokenizer([text], return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        gen = _model.generate(**inputs, max_length=512, num_beams=4, early_stopping=True)
    return _tokenizer.decode(gen[0], skip_special_tokens=True)


def translate_en_to_ur(text: str) -> str:
    """Translate English to Urdu via Marian. If MT is disabled or unavailable, returns the English source unchanged — callers should use static Urdu (e.g. ``ADVISORY_UR``) for user-facing Urdu mode."""
    raw = text or ""
    key = raw.strip()
    if not key:
        return ""

    hit = _cache_get(key)
    if hit is not None:
        return hit

    if mt_disabled():
        _cache_put(key, raw)
        return raw

    _ensure_loaded()
    if _model is None or _tokenizer is None:
        _cache_put(key, raw)
        return raw

    try:
        parts = [_translate_chunk(c) for c in _chunk_text(key)]
        out = "\n".join(parts) if "\n" in raw else " ".join(parts)
        out = out.strip()
        _cache_put(key, out or raw)
        return out or raw
    except Exception as exc:
        log.warning("translate_en_to_ur failed: %s", exc)
        _cache_put(key, raw)
        return raw


def translate_strings(strings: list[str]) -> list[str]:
    return [translate_en_to_ur(s) for s in strings]


def warmup_translation() -> None:
    """Optional cold-start load (call from startup)."""
    if mt_disabled():
        return
    _ensure_loaded()
    if _model is None:
        return
    translate_en_to_ur("High confidence.")
