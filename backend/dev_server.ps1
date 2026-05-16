# Dev API - excludes .venv from WatchFiles/Uvicorn reload.

Set-Location $PSScriptRoot
if (-not (Test-Path ".venv\Scripts\uvicorn.exe")) {
    Write-Host "ERROR: backend\.venv missing or uvicorn not installed." -ForegroundColor Red
    Write-Host "Run:" -ForegroundColor Yellow
    Write-Host "  python -m venv .venv" -ForegroundColor White
    Write-Host "  .\.venv\Scripts\Activate.ps1" -ForegroundColor White
    Write-Host "  pip install -r requirements.txt" -ForegroundColor White
    exit 1
}

# Loads DistilBART at startup (set to 0 or empty-string before launch to skip preload).
if (-not $env:KHETIBARI_PRELOAD_SUMMARY) {
    $env:KHETIBARI_PRELOAD_SUMMARY = "1"
}

Write-Host "Starting uvicorn (Grad-CAM off by default; slow on CPU if enabled)." -ForegroundColor Cyan
Write-Host 'Optional heatmap:  $env:KHETIBARI_ENABLE_GRADCAM = "1"' -ForegroundColor DarkGray

# Absolute path required: uvicorn passes this to WatchFilesReload.FileFilter.exclude_dirs.
# Relative ".venv" does not satisfy "exclude_dir in path.parents" for resolved paths on Windows.
$venvExcludePath = (Resolve-Path -LiteralPath ".venv").Path

.\.venv\Scripts\uvicorn.exe main:app `
    --reload `
    --reload-exclude $venvExcludePath `
    --host 127.0.0.1 `
    --port 8000
