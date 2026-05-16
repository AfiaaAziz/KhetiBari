import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { DiseasesPage } from "./pages/DiseasesPage";
import { GuidePage } from "./pages/GuidePage";
import { AnalyzePage } from "./pages/AnalyzePage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/diseases" element={<DiseasesPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/contact" element={<Navigate to="/guide" replace />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Route>
    </Routes>
  );
}
