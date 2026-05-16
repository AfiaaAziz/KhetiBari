import { ArrowRight, Camera, ClipboardCheck, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export function GuidePage() {
  const { t } = useI18n();
  const photoTips = [t("guide_photo_li_1"), t("guide_photo_li_2"), t("guide_photo_li_3")];

  return (
    <div className="kb-green-sheet flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 lg:px-6 lg:py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-650">{t("guide_eyebrow")}</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-leaf-950">{t("guide_title")}</h1>
        <p className="mt-6 text-lg leading-relaxed text-leaf-900/75">{t("guide_lead")}</p>

        <section className="mt-12 rounded-xl border border-slate-300/90 bg-white p-8 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-teal-650 text-brass-400 shadow-sm ring-1 ring-black/10">
            <Camera className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-leaf-950">{t("guide_photo_h")}</h2>
            <ul className="mt-4 list-inside list-disc space-y-3 text-leaf-900/72 marker:text-teal-650">
              {photoTips.map((line, i) => (
                <li key={i} className="ps-1 leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-300/90 bg-white p-8 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-leaf-950 text-brass-400 shadow-sm ring-1 ring-black/10">
            <Leaf className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-leaf-950">{t("guide_scores_h")}</h2>
            <p className="mt-4 leading-relaxed text-leaf-900/72">{t("guide_scores_p")}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-300/90 bg-white p-8 shadow-panel">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-teal-650 text-brass-400 shadow-sm ring-1 ring-black/10">
            <ClipboardCheck className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-leaf-950">{t("guide_four_h")}</h2>
            <p className="mt-4 leading-relaxed text-leaf-900/72">{t("guide_four_p")}</p>
          </div>
        </div>
      </section>

      <aside className="mt-8 rounded-xl border border-amber-500/30 bg-amber-50/85 p-8 shadow-sm">
        <h2 className="font-display text-lg font-bold text-leaf-950">{t("guide_remember_h")}</h2>
        <p className="mt-3 leading-relaxed text-leaf-900/72">{t("guide_remember_p")}</p>
      </aside>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-650 px-6 py-3.5 text-sm font-semibold text-white shadow-lift ring-1 ring-black/10 hover:bg-teal-550"
        >
          {t("home_cta_primary")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          to="/diseases"
          className="inline-flex items-center justify-center rounded-md border border-slate-300/90 bg-white px-6 py-3.5 text-sm font-semibold text-leaf-950 shadow-sm hover:bg-leaf-50"
        >
          {t("home_cta_secondary")}
        </Link>
      </div>
      </div>
    </div>
  );
}
