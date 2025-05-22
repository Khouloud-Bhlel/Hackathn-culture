import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slideImages = [
  'https://images.pexels.com/photos/3209243/pexels-photo-3209243.jpeg',
  'https://images.pexels.com/photos/6147369/pexels-photo-6147369.jpeg',
  'https://images.pexels.com/photos/3095774/pexels-photo-3095774.jpeg',
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  return (
    <section className="relative h-screen-90 overflow-hidden">
      {/* Slideshow */}
      <div className="absolute inset-0 z-0">
        {slideImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center parallax"
              style={{ backgroundImage: `url(${img})` }}
            />
            <div className="absolute inset-0 bg-burgundy-900 bg-opacity-40" />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-10 p-2 bg-white bg-opacity-30 rounded-full text-white hover:bg-opacity-50 transition-all"
        aria-label="السابق"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-10 p-2 bg-white bg-opacity-30 rounded-full text-white hover:bg-opacity-50 transition-all"
        aria-label="التالي"
      >
        <ChevronRight size={24} />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 slide-in-right">
          استكشف أسرار متحف سلقطة... حيث التاريخ يَحكي قصصًا غامضة!
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl slide-in-left">
          التقط الصور واغوص في حكايات لم تُروَ من قبل.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 fade-in">
          <button className="btn btn-primary">
            ابدأ الجولة الافتراضية
          </button>
          <button className="btn btn-secondary">
            استكشف القطع الأثرية
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="flex space-x-2">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`الانتقال إلى الشريحة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;