import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TourProvider } from "@reactour/tour";
import { getSteps, tourConfig } from './data/onboarding.tsx';
import { files } from './data/screenshots';
import Cookies from 'js-cookie';
import App from './App.tsx'
import './index.css'

const hasStats = Boolean(Cookies.get("gamesPlayed"));

const Root = () => (
  <BrowserRouter>
    <TourProvider 
      steps={getSteps(hasStats, files)}
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);