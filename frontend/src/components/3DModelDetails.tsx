// filepath: /home/khouloud/Documents/all personnel  projects/project_hakathon-culture/frontend/src/components/3DModelDetails.tsx
import React, { useState, useEffect } from 'react';
import { X, Info, Calendar, MapPin, Ruler, Cuboid as Cube, Mic, MessageSquare, Loader2, Volume2 } from 'lucide-react';
import { mediaItems } from '../utils/albumData';
import { useVoiceAI } from '../utils/useVoiceAI';

interface ModelDetailsProps {
  model: typeof mediaItems[0];
  onClose: () => void;
  initialShowChat?: boolean;
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ model, onClose, initialShowChat = false }) => {
  const [enhancedDescription, setEnhancedDescription] = useState<string>('');
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [showChat, setShowChat] = useState(initialShowChat);

  // Initialize the voice AI hook
  const {
    isListening,
    processing,
    messages,
    error,
    toggleListening,
    addMessage
  } = useVoiceAI({
    artifactTitle: model.title,
    artifactDescription: enhancedDescription || model.description
  });

  // Load artifact description (not using OpenAI anymore - just using existing descriptions)
  useEffect(() => {
    if (model) {
      // Use the existing description from model.details.story if available
      if (model.details?.story) {
        setEnhancedDescription(model.details.story);
      } else {
        setEnhancedDescription(model.description);
      }
      setIsLoadingDescription(false);
    }
  }, [model]);
  
  // Add welcome message when chat tab is opened
  useEffect(() => {
    if (showChat && messages.length === 0) {
      addMessage(`أهلاً بك! هذه قطعة "${model.title}". يمكنك أن تسألني أي سؤال عن هذه القطعة الأثرية.`, false);
    }
  }, [showChat, messages.length, model.title, addMessage]);

  if (!model.details) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-burgundy-900/90 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl m-2 sm:m-4 animate-modal-open">
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 z-10"
        >
          <X size={20} className="text-burgundy-900" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/2">
            <div className="sticky top-0">
              <img
                src={model.thumbnail}
                alt={model.title}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/60 to-transparent" />
            </div>
          </div>

          <div className="md:w-1/2 p-4 sm:p-6 md:p-8">
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 sticky top-0 bg-white z-10 pt-2">
              <button 
                className={`flex-1 btn ${!showChat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setShowChat(false)}
              >
                <Info size={16} className="inline-block ml-2" />
                معلومات
              </button>
              <button 
                className={`flex-1 btn ${showChat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setShowChat(true)}
              >
                <MessageSquare size={16} className="inline-block ml-2" />
                محادثة
              </button>
            </div>

            {!showChat ? (
              <div className="space-y-4 sm:space-y-6 animate-float-up">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-burgundy-900">{model.title}</h3>
                  {isLoadingDescription ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="animate-spin text-burgundy-900" size={24} />
                      <span className="mr-2">جاري تحميل المعلومات...</span>
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600">{enhancedDescription || model.description}</p>
                  )}
                </div>

                <div className="grid gap-3 sm:gap-4">
                  <div className="bg-sand-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-burgundy-900">
                      <Calendar size={16} />
                      <span className="font-semibold text-sm sm:text-base">العصر</span>
                    </div>
                    <p className="text-sm sm:text-base">{model.details.period}</p>
                  </div>

                  <div className="bg-sand-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-burgundy-900">
                      <MapPin size={16} />
                      <span className="font-semibold text-sm sm:text-base">مكان الاكتشاف</span>
                    </div>
                    <p className="text-sm sm:text-base">{model.details.location}</p>
                  </div>

                  <div className="bg-sand-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-burgundy-900">
                      <Cube size={16} />
                      <span className="font-semibold text-sm sm:text-base">المادة</span>
                    </div>
                    <p className="text-sm sm:text-base">{model.details.material}</p>
                  </div>

                  <div className="bg-sand-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-burgundy-900">
                      <Ruler size={16} />
                      <span className="font-semibold text-sm sm:text-base">الأبعاد</span>
                    </div>
                    <p className="text-sm sm:text-base">{model.details.dimensions}</p>
                  </div>
                </div>

                <div className="bg-burgundy-900 text-white p-3 sm:p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">القصة</h4>
                  <p className="text-xs sm:text-sm">{model.details.story}</p>
                </div>
              </div>
            ) : (
              <div className="relative h-[500px] flex flex-col">
                <div className="flex-1 mb-24 overflow-y-auto space-y-4 p-2">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare size={32} className="mx-auto mb-2 text-burgundy-300" />
                      <p>اضغط على زر الميكروفون لطرح سؤال حول القطعة</p>
                    </div>
                  )}
                  
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
