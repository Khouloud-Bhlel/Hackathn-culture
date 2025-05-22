import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

const FeatureCards: React.FC = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <section className="py-16 container-custom">
      <h2 className="section-title">اكتشف المزيد من التجارب</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* Magic Album Card */}
        <div className="card bg-sand-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4 text-burgundy-900">الألبوم السحري</h3>
            <p className="mb-4">استعرض مجموعة من الصور والفيديوهات المميزة للقطع الأثرية والعروض والجولات.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item} 
                  className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={`https://images.pexels.com/photos/6147${360 + item}/pexels-photo-6147${360 + item}.jpeg?auto=compress&cs=tinysrgb&w=300`}
                    alt={`صورة من المتحف ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button className="text-burgundy-900 font-semibold hover:text-burgundy-700 transition-colors">
                عرض المزيد...
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-burgundy-900 text-white flex items-center justify-center hover:bg-burgundy-700 transition-colors"
                aria-label="مشاركة"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Hidden Stories Card */}
        <div className="card bg-burgundy-900 text-white overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">القصص المخفية</h3>
            <p className="mb-6">استكشف الأسرار والقصص الغامضة خلف القطع الأثرية في متحفنا.</p>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-white p-2 rounded-lg mb-4 relative overflow-hidden">
                {/* Artifact Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/logo.svg" alt="رمز المتحف" className="w-16 h-16" />
                </div>
                <div className="absolute inset-0 bg-green-600 opacity-20 animate-pulse"></div>
              </div>
              <p className="text-sm text-center">تعرف على قصص القطع الأثرية</p>
            </div>
            
            <div className="bg-burgundy-800 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                قصة تمثال نفرتيتي الصغير
              </h4>
              <p className="text-sm opacity-90 mb-3">
                هل تعلم أن هذا التمثال كان قد اختفى لمدة 40 عامًا قبل إعادة اكتشافه؟
              </p>
              <button 
                onClick={toggleAudio}
                className={`text-sm font-medium flex items-center ${isAudioPlaying ? 'text-green-400' : 'text-pink-400'}`}
              >
                <span className={`w-2 h-2 rounded-full mr-1 ${isAudioPlaying ? 'bg-green-400 animate-pulse' : 'bg-pink-400'}`}></span>
                {isAudioPlaying ? 'جاري التشغيل...' : 'استمع للقصة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;