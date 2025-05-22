import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { isAppInstalled, onAppInstalled } from '../utils/pwaUtils';

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already installed as a PWA
    setIsStandalone(isAppInstalled());
    
    // Register listener for future installations
    onAppInstalled(() => {
      setIsStandalone(true);
      setIsInstallable(false);
    });
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = () => {
    if (!deferredPrompt) {
      // The deferred prompt isn't available, show manual instructions
      if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
        alert('لتثبيت التطبيق على جهاز iOS، اضغط على أيقونة المشاركة ثم "إضافة إلى الشاشة الرئيسية"');
      } else if (/android/.test(navigator.userAgent.toLowerCase())) {
        alert('لتثبيت التطبيق على جهاز Android، افتح قائمة المتصفح (النقاط الثلاث) ثم اضغط على "إضافة إلى الشاشة الرئيسية"');
      } else {
        alert('لتثبيت التطبيق، استخدم قائمة المتصفح وحدد "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
      }
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // App was installed, update UI
        setIsInstallable(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
    });
  };
  
  // Only show the button if the app is installable and not already in standalone mode
  if (!isInstallable || isStandalone) {
    return null;
  }
  
  return (
    <button
      onClick={handleInstallClick}
      className="btn btn-primary flex items-center"
      aria-label="تثبيت التطبيق"
    >
      <Download size={16} className="ml-2" />
      تثبيت
    </button>
  );
};

export default InstallButton;
