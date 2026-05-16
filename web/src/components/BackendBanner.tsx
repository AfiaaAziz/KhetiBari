import { AlertTriangle, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchHealth } from "../api/client";
import { useI18n } from "../context/LanguageContext";

type Banner = "loading" | "none" | "offline" | "no_model";

export function BackendBanner() {
  const { t } = useI18n();
  const [banner, setBanner] = useState<Banner>("loading");

  useEffect(() => {
    let alive = true;
    async function tick() {
      const h = await fetchHealth();
      if (!alive) return;
      if (!h) setBanner("offline");
      else if (!h.model_path_exists || !h.model_loaded) setBanner("no_model");
      else setBanner("none");
    }
    tick();
    const id = setInterval(tick, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (banner === "loading" || banner === "none") return null;

  const offline = banner === "offline";

  return (
    <div
      className={
        offline
          ? "border-b border-rose-200 bg-gradient-to-r from-rose-50 via-white to-amber-50"
          : "border-b border-amber-200 bg-gradient-to-r from-amber-50 to-white"
      }
      role="status"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-6 lg:px-8">
        <div className="flex shrink-0 items-start gap-2 sm:items-center">
          <AlertTriangle
            className={`mt-0.5 h-5 w-5 shrink-0 sm:mt-0 ${offline ? "text-rose-600" : "text-amber-600"}`}
          />
          <div>
            <p className={`font-semibold ${offline ? "text-rose-900" : "text-amber-950"}`}>
              {offline ? t("err_backend_title") : t("warn_model_title")}
            </p>
            <p className={`mt-1 max-w-3xl leading-relaxed ${offline ? "text-rose-900/80" : "text-amber-950/85"}`}>
              {offline ? t("err_backend_intro") : t("warn_model_intro")}
            </p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-leaf-900/45">
            <Terminal className="h-3.5 w-3.5" />
            {t("err_backend_terminal")}
          </div>
          <pre className="mt-2 overflow-x-auto rounded-md bg-leaf-950 px-4 py-3 font-mono text-[11px] leading-relaxed text-emerald-100/95 shadow-inner">
            {t("err_backend_cmd")}
          </pre>
        </div>
      </div>
    </div>
  );
}
