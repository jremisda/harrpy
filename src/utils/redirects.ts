/**
 * Utility for handling client-side redirects
 * This complements the server-side redirects in vercel.json
 */

// Legacy URL paths that should redirect to new paths
export const LEGACY_PATHS: Record<string, string> = {
  // Main legacy paths
  '/waitlist': '/',
  '/blog': '/news',
  '/newsletter': '/news',
  '/updates': '/news',
  '/signup': '/',
  '/register': '/',
  '/join': '/',
  
  // Feature specific paths
  '/about': '/',
  '/contact': '/',
  '/help': '/',
  '/faq': '/',
  '/pricing': '/',
};

/**
 * Check if the current path should be redirected
 * @param path Current path to check
 * @returns The new path to redirect to, or null if no redirect needed
 */
export const getRedirectPath = (path: string): string | null => {
  // Direct match in legacy paths
  if (LEGACY_PATHS[path]) {
    return LEGACY_PATHS[path];
  }
  
  // Handle article paths
  if (path.startsWith('/blog/') || path.startsWith('/posts/')) {
    return path.replace(/^\/(blog|posts)\//, '/articles/');
  }
  
  // No redirect needed
  return null;
};

// Import is dynamic to avoid circular dependencies
let analyticsModule: typeof import('./analytics') | null = null;

/**
 * Records a redirect in browser history using the History API
 * This is used to maintain a clean browsing history when redirecting
 * @param from Original URL
 * @param to Destination URL
 */
export const recordRedirect = (from: string, to: string): void => {
  // Replace the current history entry with the redirected URL
  window.history.replaceState(
    { redirectedFrom: from },
    '',
    to
  );
  
  // Track in analytics
  if (!analyticsModule) {
    // Dynamically import analytics module to avoid circular dependencies
    import('./analytics').then(module => {
      analyticsModule = module;
      analyticsModule.trackRedirect(from, to);
    });
  } else {
    analyticsModule.trackRedirect(from, to);
  }
  
  // Log the redirect for debugging
  console.log(`Redirected from ${from} to ${to}`);
}; 