import { Loader2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import {
  analyzeLeaf,
  fetchSpeechBase64,
  isBackendOfflineError,
  type AnalyzeOk,
  type AnalyzeRejected,
} from "../api/client";
import { CLASS_LABEL_UR } from "../diseaseLabels";
import { useI18n } from "../context/LanguageContext";

export function AnalyzePage() {
  const { lang, t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeOk | null>(null);
  const [reject, setReject] = useState<AnalyzeRejected | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBusy, setAudioBusy] = useState(false);

  const resetOutput = () => {
    setResult(null);
    setReject(null);
    setError(null);
    setAudioUrl(null);
  };

  const onPick = useCallback((f: File | null) => {
    resetOutput();
    if (!f || !/^image\/(jpeg|jpg|png)$/i.test(f.type)) {
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const run = async () => {
    if (!file) return;
    setLoading(true);
    resetOutput();
    try {
      const res = await analyzeLeaf(file, lang);
      if (!res.ok && res.rejected) {
        setReject(res);
      } else if (res.ok) {
        setResult(res);
      }
    } catch (e) {
      if (isBackendOfflineError(e)) {
        setError(`${t("err_backend_title")}\n\n${t("err_backend_intro")}`);
      } else {
        setError(e instanceof Error ? e.message : t("analyze_api_down"));
      }
    } finally {
      setLoading(false);
    }
  };

  const speak = async () => {
    if (!result) return;
    setAudioBusy(true);
    try {
      const b64 = await fetchSpeechBase64(result.report_text, lang);
      setAudioUrl(`data:audio/mpeg;base64,${b64}`);
    } catch (e) {
      if (isBackendOfflineError(e)) {
        setError(`${t("err_backend_title")}\n\n${t("err_backend_intro")}`);
      } else {
        setError(
          lang === "ur"
            ? "آڈیو نہیں بن سکی — سرور پر gTTS نصب کریں۔"
            : "Audio failed — ensure gTTS is installed on the API host."
        );
      }
    } finally {
      setAudioBusy(false);
    }
  };

  return (
    <div className="kb-green-sheet flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-start">
        <h1 className="font-display text-3xl font-bold tracking-tight text-leaf-950 sm:text-4xl">
          {t("analyze_title")}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-leaf-900/68">{t("analyze_sub")}</p>
        </header>

      <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-10">
        {/* Controls — same row height as preview */}
        <div className="flex min-h-0 flex-col gap-4 lg:col-span-5 lg:h-full">
          <label
            htmlFor="leaf-upload"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onPick(e.dataTransfer.files?.[0] ?? null);
            }}
            className="flex min-h-[14rem] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-400/70 bg-white px-6 py-10 text-center shadow-panel transition-colors hover:border-teal-550/55 hover:bg-leaf-50/80 lg:min-h-0"
          >
            <Upload className="h-11 w-11 text-leaf-900/25" strokeWidth={1.25} />
            <p className="mt-5 text-[15px] font-semibold text-leaf-950">{t("analyze_drop")}</p>
            <p className="mt-2 text-xs font-medium text-leaf-900/45">JPG · PNG</p>
            <span className="mt-8 rounded-md bg-teal-650 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brass-400 ring-1 ring-black/10">
              {t("analyze_pick")}
            </span>
            <input
              id="leaf-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
          </label>

          <button
            type="button"
            disabled={!file || loading}
            onClick={run}
            className="flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-teal-650 text-[15px] font-bold text-white shadow-lift ring-1 ring-black/10 transition hover:bg-teal-550 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {loading ? t("analyze_busy") : t("analyze_run")}
          </button>
        </div>

        {/* Preview — fills grid row; width aligned to 7/12 */}
        <div className="mt-10 flex min-h-0 flex-col lg:col-span-7 lg:mt-0 lg:h-full">
          <div className="flex min-h-[16rem] flex-1 flex-col rounded-lg border border-slate-300/90 bg-white p-5 shadow-panel lg:min-h-0 lg:p-6">
            <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-brass-600/90">
              {t("analyze_uploaded")}
            </p>
            {preview ? (
              <div className="mt-4 flex min-h-0 flex-1 items-center justify-center rounded-md border border-slate-200/90 bg-leaf-50/60 p-3 sm:p-4">
                <img
                  src={preview}
                  alt=""
                  className="max-h-[min(420px,52vh)] w-full rounded-md object-contain"
                />
              </div>
            ) : (
              <div className="mt-4 flex min-h-[12rem] flex-1 items-center justify-center rounded-md border border-dashed border-slate-300/90 bg-white/80 px-6 py-12 text-center text-sm text-leaf-900/45 lg:min-h-0">
                {lang === "ur" ? "پیش نظارے کے لیے تصویر منتخب کریں" : "Choose an image to preview"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-width alerts — aligned to main column grid */}
      <div className="mt-10 space-y-4 lg:mt-12">
        {error && (
          <div
            className="rounded-lg border border-rose-200 bg-white px-5 py-4 text-sm leading-relaxed text-rose-900 shadow-sm"
            dir={lang === "ur" ? "rtl" : "ltr"}
          >
            <p className="whitespace-pre-line font-medium">{error}</p>
            <pre className="mt-4 overflow-x-auto rounded-md bg-leaf-950 px-4 py-3 font-mono text-[11px] leading-relaxed text-emerald-100/95">
              {t("err_backend_cmd")}
            </pre>
          </div>
        )}

        {reject && (
          <div
            className="rounded-lg border border-amber-300/90 bg-amber-50/90 px-5 py-5 text-sm shadow-sm"
            dir={lang === "ur" ? "rtl" : "ltr"}
          >
            <p className="font-bold text-amber-950">
              {reject.code === "low_confidence"
                ? t("reject_low_h")
                : reject.code === "ambiguous"
                  ? t("reject_amb_h")
                  : t("reject_non_leaf_h")}
            </p>
            <p className="mt-2 leading-relaxed text-amber-950/88">
              {reject.code === "low_confidence"
                ? t("reject_low_p")
                : reject.code === "ambiguous"
                  ? t("reject_amb_p")
                  : t("reject_non_leaf_p")}
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-14 space-y-8 border-t border-leaf-900/10 pt-14">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div
              className="rounded-lg border border-slate-300/90 bg-white p-6 shadow-panel"
              style={{ borderTopWidth: "4px", borderTopColor: result.accent_color }}
            >
              <h2 className="font-display text-xl font-bold text-leaf-950">{t("analyze_diag")}</h2>
              <p className="mt-4 text-lg font-semibold text-leaf-950">
                {result.disease === "Healthy"
                  ? t("healthy_label")
                  : `${t("disease_label")}: ${result.advisory.display_name}`}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-leaf-900/68">{result.advisory.short}</p>
              <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold text-leaf-900/50">
                  <span>{result.confidence_band}</span>
                  <span>{result.confidence}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-sm bg-leaf-100 ring-1 ring-slate-200/80">
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{
                      width: `${Math.min(100, result.confidence)}%`,
                      backgroundColor: result.accent_color,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-300/90 bg-white p-6 shadow-panel">
              <h2 className="font-display text-xl font-bold text-leaf-950">{t("analyze_probs")}</h2>
              <p className="mt-1 text-xs leading-relaxed text-leaf-900/48">{t("analyze_probs_hint")}</p>
              <div className="mt-6 space-y-3.5">
                {result.probabilities.map((row) => (
                  <div key={row.class}>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={row.class === result.disease ? "text-leaf-950 font-bold" : "text-leaf-900/75"}>
                        {lang === "ur"
                          ? CLASS_LABEL_UR[row.class] ?? row.class
                          : row.class.replace(/_/g, " ")}
                      </span>
                      <span className="tabular-nums text-leaf-900/70">{row.probability}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-sm bg-leaf-100 ring-1 ring-slate-200/80">
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{ width: `${row.probability}%`, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {result.heatmap_png_base64 && (
            <div className="rounded-lg border border-slate-300/90 bg-white p-6 shadow-panel">
              <h2 className="font-display text-xl font-bold text-leaf-950">{t("analyze_heatmap")}</h2>
              <p className="mt-1 text-xs leading-relaxed text-leaf-900/48">{t("analyze_heatmap_hint")}</p>
              <img
                src={`data:image/png;base64,${result.heatmap_png_base64}`}
                alt=""
                className="mt-5 max-h-[420px] w-full rounded-md border border-slate-200/90 bg-leaf-50/80 object-contain"
              />
            </div>
          )}

          <div
            className="rounded-lg border border-slate-300/90 bg-white p-6 shadow-panel"
            style={{ borderTopWidth: "4px", borderTopColor: result.accent_color }}
          >
            <h2 className="font-display text-xl font-bold text-leaf-950">{t("analyze_adv")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-leaf-900/72">{result.advisory.description}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <ListCol title={t("analyze_sym")} items={result.advisory.symptoms} accent={result.accent_color} />
              <ListCol title={t("analyze_tx")} items={result.advisory.treatment} accent={result.accent_color} />
              <ListCol title={t("analyze_prev")} items={result.advisory.prevention} accent={result.accent_color} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="rounded-lg border border-teal-550/25 bg-white p-6 shadow-panel lg:col-span-2 ring-1 ring-black/[0.04]">
              <h2 className="font-display text-xl font-bold text-leaf-950">{t("analyze_summary")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-leaf-900/85">{result.summary}</p>
            </div>
            <div className="rounded-lg border border-slate-300/90 bg-white p-6 shadow-panel">
              <h2 className="font-display text-xl font-bold text-leaf-950">{t("analyze_listen")}</h2>
              <p className="mt-2 text-xs leading-relaxed text-leaf-900/48">{t("analyze_listen_hint")}</p>
              <button
                type="button"
                disabled={audioBusy}
                onClick={speak}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-teal-650 text-sm font-semibold text-white ring-1 ring-black/10 transition hover:bg-teal-550 disabled:opacity-50"
              >
                {audioBusy ? "…" : t("analyze_audio_btn")}
              </button>
              {audioUrl && <audio controls src={audioUrl} className="mt-4 w-full" />}
            </div>
          </div>

          <details className="group rounded-lg border border-slate-300/90 bg-white p-6 shadow-panel">
            <summary className="cursor-pointer font-display text-lg font-bold text-leaf-950 marker:text-brass-600">
              {t("analyze_report")}
            </summary>
            <pre className="mt-5 whitespace-pre-wrap rounded-md bg-[#0f1713] p-5 font-mono text-[11px] leading-relaxed text-emerald-50/90">
              {result.report_text}
            </pre>
          </details>
        </div>
      )}
      </div>
    </div>
  );
}

function ListCol({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-brass-600">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-leaf-900/82">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm" style={{ backgroundColor: accent }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
