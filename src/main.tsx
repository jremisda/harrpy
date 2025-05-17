import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <LoadingProvider>
        <BrowserRouter>
          <App />
          <Analytics />
          <SpeedInsights />
        </BrowserRouter>
      </LoadingProvider>
    </HelmetProvider>
  </StrictMode>
);
