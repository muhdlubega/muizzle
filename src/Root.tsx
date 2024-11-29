import { TourProvider } from "@reactour/tour";
import Cookies from "js-cookie";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import { tourConfig } from "./config/tourConfig.ts";
import { getSteps } from "./data/onboarding.tsx";
import "./index.css";

const Root = () => {
  const hasStats = Boolean(Cookies.get("gamesPlayed"));
  return (
    <BrowserRouter>
      <TourProvider
        steps={getSteps(hasStats)}
        styles={tourConfig.styles}
        showNavigation={true}
        position="bottom"
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TourProvider>
    </BrowserRouter>
  );
};

export default Root;
