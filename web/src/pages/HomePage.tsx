import type { ReactNode } from "react";
import { ArrowRight, Cpu, Layers, Leaf, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import type { Lang } from "../translations";

export function HomePage() {
  const { t, lang } = useI18n();

  return (
    <>
      <section className="relative overflow-hidden border-b border-black/15 bg-[#071814] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 65% at 18% 18%, rgba(20, 167, 139, 0.45), transparent 55%), radial-gradient(ellipse 70% 50% at 88% 12%, rgba(201, 162, 39, 0.22), transparent 50%), linear-gradient(165deg, rgba(7, 24, 20, 0.15), transparent 40%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_42%,transparent_58%,rgba(20,167,139,0.06)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:px-8 lg:py-28">
          <p className="mb-5 inline-flex rounded-md border border-white/20 bg-white/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brass-400">
            {t("home_eyebrow")}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.12] md:text-5xl lg:text-[3.35rem]">
            <span className="text-brass-400">{t("home_head_a")}</span>
            <br />
            <span className="text-white">{t("home_head_b")}</span>
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-white/72">{t("home_lead")}</p>
          <div className="mt-11 flex flex-wrap gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 rounded-md bg-brass-500 px-6 py-3.5 text-sm font-bold text-leaf-950 shadow-lg shadow-black/25 ring-1 ring-black/10 hover:bg-brass-400"
            >
              {t("home_cta_primary")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/diseases"
              className="inline-flex rounded-md border border-white/25 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/12"
            >
              {t("home_cta_secondary")}
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-white/12 pt-12 md:grid-cols-4 lg:mt-20">
            <Stat label={t("stat_acc")} value="93.5%" />
            <Stat label={t("stat_cls")} value="4" />
            <Stat label={t("stat_imgs")} value="4,188" />
            <Stat label={t("stat_time")} value={"<1s"} />
          </dl>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-650">{t("steps_sub")}</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-leaf-950">{t("steps_title")}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StepCard
              lang={lang}
              icon={<Leaf className="h-6 w-6" />}
              title={t("s1_h")}
              body={t("s1_p")}
              step="01"
            />
            <StepCard
              lang={lang}
              icon={<Cpu className="h-6 w-6" />}
              title={t("s2_h")}
              body={t("s2_p")}
              step="02"
            />
            <StepCard
              lang={lang}
              icon={<Layers className="h-6 w-6" />}
              title={t("s3_h")}
              body={t("s3_p")}
              step="03"
            />
            <StepCard
              lang={lang}
              icon={<ShieldCheck className="h-6 w-6" />}
              title={t("s4_h")}
              body={t("s4_p")}
              step="04"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-300/70 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-leaf-950">{t("band_h")}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-leaf-900/65">{t("band_p")}</p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex w-fit rounded-md bg-teal-650 px-7 py-3.5 text-sm font-semibold text-white shadow-lift ring-1 ring-black/10 hover:bg-teal-550"
          >
            {t("home_cta_primary")}
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-white/50">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-bold text-brass-400 tabular-nums">{value}</dd>
    </div>
  );
}

const EASTERN_ARABIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function formatStepLabel(step: string, lang: Lang): string {
  if (lang !== "ur") return step;
  return step.replace(/\d/g, (d) => EASTERN_ARABIC_DIGITS[Number.parseInt(d, 10)] ?? d);
}

function StepCard({
  icon,
  title,
  body,
  step,
  lang,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  step: string;
  lang: Lang;
}) {
  const stepDisplay = formatStepLabel(step, lang);
  return (
    <div className="relative rounded-lg border border-slate-300/80 bg-white p-6 shadow-panel transition-shadow hover:shadow-lift">
      <span
        className="pointer-events-none absolute end-5 top-4 font-display text-5xl font-bold text-leaf-950/[0.07]"
        aria-hidden
      >
        {stepDisplay}
      </span>
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-650 text-brass-400 shadow-sm ring-1 ring-black/10">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-leaf-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-leaf-900/62">{body}</p>
    </div>
  );
}
