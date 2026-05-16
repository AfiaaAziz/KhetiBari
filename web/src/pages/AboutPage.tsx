import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, BookOpen, Languages, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export function AboutPage() {
  const { t } = useI18n();

  const pillars: { icon: ReactNode; title: string; body: string }[] = [
    {
      icon: <Sprout className="h-6 w-6" aria-hidden />,
      title: t("about_cap_1_title"),
      body: t("about_cap_1_body"),
    },
    {
      icon: <BookOpen className="h-6 w-6" aria-hidden />,
      title: t("about_cap_2_title"),
      body: t("about_cap_2_body"),
    },
    {
      icon: <Languages className="h-6 w-6" aria-hidden />,
      title: t("about_cap_3_title"),
      body: t("about_cap_3_body"),
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-black/15 bg-[#071814] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 85% 60% at 15% 15%, rgba(20, 167, 139, 0.42), transparent 55%), radial-gradient(ellipse 65% 45% at 90% 8%, rgba(201, 162, 39, 0.2), transparent 48%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
          <p className="mb-4 inline-flex rounded-md border border-white/20 bg-white/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brass-400">
            {t("about_eyebrow")}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">{t("about_title")}</h1>
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-white/72">{t("about_subtitle")}</p>
        </div>
      </section>

      <div className="kb-green-sheet flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 lg:px-8 lg:pb-20 lg:pt-10">
          <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-leaf-900/82">
            <p>{t("about_para_1")}</p>
            <p>{t("about_para_2")}</p>
            <p>{t("about_para_3")}</p>
          </div>

          <h2 className="mt-16 font-display text-2xl font-bold text-leaf-950 md:text-3xl">
            {t("about_capabilities_title")}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.title}
                className="rounded-lg border border-slate-300/85 bg-white p-7 shadow-panel transition-shadow hover:shadow-lift"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-650 text-brass-400 shadow-sm ring-1 ring-black/10">
                  {p.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-leaf-950">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-leaf-900/68">{p.body}</p>
              </article>
            ))}
          </div>

          <aside
            className="mt-14 flex gap-4 rounded-lg border border-amber-500/35 bg-amber-50/90 p-6 shadow-sm md:gap-5 md:p-8"
            role="note"
          >
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-700/85" aria-hidden />
            <div>
              <h2 className="font-display text-lg font-bold text-leaf-950">{t("about_trust_title")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-leaf-900/75 md:text-[15px]">{t("about_trust_body")}</p>
            </div>
          </aside>

          <section className="mt-14 flex flex-col gap-6 rounded-xl border border-slate-300/80 bg-white px-8 py-10 shadow-panel md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold text-leaf-950">{t("about_cta_title")}</h2>
              <p className="mt-3 leading-relaxed text-leaf-900/68">{t("about_cta_body")}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-650 px-6 py-3.5 text-sm font-semibold text-white shadow-lift ring-1 ring-black/10 hover:bg-teal-550"
              >
                {t("home_cta_primary")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                to="/diseases"
                className="inline-flex items-center justify-center rounded-md border border-slate-300/90 bg-leaf-50 px-6 py-3.5 text-sm font-semibold text-leaf-950 shadow-sm hover:bg-white"
              >
                {t("home_cta_secondary")}
              </Link>
              <Link
                to="/guide"
                className="inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
              >
                {t("nav_guide")}
              </Link>
            </div>
          </section>
        </div>
      </div>    </>
  );
}
