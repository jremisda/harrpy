import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext';
import { useEffect, useState } from 'react';

function AnalyticsOptInWrapper({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <>
    <Analytics mode="production" />
    <SpeedInsights />
  </>;
}

function Root() {
  const [analyticsOptIn, setAnalyticsOptIn] = useState(() => {
    const optIn = localStorage.getItem('harrpy_analytics_opt_in');
    return optIn === null || optIn === 'true';
  });

  useEffect(() => {
    const handler = () => {
      const optIn = localStorage.getItem('harrpy_analytics_opt_in');
      setAnalyticsOptIn(optIn === null || optIn === 'true');
    };
    window.addEventListener('storage', handler);
    window.addEventListener('harrpy_analytics_opt_in_changed', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('harrpy_analytics_opt_in_changed', handler);
    };
  }, []);

  return (
    <StrictMode>
      <HelmetProvider>
        <LoadingProvider>
          <BrowserRouter>
            <App analyticsOptIn={analyticsOptIn} onAnalyticsOptInChange={setAnalyticsOptIn} />
            <AnalyticsOptInWrapper enabled={analyticsOptIn} />
          </BrowserRouter>
        </LoadingProvider>
      </HelmetProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
