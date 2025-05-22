import React, { useState } from 'react';
import { X, AlertCircle, ExternalLink } from 'lucide-react';

interface ApiKeyNotificationProps {
  onClose: () => void;
}

const ApiKeyNotification: React.FC<ApiKeyNotificationProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the transition duration
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">تنبيه مفتاح API</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                لم يتم تكوين مفتاح OpenAI API بشكل صحيح. ميزات الذكاء الاصطناعي في التطبيق لن تعمل.
              </p>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 flex items-center text-yellow-800 hover:text-yellow-900 font-medium text-sm"
              >
                <span>الحصول على مفتاح API</span>
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
          <div>
            <button
              onClick={handleClose}
              className="inline-flex text-yellow-400 hover:text-yellow-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyNotification;
