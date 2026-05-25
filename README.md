# KhetiBari

KhetiBari is a small full-stack app for **maize (corn) leaf disease screening**. You upload a photo through the web UI; a vision model classifies it into one of five labels (blight, common rust, gray leaf spot, healthy, or “not a leaf”), and the API returns structured advice plus optional Urdu localization and short text/audio helpers.

This repo is geared toward **developers** wiring up the API and React UI. It is **not** a substitute for a field agronomist—treat predictions as aids, validate in the field, and follow local extension guidance.

---

## What’s in the box

| Piece | Role |
|--------|------|
| **FastAPI backend** (`backend/`) | Loads a PyTorch **EfficientNet** checkpoint, runs inference, exposes JSON endpoints under `/api`. |
| **React + Vite frontend** (`web/`) | Multi-page SPA: analyze flow, disease reference, bilingual (EN/UR) copy where supported. |
| **Model weights** (`models/best_corn_model.pth`) | Five-class head matching `CLASS_NAMES` in `backend/advisory.py`. |
| **Marian EN→UR** | On-device translation for advisory text via `Helsinki-NLP/opus-mt-en-ur` (first run downloads ~300MB). |
| **Optional NLP** | DistilBART summarization and gTTS-based speech for some flows (see env vars below). |

The model can return **`Non_Leaf`** when the image is not a usable maize leaf. The API surfaces that as a dedicated **`non_leaf`** response so the UI can ask for a better photo instead of showing a disease label.

---

## Prerequisites

- **Python 3.10+** (3.11 is fine; match what you use to train if you swap checkpoints).
- **Node.js 18+** and npm (for the Vite dev server and production build).
- **PyTorch** installs via `pip` from `backend/requirements.txt`; a GPU helps training and batch jobs but CPU inference works for demos.
- Disk space for the first Hugging Face download if you enable Urdu machine translation (~300MB for Marian).

---

## Repository layout

```
KhetiBari/
├── backend/
│   ├── main.py           # FastAPI app and routes
│   ├── inference.py      # Weight loading, predict, Grad-CAM hooks
│   ├── advisory.py       # Class order, disease copy, Urdu display names
│   ├── translate_en_ur.py
│   ├── nlp_audio.py
│   ├── requirements.txt
│   └── dev_server.ps1    # Windows-friendly uvicorn reload (excludes .venv)
├── web/
│   ├── src/              # React pages and API client
│   └── vite.config.ts    # Proxies /api → http://127.0.0.1:8000
├── models/
│   └── best_corn_model.pth   # Place trained weights here (see below)
├── scripts/                  # Dataset / tooling helpers
└── Corn.ipynb                # Notebook used in the modelling workflow (paths may need adjusting)
```

Only **`backend/`** and **`web/`** need to run for the product experience; notebooks and scripts are supporting material.

---

## Quick start

You need **two terminals**: API on port **8000**, UI on **5173**. Use **`http://localhost:5173`** in the browser—the Vite dev server proxies `/api` to FastAPI. Opening `127.0.0.1:8000` directly only shows the raw API.

### 1. Model file

Put your trained weights at **`models/best_corn_model.pth`**, or point the API elsewhere:

```powershell
$env:KHETIBARI_MODEL_PATH = "C:\path\to\your_weights.pth"
```

If `KHETIBARI_MODEL_PATH` is unset, the loader looks for `models/best_corn_model.pth`, then a fallback path compatible with an alternate folder layout (see `backend/inference.py`).

Class order in the checkpoint must align with **`CLASS_NAMES`** in `backend/advisory.py`:  
`Blight`, `Common_Rust`, `Gray_Leaf_Spot`, `Healthy`, `Non_Leaf`.

### 2. Backend (terminal 1)

From the **repository root**, go into `backend`, create **one** virtualenv **inside `backend`** (do not put a second `.venv` at the repo root—it confuses tooling and reload watchers):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\dev_server.ps1
```

Wait until logs show **`Application startup complete`**. First boot may pull Marian/BART weights; on a slow line that can take several minutes.

**macOS / Linux** users: activate with `source .venv/bin/activate` and run uvicorn manually if you skip the PowerShell script:

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
export KHETIBARI_PRELOAD_SUMMARY=1   # optional; matches dev_server.ps1 default
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

On Windows, prefer **`dev_server.ps1`** over bare `--reload`: it excludes **`backend/.venv`** from WatchFiles so changes under `site-packages` do not trigger endless reloads (which otherwise leaves “Analyze” stuck on “Running model…”).

Sanity check: open [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health) — you should see `model_loaded`, `model_path`, and translation status.

### 3. Frontend (terminal 2)

```powershell
cd web
npm install
npm run dev
```

Then open **http://localhost:5173**.

If you see failures only on `/api/...` routes, the UI is up but **FastAPI is not**—start terminal 1 first.

---

## Environment variables (API)

### Model and vision

| Variable | Purpose |
|----------|---------|
| `KHETIBARI_MODEL_PATH` | Explicit path to the `.pth` checkpoint. |
| `KHETIBARI_ENABLE_GRADCAM=1` | Enable Grad-CAM heatmaps (**slow on CPU**). |
| `KHETIBARI_SKIP_GRADCAM=1` | Force heatmaps off even if enabled elsewhere. |

### Urdu translation (Marian)

| Variable | Purpose |
|----------|---------|
| `KHETIBARI_DISABLE_MT=1` | Skip Marian; Urdu mode falls back to English strings where applicable. |
| `KHETIBARI_PRELOAD_MT=1` | Load Marian at startup (slower boot, faster first Urdu request). |
| `KHETIBARI_MT_MODEL=<hub id>` | Override the Hugging Face model id (advanced). |

### Summarizer / dev server

| Variable | Purpose |
|----------|---------|
| `KHETIBARI_PRELOAD_SUMMARY=1` | Preload DistilBART at startup (`dev_server.ps1` sets this on Windows). |

### CORS

| Variable | Purpose |
|----------|---------|
| `KHETIBARI_CORS_ORIGINS` | Comma-separated list of allowed browser origins if the SPA is not on localhost. |

---

## Frontend production build

Default dev setup assumes the UI talks to `/api` on the same origin via Vite’s proxy. If you host the built static files separately, point them at your API:

```powershell
cd web
$env:VITE_API_URL = "https://your-api.example.com"
npm run build
```

Leave `VITE_API_URL` unset when using the dev proxy or same-origin `/api`.

---

## API surface (short reference)

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/api/health` | Model path, load flags, Marian availability. |
| `GET` | `/api/meta/diseases` | Disease cards; Urdu text generated or cached via Marian when enabled. |
| `POST` | `/api/analyze` | Multipart form: `file` (image), `language` = `en` or `ur`. |
| `POST` | `/api/speech` | JSON `{ "text", "lang" }` → base64 MP3 payload. |

For request/response shapes, read the handlers in `backend/main.py`.

---

## Troubleshooting

- **“Internal Server Error” or empty disease list in the browser** — Almost always means the API is down. Confirm `http://127.0.0.1:8000/api/health` responds, then refresh the UI.
- **Analyze hangs on “Running model…”** — On Windows, use `dev_server.ps1` so reload does not watch `.venv`. If you hand-roll uvicorn, pass an **absolute** `--reload-exclude` for `.venv` (see comments in `dev_server.ps1`).
- **PyTorch load errors on new torch versions** — Checkpoints may need `weights_only=False`; `backend/inference.py` already accounts for this for the supported stack.
- **Urdu first request is slow** — Expected until Marian is cached; set `KHETIBARI_PRELOAD_MT=1` if you want cost paid at startup.

---

## Stack (why these choices)

- **React + React Router + Vite** — Fast local dev, simple deployment of static assets, no SSR requirement for this use case.
- **Tailwind** — Consistent spacing and typography without a heavy component library.
- **FastAPI** — Typed endpoints, multipart uploads, easy to put behind nginx or a cloud load balancer.
- **Marian MT** — Keeps Urdu advisory text maintainable from a single English source instead of duplicating long static copy in code.

---

## Notes for contributors

Training and experimentation live primarily in **`Corn.ipynb`** and supporting scripts under **`scripts/`**. If you change the number of classes or label order, update **`backend/advisory.py`**, retrain, and replace **`models/best_corn_model.pth`** (or set `KHETIBARI_MODEL_PATH`) so the API and UI stay in sync.
