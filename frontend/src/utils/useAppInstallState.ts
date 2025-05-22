import { useState, useEffect } from 'react';
import { isAppInstalled } from './pwaUtils';

/**
 * Custom hook to detect if app is running as an installed PWA
 * and provide information about the app's display mode
 */
export const useAppInstallState = () => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<string>('browser');

  useEffect(() => {
    // Check if app is installed
    const checkInstallState = () => {
      setIsInstalled(isAppInstalled());
      
      // Detect display mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setDisplayMode('standalone');
      } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
        setDisplayMode('fullscreen');
      } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
        setDisplayMode('minimal-ui');
      } else {
        setDisplayMode('browser');
      }
    };

    // Initial check
    checkInstallState();

    // Set up listener for display mode changes
    const mediaQueryList = window.matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)');
    
    // Use the appropriate event listener based on browser support
    const listener = () => checkInstallState();
    
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else if ('addListener' in mediaQueryList) {
      // @ts-ignore: Old Safari method
      mediaQueryList.addListener(listener);
    }

    // Also listen for the app being installed during the session
    window.addEventListener('appinstalled', checkInstallState);

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else if ('removeListener' in mediaQueryList) {
        // @ts-ignore: Old Safari method
        mediaQueryList.removeListener(listener);
      }
      
      window.removeEventListener('appinstalled', checkInstallState);
    };
  }, []);

  return { isInstalled, displayMode };
};

export default useAppInstallState;
