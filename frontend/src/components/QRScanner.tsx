import { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { matchQRCodeToArtifact } from '../utils/qrCodeUtils';

interface QRScannerProps {
  onScan: (data: string, showChat?: boolean) => void;
  onClose: () => void;
}

function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = (result: any) => {
    if (result) {
      const scannedText = result.text;
      setScanSuccess(true);
      setIsProcessing(true);
      
      // Try to match the QR code to an artifact
      const matchedArtifact = matchQRCodeToArtifact(scannedText);
      
      if (matchedArtifact) {
        // Success - we have a match
        setTimeout(() => {
          // Pass the flag to show chat interface immediately when navigating to the artifact
          onScan(scannedText, true);
        }, 1000); // Add a slight delay so the user can see the success message
      } else {
        // No match found - show error message
        setError('لم يتم العثور على قطعة أثرية مطابقة لهذا الرمز');
        setTimeout(() => {
          setIsProcessing(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-burgundy-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg animate-modal-open">
        <div className="bg-gradient-to-r from-burgundy-900 to-burgundy-800 p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">ماسح رمز QR</h2>
            <button 
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 transition-all p-2 rounded-full"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-800 text-sm">{error}</p>
              <button 
                onClick={() => { setError(null); setScanSuccess(false); }}
                className="mt-2 text-red-600 text-sm underline"
              >
                حاول مرة أخرى
              </button>
            </div>
          )}
          
          {scanSuccess && !error && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 text-sm">تم المسح بنجاح</p>
              {isProcessing && (
                <div className="flex items-center justify-center mt-2">
                  <div className="animate-spin h-5 w-5 border-2 border-green-600 rounded-full border-t-transparent"></div>
                  <span className="mr-2 text-green-600">جاري المعالجة...</span>
                </div>
              )}
            </div>
          )}
          
          <div className="relative mb-6 bg-black rounded-xl overflow-hidden" style={{ height: "300px" }}>
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 border-2 border-white rounded-lg flex items-center justify-center">
                  <div className="w-full h-full border border-white/30 rounded-md"></div>
                </div>
              </div>
              <div className="absolute top-4 left-0 right-0 text-center">
                <p className="text-white text-sm bg-black/50 inline-block px-3 py-1 rounded-full">ضع رمز QR داخل الإطار</p>
              </div>
            </div>
            
            {!scanSuccess && (
              <BarcodeScannerComponent
                width="100%"
                height="100%"
                torch={torchOn}
                onUpdate={(_err, result) => {
                  if (result) handleScan(result);
                }}
              />
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setTorchOn(!torchOn)}
              disabled={scanSuccess}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                torchOn 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-burgundy-900 hover:bg-burgundy-800 text-white'
              } ${scanSuccess ? 'opacity-50' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1l14.2-14.2"></path>
              </svg>
              <span>{torchOn ? 'إيقاف الضوء' : 'تشغيل الضوء'}</span>
            </button>
            
            {scanSuccess && (
              <button
                onClick={() => { 
                  setScanSuccess(false); 
                  setError(null);
                  setIsProcessing(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-burgundy-900 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 1-9 9"></path>
                  <path d="M12 3a9 9 0 0 1 9 9"></path>
                  <path d="M9 21a9 9 0 0 1-9-9"></path>
                  <path d="M3 12a9 9 0 0 1 9-9"></path>
                  <path d="M12 12v-3"></path>
                  <path d="M21 3v3"></path>
                  <path d="M3 3v3"></path>
                  <path d="M21 21v-3"></path>
                  <path d="M3 21v-3"></path>
                </svg>
                <span>مسح مرة أخرى</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;
