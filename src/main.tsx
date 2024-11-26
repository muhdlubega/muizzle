import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TourProvider } from "@reactour/tour";
import { getSteps, tourConfig } from './data/onboarding.tsx';
import { imageService } from './data/imageService';
import Cookies from 'js-cookie';
import App from './App.tsx'
import './index.css'
import React from 'react';

const Root = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [screenshots, setScreenshots] = React.useState<string[]>([]);
  const hasStats = Boolean(Cookies.get("gamesPlayed"));

  React.useEffect(() => {
    const loadScreenshots = async () => {
      try {
        const folders = await imageService.getAllFolders();
        const allScreenshots: string[] = [];

        for (const folder of folders) {
          const folderScreenshots = await imageService.getScreenshots(folder);
          folderScreenshots.forEach(screenshot => {
            allScreenshots.push(`${screenshot.folder}/${screenshot.movieId}-${screenshot.index}`);
          });
        }

        setScreenshots(allScreenshots);
      } catch (error) {
        console.error('Error loading screenshots:', error);
      } finally {
        setTimeout(() => setIsFadingOut(true), 500);
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    loadScreenshots();
  }, []);

  return (
    <BrowserRouter>
      <TourProvider
        steps={getSteps(hasStats, screenshots)}
        styles={tourConfig.styles}
        showNavigation={true}
        position="bottom"
      >
        <Routes>
          <Route path="/" element={<App isFadingOut={isFadingOut} isRootLoading={isLoading} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TourProvider>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);