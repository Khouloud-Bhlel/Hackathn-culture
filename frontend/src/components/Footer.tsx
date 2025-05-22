import React from 'react';
import { Instagram, Facebook, Twitter, Camera } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-burgundy-900 text-white py-16">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">انضم إلى آلاف المستكشفين!</h2>
          <p className="text-lg opacity-80">اكتشف أسرار المتحف واستمتع بتجربة فريدة من نوعها</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* Stats */}
          <div className="bg-burgundy-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2 text-sand-200">٣٠+</div>
            <p>قصة غامضة</p>
          </div>
          
          <div className="bg-burgundy-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2 text-sand-200">١٠٠٠+</div>
            <p>زيارة افتراضية</p>
          </div>
          
          <div className="bg-burgundy-800 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold mb-2 text-sand-200">٥٠+</div>
            <p>نموذج ثلاثي الأبعاد</p>
          </div>
        </div>
        
        {/* Memory capture */}
        <div className="bg-gradient-to-r from-pink-700 to-pink-600 rounded-xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-1">التقط صورتك التذكارية!</h3>
            <p className="opacity-90">خلد ذكرياتك مع المتحف الافتراضي</p>
          </div>
          <button className="btn bg-white text-pink-700 hover:bg-sand-100 focus:ring-white flex items-center gap-2">
            <Camera size={18} />
            التقط صورة
          </button>
        </div>
        
        {/* Social and info */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-burgundy-800">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="p-2 bg-burgundy-800 rounded-full hover:bg-burgundy-700 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-burgundy-800 rounded-full hover:bg-burgundy-700 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-burgundy-800 rounded-full hover:bg-burgundy-700 transition-colors">
              <Twitter size={20} />
            </a>
          </div>
          
          <div className="text-sm opacity-70">
            © {new Date().getFullYear()} متحف سلقطة. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;