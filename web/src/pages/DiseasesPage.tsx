import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDiseaseMeta, type DiseaseMeta, isDiseasesMetaTimeoutError } from "../api/client";
import { CLASS_LABEL_UR } from "../diseaseLabels";
import { useI18n } from "../context/LanguageContext";

export function DiseasesPage() {
  const { lang, t } = useI18n();
  const [meta, setMeta] = useState<DiseaseMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadErr(false);
    setTimedOut(false);
    fetchDiseaseMeta()
      .then((d) => {
        if (!cancelled) setMeta(d);
      })
      .catch((err) => {
        if (!cancelled) {
          if (isDiseasesMetaTimeoutError(err)) setTimedOut(true);
          else setLoadErr(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="kb-green-sheet flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-start">
        <h1 className="font-display text-3xl font-bold tracking-tight text-leaf-950 sm:text-4xl">
          {t("diseases_title")}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-leaf-900/58">{t("diseases_sub")}</p>
      </div>

      {loading && (
        <div className="mt-14 flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-10 w-10 animate-spin text-brass-600" />
          <p className="text-sm font-medium text-leaf-900/45">{lang === "ur" ? "لوڈ ہو رہا ہے…" : "Loading reference…"}</p>
          <div className="mt-8 grid w-full max-w-4xl gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-lg bg-white shadow-inner ring-1 ring-slate-300/60" />
            ))}
          </div>
        </div>
      )}

      {!loading && timedOut && (
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-amber-200 bg-amber-50/90 px-6 py-8 text-start shadow-panel">
          <p className="font-display text-xl font-bold text-amber-950">{t("diseases_timeout_h")}</p>
          <p className="mt-3 text-sm leading-relaxed text-amber-950/88">{t("diseases_timeout_p")}</p>
          <button
            type="button"
            className="mt-6 rounded-md bg-teal-650 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-black/10 hover:bg-teal-550"
            onClick={() => window.location.reload()}
          >
            {lang === "ur" ? "دوبارہ لوڈ کریں" : "Refresh page"}
          </button>
        </div>
      )}

      {!loading && loadErr && (
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-rose-200 bg-white px-6 py-8 text-start shadow-panel">
          <p className="font-display text-xl font-bold text-rose-900">{t("err_backend_title")}</p>
          <p className="mt-3 text-sm leading-relaxed text-rose-900/85">{t("err_backend_intro")}</p>
          <pre className="mt-6 overflow-x-auto rounded-md bg-leaf-950 px-4 py-4 font-mono text-[11px] leading-relaxed text-emerald-100/95">
            {t("err_backend_cmd")}
          </pre>
        </div>
      )}

      {!loading && !loadErr && !timedOut && meta && (
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-10">
          {meta.items.map((item) => {
            const adv = lang === "ur" ? item.advisory_ur : item.advisory_en;
            const title =
              lang === "ur" ? CLASS_LABEL_UR[item.key] ?? item.key : item.key.replace(/_/g, " ");
            return (
              <article
                key={item.key}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-300/90 bg-white shadow-panel transition hover:-translate-y-px hover:shadow-lift"
              >
                <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: item.color }} aria-hidden />
                <div className="flex flex-1 flex-col p-8">
                  <h2 className="font-display text-2xl font-bold text-leaf-950">{title}</h2>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-leaf-900/72">{adv.short}</p>
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-leaf-900/78">{adv.description}</p>
                  <div className="mt-8 border-t border-leaf-900/8 pt-6">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-brass-600">
                      {t("analyze_sym")}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-leaf-900/75">
                      {adv.symptoms.slice(0, 4).map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-sm bg-teal-550/90" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
