import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRedirectPath, recordRedirect } from '../../utils/redirects';

/**
 * RedirectHandler component
 * Handles client-side redirects based on current URL path
 * This complements the server-side redirects in vercel.json
 */
const RedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the current path should be redirected
    const redirectPath = getRedirectPath(location.pathname);
    
    if (redirectPath) {
      // Record the redirect in browser history
      recordRedirect(location.pathname, redirectPath);
      
      // Navigate to the new path
      navigate(redirectPath, { 
        replace: true, // Replace current entry in history
        state: { redirectedFrom: location.pathname } 
      });
    }
  }, [location.pathname, navigate]);
  
  // This component doesn't render anything
  return null;
};

export default RedirectHandler; 