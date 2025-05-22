import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { isAppInstalled, onAppInstalled } from '../utils/pwaUtils';

const PersistentInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if the app is already installed
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
    <div className="fixed bottom-16 right-4 z-50 animate-bounce-in">
      <button
        onClick={handleInstallClick}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-full shadow-lg flex items-center transition-all duration-300 transform hover:scale-105"
        aria-label="تثبيت التطبيق"
      >
        <Download size={20} className="ml-2" />
        تثبيت
      </button>
    </div>
  );
};

export default PersistentInstallButton;
