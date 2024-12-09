import { TourProvider } from "@reactour/tour";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { tourConfig } from "./config/tourConfig";
import { getSteps } from "./data/onboarding";
import { Language } from "./types/types";
import './index.css'

const Root = () => {
  const preferredLanguage = localStorage.getItem("preferredLanguage") as Language || "tamil";
  
  const ensureLangParam = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.get("lang")) {
      searchParams.set("lang", preferredLanguage === "tamil" ? "TA" : preferredLanguage === "hindi" ? "HI" : "EN");
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  useEffect(() => {
    ensureLangParam();
  }, []);

  return (
    <BrowserRouter>
      <TourProvider steps={getSteps()} styles={tourConfig.styles} showNavigation={true} position="bottom">
        <Routes>
          <Route path="/" element={<AppWrapper />} />
          <Route path="/privacy" element={<PrivacyWrapper />} />
          <Route path="/about" element={<AboutWrapper />} />
          <Route path="/contact" element={<ContactWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TourProvider>
    </BrowserRouter>
  );
};

const AppWrapper = () => <RouteWrapper Component={App} />;
const PrivacyWrapper = () => <RouteWrapper Component={Privacy} />;
const AboutWrapper = () => <RouteWrapper Component={About} />;
const ContactWrapper = () => <RouteWrapper Component={Contact} />;

const RouteWrapper = ({ Component }: { Component: React.ComponentType<{ language: Language }> }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lang = searchParams.get("lang") as keyof typeof languageMapping || "TA";
  const language = languageMapping[lang];
  
  return <Component language={language} />;
};

const languageMapping: Record<string, Language> = {
  TA: "tamil",
  HI: "hindi",
  EN: "english",
};

export default Root;
