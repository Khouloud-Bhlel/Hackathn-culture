import React, { useState, useEffect } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { isAppInstalled, onAppInstalled } from '../utils/pwaUtils';

interface HeaderProps {
  showInstallButton?: boolean;
  showQRToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showInstallButton = true}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-custom py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.svg" alt="متحف سلقطة" className="h-10 md:h-12" />
          <h1 className="text-lg md:text-xl font-bold text-burgundy-900 mr-3">متحف سلقطة</h1>
        </div>
        
        <div className="flex items-center">
          {/* Show install button if app is installable and not in standalone mode */}
          {showInstallButton && isInstallable && !isStandalone && (
            <button
              onClick={handleInstallClick}
              className="btn btn-primary flex items-center ml-4 animate-bounce-in"
              aria-label="تثبيت التطبيق"
            >
              <Download size={18} className="ml-2" />
              تثبيت
            </button>
          )}
          
          <button 
            onClick={toggleMenu}
            className="p-2 text-burgundy-900 hover:bg-burgundy-900/10 rounded-full"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="container-custom py-3 bg-white border-t border-gray-100 animate-slide-down">
          <nav className="flex flex-col space-y-3">
            <a href="#" className="text-burgundy-900 hover:text-burgundy-700 py-2">الصفحة الرئيسية</a>
            <a href="#" className="text-burgundy-900 hover:text-burgundy-700 py-2">عن المتحف</a>
            <a href="#" className="text-burgundy-900 hover:text-burgundy-700 py-2">معرض الصور</a>
            <a href="#" className="text-burgundy-900 hover:text-burgundy-700 py-2">تواصل معنا</a>
            
            {/* Show install button in menu for mobile */}
            {showInstallButton && isInstallable && !isStandalone && (
              <button
                onClick={handleInstallClick}
                className="flex items-center text-burgundy-900 hover:text-burgundy-700 py-2"
              >
                <Download size={18} className="ml-2" />
                تثبيت التطبيق
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
