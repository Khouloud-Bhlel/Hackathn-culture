import React, { useState, useEffect } from 'react';
import { X, Mic, MessageSquare, Loader2, Volume2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import QRScanner from './QRScanner';
import { useVoiceAI } from '../utils/useVoiceAI';
import { matchQRCodeToArtifact } from '../utils/qrCodeUtils';
import { generateArtifactDescription } from '../utils/openaiService';

interface ImageModalProps {
  image: {
    title: string;
    description: string;
    thumbnail: string;
    id?: string;
    details?: {
      period?: string;
      location?: string;
      material?: string;
      dimensions?: string;
      story?: string;
    };
  } | null;
  onClose: () => void;
  initialShowChat?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, initialShowChat = false }) => {
  const [showDetails, setShowDetails] = useState(initialShowChat);
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [enhancedDescription, setEnhancedDescription] = useState<string>('');
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);

  // Initialize the voice AI hook
  const {
    isListening,
    processing,
    messages,
    error,
    toggleListening,
    addMessage
  } = useVoiceAI({
    artifactTitle: image?.title || '',
    artifactDescription: enhancedDescription || image?.description || ''
  });

  // Enhance the artifact description using OpenAI
  useEffect(() => {
    if (image && !enhancedDescription) {
      setIsLoadingDescription(true);
      generateArtifactDescription(image.title)
        .then(description => {
          setEnhancedDescription(description);
        })
        .catch(err => {
          console.error('Failed to generate enhanced description:', err);
          setEnhancedDescription(image.description);
        })
        .finally(() => {
          setIsLoadingDescription(false);
        });
    }
  }, [image, enhancedDescription]);

  const handleScan = (result: string, enableChat: boolean = false) => {
    if (result) {
      setQrResult(result);
      setIsQRScannerVisible(false);
      
      // Check if the QR code matches an artifact
      const matchedArtifact = matchQRCodeToArtifact(result);
      if (matchedArtifact) {
        // If we have a match and it's the current artifact, show details and chat
        if (matchedArtifact.title === image?.title) {
          setShowDetails(true);
          if (enableChat) {
            // Add a welcome message
            addMessage(`أهلاً بك! هذه قطعة "${matchedArtifact.title}". يمكنك أن تسألني أي سؤال عن هذه القطعة الأثرية.`, false);
          }
        } else {
          // If it's a different artifact, navigate to it with chat enabled
          localStorage.setItem('currentArtifactId', matchedArtifact.title);
          localStorage.setItem('showArtifactChat', 'true');
          window.location.hash = `artifact:${matchedArtifact.title.replace(/\s+/g, '-').toLowerCase()}`;
          onClose();
        }
      }
    }
  };

  // Updated QR code scanning interface and logic
  if (isQRScannerVisible) {
    return <QRScanner onScan={handleScan} onClose={() => setIsQRScannerVisible(false)} />;
  }

  // Automatically show details when QR code matches
  if (qrResult && qrResult === `museum-artifact:${image?.title.replace(/\s+/g, '-').toLowerCase()}`) {
    setShowDetails(true);
    setQrResult(null); // Reset QR result to avoid re-triggering
  }

  if (!image) return null;

  if (showDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-900/90 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-4xl animate-modal-open">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 z-10"
          >
            <X size={20} className="text-burgundy-900" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto">
              <img
                src={image?.thumbnail}
                alt={image?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/60 to-transparent" />
            </div>

            <div className="p-8 relative min-h-[500px]">
              <h3 className="text-2xl font-bold mb-4 text-burgundy-900">{image?.title}</h3>
              
              {isLoadingDescription ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin text-burgundy-900" size={24} />
                  <span className="mr-2">جاري تحميل المعلومات...</span>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">{enhancedDescription || image?.description}</p>
              )}

              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="space-y-4 mb-24 max-h-[300px] overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message-bubble animate-float-up opacity-0 ${msg.isUser ? 'bg-green-50 mr-8' : 'bg-sand-100 ml-8'}`}
                      style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-2">
                        {msg.isUser ? (
                          <MessageSquare size={16} className="mt-1 text-green-600" />
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <MessageSquare size={16} className="mt-1 text-burgundy-900" />
                            {msg.audioUrl && (
                              <button 
                                onClick={() => new Audio(msg.audioUrl).play()}
                                className="p-1 hover:bg-burgundy-100 rounded-full transition-colors"
                              >
                                <Volume2 size={14} className="text-burgundy-900" />
                              </button>
                            )}
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {processing && (
                    <div className="message-bubble animate-pulse bg-sand-100 ml-8">
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        <p>جاري المعالجة...</p>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="message-bubble bg-red-50 text-red-700">
                      <p>{error}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleListening}
                  disabled={processing}
                  className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 p-6 rounded-full ${
                    isListening ? 'bg-green-600 scale-110' : processing ? 'bg-gray-400' : 'bg-burgundy-900'
                  } text-white shadow-lg hover:scale-110 transition-all duration-300`}
                  style={{
                    animation: isListening ? 'pulse 2s infinite' : 'none',
                  }}
                >
                  {processing ? (
                    <Loader2 size={32} className="animate-spin" />
                  ) : (
                    <Mic size={32} className={isListening ? 'animate-pulse' : ''} />
                  )}
                  <div className={`absolute inset-0 rounded-full bg-current ${
                    isListening ? 'animate-ping opacity-25' : 'opacity-0'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-900/90 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-4xl animate-modal-open">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 z-10"
        >
          <X size={20} className="text-burgundy-900" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square md:aspect-auto">
            <img
              src={image.thumbnail}
              alt={image.title}
              className="w-full h-full object-cover animate-scale-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/60 to-transparent" />
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-burgundy-900 animate-slide-right">
              {image.title}
            </h3>
            <p className="text-gray-600 mb-6 animate-slide-right delay-100">
              {image.description}
            </p>

            <div className="bg-sand-100 rounded-lg p-6 text-center mb-6">
              <div className="mb-4 inline-block bg-white p-4 rounded-lg">
               <QRCode
                  value={`museum-artifact:${image.title.replace(/\s+/g, '-').toLowerCase()}`}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                /> 
              </div>
              <p className="text-sm text-burgundy-900">امسح الرمز للحصول على معلومات إضافية</p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsQRScannerVisible(true)}
                className="btn btn-secondary"
              >
                مسح QR رمز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;