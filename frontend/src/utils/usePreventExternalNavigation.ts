import { useEffect } from 'react';

/**
 * This hook adds event listeners to prevent the app from navigating to external sites
 * when installed as a PWA, which would cause it to open in the browser.
 * Instead, it opens external links in a new window, keeping the PWA experience intact.
 */
const usePreventExternalNavigation = () => {
  useEffect(() => {
    // Only apply this behavior when the app is running as an installed PWA
    const isPwa = window.matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)').matches;
    
    if (!isPwa) {
      return; // Not a PWA, use normal navigation
    }
    
    // Handler for click events on all links
    const handleLinkClick = (e: MouseEvent) => {
      // Check if the clicked element is a link
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Check if this is an external link
      const isExternalLink = href.startsWith('http') || href.startsWith('//');
      
      // If it's an internal link or explicitly set to open in the same window, let it behave normally
      if (!isExternalLink || link.getAttribute('target') === '_self') {
        return;
      }
      
      // For external links in standalone mode, we need special handling
      e.preventDefault();
      
      // Open in a new window instead of leaving the PWA
      window.open(href, '_blank', 'noopener,noreferrer');
    };
    
    // Add the event listener to the document
    document.addEventListener('click', handleLinkClick);
    
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
};

export default usePreventExternalNavigation;
