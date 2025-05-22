import { useEffect, useState } from 'react';
import AlbumGallery from './components/AlbumGallery';
import PWAPrompt from './components/PWAPrompt';
import Header from './components/Header';
import PersistentInstallButton from './components/PersistentInstallButton';
import ArtifactHandler from './components/ArtifactHandler';
import ApiKeyNotification from './components/ApiKeyNotification';
import { isAppInstalled, onAppInstalled } from './utils/pwaUtils';
import useAppInstallState from './utils/useAppInstallState';
import usePreventExternalNavigation from './utils/usePreventExternalNavigation';
import { useApiKeyStatus } from './utils/apiConfig';
import { loadEnhancedArtifacts } from './utils/enhancedArtifacts';
import { ensureEnhancedData } from './utils/autoEnhance';

function App() {
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState(false);
  const [isEnhancedDataLoading, setIsEnhancedDataLoading] = useState(true);
  const { isInstalled, displayMode } = useAppInstallState();
  const { isConfigured, isChecking } = useApiKeyStatus();
  
  // Use the hook to prevent external navigation in PWA mode
  usePreventExternalNavigation();

  // Load enhanced artifacts data on app startup
  useEffect(() => {
    const loadData = async () => {
      try {
        // First ensure we have enhanced data available (generates it if not)
        await ensureEnhancedData();
        // Then load it into the app (this now handles video URL enhancement internally)
        await loadEnhancedArtifacts();
        console.log('Enhanced artifact data loaded in App');
      } catch (error) {
        console.error('Error loading enhanced artifact data:', error);
      } finally {
        setIsEnhancedDataLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // Check if the app is already installed
    const appInstalled = isAppInstalled();
    setIsStandalone(appInstalled);
    
    // Register listener for future installations
    onAppInstalled(() => {
      setIsStandalone(true);
      setShowPWAPrompt(false);
    });
    
    // Show the PWA prompt after a delay if not already installed
    if (!appInstalled) {
      const timer = setTimeout(() => {
        setShowPWAPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Show API key warning if not configured
  useEffect(() => {
    if (!isChecking && !isConfigured) {
      setShowApiKeyWarning(true);
    }
  }, [isChecking, isConfigured]);

  return (
    <div className={`font-noto-arabic text-burgundy-900 ${displayMode !== 'browser' ? 'app-mode' : ''}`}>
      <Header showQRToggle={false} />
      <main className="main-content">
        {showPWAPrompt && !isStandalone && !isInstalled && <PWAPrompt onClose={() => setShowPWAPrompt(false)} />}
        {isEnhancedDataLoading ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-900 mb-4"></div>
            <p className="mr-2 mb-2">جاري تحميل البيانات المحسنة...</p>
            <button 
              onClick={async () => {
                try {
                  await ensureEnhancedData();
                  await loadEnhancedArtifacts();
                  setIsEnhancedDataLoading(false);
                } catch (error) {
                  console.error('Error manually loading data:', error);
                }
              }}
              className="px-4 py-2 bg-burgundy-900 text-white rounded-md hover:bg-burgundy-800 transition-colors"
            >
              تحميل البيانات يدويًا
            </button>
          </div>
        ) : (
          <>
            <AlbumGallery />
            <ArtifactHandler />
          </>
        )}
      </main>
      {!isInstalled && <PersistentInstallButton />}
      {showApiKeyWarning && <ApiKeyNotification onClose={() => setShowApiKeyWarning(false)} />}
    </div>
  );
}

export default App;