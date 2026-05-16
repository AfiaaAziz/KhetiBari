import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BackendBanner } from "../components/BackendBanner";
import { useI18n } from "../context/LanguageContext";

function navLinkClass(isActive: boolean): string {
  const base =
    "text-sm font-semibold py-2 border-b-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-550/40 rounded-sm";
  return isActive
    ? `${base} text-leaf-950 border-teal-550`
    : `${base} text-leaf-900/70 border-transparent hover:text-leaf-950 hover:border-leaf-900/15`;
}

export function SiteLayout() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col kb-page-bg">
      <header className="sticky top-0 z-40 border-b border-slate-300/80 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.92)_inset]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-leaf-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-leaf-950 text-brass-400 shadow-sm ring-1 ring-black/10">
              <Leaf className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-none">
              Kheti<span className="text-teal-550">Bari</span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)} end>
              {t("nav_home")}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => navLinkClass(isActive)}>
              {t("nav_about")}
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => navLinkClass(isActive)}>
              {t("nav_services")}
            </NavLink>
            <NavLink to="/diseases" className={({ isActive }) => navLinkClass(isActive)}>
              {t("nav_diseases")}
            </NavLink>
            <NavLink to="/guide" className={({ isActive }) => navLinkClass(isActive)}>
              {t("nav_guide")}
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ur" : "en")}
              className="rounded-md border border-slate-300/90 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-leaf-950 shadow-sm hover:bg-leaf-50"
            >
              {lang === "en" ? t("lang_toggle") : t("lang_en_short")}
            </button>
            <NavLink
              to="/analyze"
              className="hidden sm:inline-flex rounded-md bg-teal-650 px-4 py-2.5 text-sm font-semibold text-white shadow-lift ring-1 ring-black/10 hover:bg-teal-550"
            >
              {t("nav_analyze")}
            </NavLink>
            <button
              type="button"
              className="md:hidden rounded-md border border-slate-300/90 bg-white p-2 shadow-sm"
              aria-label="Menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 flex flex-col gap-1 shadow-inner">
            <NavLink to="/" end className="py-2 text-sm font-semibold text-leaf-900" onClick={() => setOpen(false)}>
              {t("nav_home")}
            </NavLink>
            <NavLink to="/about" className="py-2 text-sm font-semibold text-leaf-900" onClick={() => setOpen(false)}>
              {t("nav_about")}
            </NavLink>
            <NavLink to="/services" className="py-2 text-sm font-semibold text-leaf-900" onClick={() => setOpen(false)}>
              {t("nav_services")}
            </NavLink>
            <NavLink to="/diseases" className="py-2 text-sm font-semibold text-leaf-900" onClick={() => setOpen(false)}>
              {t("nav_diseases")}
            </NavLink>
            <NavLink to="/guide" className="py-2 text-sm font-semibold text-leaf-900" onClick={() => setOpen(false)}>
              {t("nav_guide")}
            </NavLink>
            <NavLink
              to="/analyze"
              className="mt-2 rounded-md bg-teal-650 px-4 py-3 text-center text-white font-semibold shadow-sm"
              onClick={() => setOpen(false)}
            >
              {t("nav_analyze")}
            </NavLink>
          </div>
        )}
      </header>

      <BackendBanner />

      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800/80 bg-leaf-950 text-leaf-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div>
            <div className="font-display text-lg font-semibold text-white">
              Kheti<span className="text-brass-400">Bari</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{t("footer_tagline")}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wide text-white/40">
            <span className="rounded-md border border-white/10 px-2 py-1">EfficientNet-B0</span>
            <span className="rounded-md border border-white/10 px-2 py-1">Grad-CAM</span>
            <span className="rounded-md border border-white/10 px-2 py-1">DistilBART</span>
            <span className="rounded-md border border-white/10 px-2 py-1">Marian EN→UR</span>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/35">
          {t("footer_rights")}
        </div>
      </footer>
    </div>
  );
}
