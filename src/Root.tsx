import { TourProvider } from "@reactour/tour";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import { tourConfig } from "./config/tourConfig.ts";
import { getSteps } from "./data/onboarding.tsx";
import "./index.css";
import Privacy from "./pages/Privacy.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";

const Root = () => {
  return (
    <BrowserRouter>
      <TourProvider
        steps={getSteps()}
        styles={tourConfig.styles}
        showNavigation={true}
        position="bottom"
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TourProvider>
    </BrowserRouter>
  );
};

export default Root;
