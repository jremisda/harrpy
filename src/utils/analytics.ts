/**
 * Utility for tracking redirects in analytics
 */

/**
 * Track a redirect in analytics
 * @param from Original URL
 * @param to Destination URL
 */
export const trackRedirect = (from: string, to: string): void => {
  // Send redirect event to analytics services (if available)
  if (window.gtag) {
    window.gtag('event', 'redirect', {
      from_path: from,
      to_path: to,
      redirect_type: '301'
    });
  }
  
  // If using Vercel Analytics, track custom event
  if (window.va) {
    window.va('event', {
      name: 'redirect',
      data: { from, to, type: '301' }
    });
  }
  
  // Log for debugging
  console.debug(`[Analytics] Tracked redirect from ${from} to ${to}`);
};

// Add TypeScript interfaces for global analytics objects
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: any) => void;
    va?: (event: "beforeSend" | "event" | "pageview", properties?: unknown) => void;
  }
} 