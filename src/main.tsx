import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TourProvider } from "@reactour/tour";
import { getSteps, tourConfig } from './data/onboarding.tsx';
import { files } from './data/screenshots';
import Cookies from 'js-cookie';
import App from './App.tsx'
import './index.css'

const hasStats = Boolean(Cookies.get("gamesPlayed"));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TourProvider steps={getSteps(hasStats, files)}
      styles={tourConfig.styles}
      showNavigation={true}
      position="bottom" >
      <App />
    </TourProvider>
  </StrictMode>,
)
