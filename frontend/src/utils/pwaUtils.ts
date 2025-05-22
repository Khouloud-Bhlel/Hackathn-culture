/**
 * Utility for PWA installation detection and management
 */

/**
 * Checks if the app is running in standalone mode (installed as PWA)
 */
export const isAppInstalled = (): boolean => {
  // Method 1: Check display-mode media query (Chrome, Edge, Firefox, Opera)
  const isDisplayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Method 2: Check for iOS standalone mode
  const isIOSStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;
  
  // Method 3: Check for Android app referrer
  const isAndroidApp = document.referrer.includes('android-app://');
  
  // Method 4: Check for fullscreen mode
  const isFullScreenMode = window.matchMedia('(display-mode: fullscreen)').matches;
  
  // Method 5: Check for minimal-ui mode (usually when app is installed)
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  
  // Method 6: Cache check if we've determined we're installed before
  const cachedInstallState = localStorage.getItem('pwa-installed') === 'true';
  
  const isInstalled = isDisplayModeStandalone || isIOSStandalone || isAndroidApp || 
                      isFullScreenMode || isMinimalUI || cachedInstallState;
  
  // If any method indicates installation, cache this for future checks
  if (isInstalled) {
    localStorage.setItem('pwa-installed', 'true');
  }
  
  return isInstalled;
};

/**
 * Register a listener for install completion
 */
export const onAppInstalled = (callback: () => void): void => {
  window.addEventListener('appinstalled', () => {
    // Mark as installed in localStorage
    localStorage.setItem('pwa-installed', 'true');
    callback();
  });
};
