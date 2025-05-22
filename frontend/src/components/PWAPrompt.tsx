import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { isAppInstalled, onAppInstalled } from '../utils/pwaUtils';

interface PWAPromptProps {
  onClose: () => void;
}

const PWAPrompt: React.FC<PWAPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };
    
    // Check if already installed - if so, don't set up the prompt handler
    if (isAppInstalled()) {
      onClose();
      return;
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Register event when installation happens during the session
    onAppInstalled(() => {
      onClose();
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [onClose]);
  
  const handleInstallClick = () => {
    if (!deferredPrompt) {
      // The deferred prompt isn't available, so use alternative install instructions
      if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
        alert('لتثبيت التطبيق على جهاز iOS:\n1. اضغط على أيقونة المشاركة (مربع مع سهم للأعلى) في شريط أدوات Safari.\n2. قم بالتمرير لأسفل واضغط على "إضافة إلى الشاشة الرئيسية".\n3. اضغط على "إضافة" في الزاوية العلوية اليمنى.');
      } else if (/android/.test(navigator.userAgent.toLowerCase())) {
        alert('لتثبيت التطبيق على جهاز Android:\n1. اضغط على أيقونة قائمة النقاط الثلاث في المتصفح.\n2. اضغط على "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".\n3. اضغط على "تثبيت" في مربع الحوار.');
      } else {
        alert('لتثبيت التطبيق:\n1. افتح قائمة المتصفح (عادة النقاط الثلاث أو قائمة الإعدادات).\n2. ابحث عن خيار "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".\n3. اتبع التعليمات لإكمال التثبيت.');
      }
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setDeferredPrompt(null);
      onClose();
    });
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 md:max-w-md md:mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="bg-green-600 rounded-full p-2 text-white mr-3">
            <Download size={20} />
          </div>
          <div>
            <h3 className="font-bold text-burgundy-900">قم بتثبيت تطبيق متحف سلقطة</h3>
            <p className="text-sm text-gray-600">استمتع بتجربة أفضل وإمكانية الاستخدام بدون إنترنت</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <button 
          onClick={onClose}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 ml-2"
        >
          لاحقًا
        </button>
        <button 
          onClick={handleInstallClick}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
        >
          <Download size={16} className="ml-1" />
          تثبيت
        </button>
      </div>
    </div>
  );
};

export default PWAPrompt;