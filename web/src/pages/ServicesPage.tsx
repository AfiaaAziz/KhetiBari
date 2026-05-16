import { Activity, Brain, ClipboardList, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "../context/LanguageContext";

export function ServicesPage() {
  const { t } = useI18n();
  const blocks: { icon: ReactNode; h: string; p: string }[] = [
    { icon: <Activity className="h-6 w-6" />, h: t("services_s1_h"), p: t("services_s1_p") },
    { icon: <Brain className="h-6 w-6" />, h: t("services_s2_h"), p: t("services_s2_p") },
    { icon: <ClipboardList className="h-6 w-6" />, h: t("services_s3_h"), p: t("services_s3_p") },
    { icon: <Volume2 className="h-6 w-6" />, h: t("services_s4_h"), p: t("services_s4_p") },
  ];

  return (
    <div className="kb-green-sheet flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 lg:px-6">
        <h1 className="font-display text-4xl font-bold text-leaf-950">{t("services_title")}</h1>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {blocks.map((b) => (
            <div
              key={b.h}
              className="rounded-lg border border-slate-300/90 bg-white p-8 shadow-panel"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-650 text-brass-400 shadow-sm ring-1 ring-black/10">
                {b.icon}
              </div>
              <h2 className="mt-5 text-xl font-semibold text-leaf-950">{b.h}</h2>
              <p className="mt-3 text-leaf-900/68 leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
