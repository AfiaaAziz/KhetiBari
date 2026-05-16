# KhetiBari — Full-stack crop screening

## Quick start (step by step)

1. **Weights:** ensure `new.pth` exists at the **repo root** (or under `models/`), or keep using `models/best_corn_model.pth`. The API picks the first file it finds in the search order below.
2. **Terminal A — API** (always from **`backend`**):
   ```powershell
   cd E:\OneDrive\Desktop\KhetiBari\backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   .\dev_server.ps1
   ```
   Wait until you see **`Application startup complete`** (first run downloads Marian/BART; can take minutes).
3. **Terminal B — Web UI:**
   ```powershell
   cd E:\OneDrive\Desktop\KhetiBari\web
   npm install
   npm run dev
   ```
4. Open **`http://localhost:5173`** (use this URL — **not** `127.0.0.1:8000`; that is the API JSON host only).

**Important:** Always use **`backend\.venv`** only. Do **not** create a second **`KhetiBari\.venv`** at the repo root — it causes confusion. Use **`.\dev_server.ps1`** instead of bare `uvicorn --reload`; it excludes `.venv` from WatchFiles so Analyze doesn’t hang (see Run API).

**Stack:** FastAPI serves the vision model + optional NLP; React is the UI. Active code lives in **`backend/`** and **`web/`** only.

## Layout

```
├── backend/              # FastAPI API + notebooks + dev_server.ps1
├── web/                  # React SPA (react-router + Vite)
└── models/               # optional: new.pth or best_corn_model.pth (see .gitkeep)
```

### Model weights (`.pth`)

Search order when **`KHETIBARI_MODEL_PATH`** is unset:

1. `new.pth` (repo root — default for the latest shared checkpoint)
2. `models/new.pth`
3. `models/best_corn_model.pth`
4. `KhetiBari/best_corn_model.pth`

Override explicitly:

```powershell
$env:KHETIBARI_MODEL_PATH = "C:\path\to\your_weights.pth"
```

### Offline Urdu text (translation)

Urdu advisory copy is **generated from the English source** using **`Helsinki-NLP/opus-mt-en-ur`** (runs locally with `transformers`). First API use downloads weights (~300MB) into the Hugging Face cache; afterward it works **offline**.

| Variable | Effect |
|----------|--------|
| `KHETIBARI_DISABLE_MT=1` | Skip Marian; Urdu mode falls back to English strings |
| `KHETIBARI_PRELOAD_MT=1` | Load Marian at API startup (slower boot, faster first Urdu request) |
| `KHETIBARI_MT_MODEL=<hub id>` | Override pretrained model id (advanced) |

Minimal Colab demo: `backend/notebooks/offline_en_ur_marian.ipynb`.

## Run API (terminal 1)

**Recommended on Windows:** run **`dev_server.ps1`** so auto-reload ignores **`.venv`**. Without a proper exclude, WatchFiles/Uvicorn will treat edits under **`site-packages`** as app changes — you see a huge **“Detected changes in …”** line and endless reloads (**Analyze** can sit on **“Running model…”**). Uvicorn’s Windows filter compares **resolved** paths, so **`--reload-exclude` must be the absolute `.venv` path**, not bare `".venv"`, and avoid glob patterns like **`**/site-packages/**`** (they expand to enormous directory lists internally).

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\dev_server.ps1
```

Minimal manual uvicorn with the same exclusions:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --reload-exclude (Resolve-Path .venv).Path --host 127.0.0.1 --port 8000
```

Check: http://127.0.0.1:8000/api/health — returns `model_loaded`, `model_path`, `translation_ready`.

### Analyzer / summariser (optional env)

| Variable | Effect |
|----------|--------|
| `KHETIBARI_ENABLE_GRADCAM=1` | Enables Grad-CAM heatmap (**slow on CPU**). Off by default. |
| `KHETIBARI_SKIP_GRADCAM=1` | Explicitly disables heatmap even if `ENABLE_GRADCAM` is set |
| `KHETIBARI_PRELOAD_SUMMARY=1` | Load DistilBART at startup ( `dev_server.ps1` sets this by default ). |

## Run web (terminal 2)

```powershell
cd web
npm install
npm run dev
```

Open http://localhost:5173 — Vite proxies `/api` → FastAPI.

### Troubleshooting: “Internal Server Error” / Diseases page failed to load

If only **`npm run dev`** is running, the browser calls **`/api/...`**, which Vite forwards to **`127.0.0.1:8000`**. When FastAPI is **off**, you get connection refused.

**Always run both terminals:** API first (`uvicorn ... --port 8000`), then the React dev server. When the API is down, the site shows a **banner** plus Urdu/English copy‑pastable commands.

### PyTorch `.pth` loading on newer versions

Checkpoints need `weights_only=False`; `backend/inference.py` handles this.

### Production API URL

If the SPA is hosted separately from the API, build with:

```powershell
$env:VITE_API_URL = "https://your-api.example.com"
npm run build
```

Leave unset when using the dev proxy or same-origin `/api`.

### CORS

Set `KHETIBARI_CORS_ORIGINS` (comma-separated) on the API host if the frontend origin differs from the defaults.

## API overview

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Model path, load status, Marian availability |
| GET | `/api/meta/diseases` | Advisory payloads (Urdu generated via Marian) |
| POST | `/api/analyze` | multipart `file` + form `language` (`en` \| `ur`) |
| POST | `/api/speech` | JSON `{ "text", "lang" }` → base64 MP3 |

## Stack choices

- **React Router** multi-page UX without a heavyweight SSR framework.
- **Tailwind** for consistent spacing/typography.
- **FastAPI** for typed APIs, multipart uploads, and straightforward deployment behind nginx or cloud load balancers.
- **Marian MT** for maintainable Urdu output without duplicating static translations in code.
