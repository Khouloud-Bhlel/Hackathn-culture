import React, { useState, useEffect } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { getVideoSource } from '../utils/videoUtils';

interface VideoModalProps {
  video: {
    title: string;
    description: string;
    thumbnail: string;
    date: string;
    videoUrl?: string;
  };
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Get video source information - now using videoUrl from enhanced-artifacts.json if available
  const videoSrcFromProp = video.videoUrl || '';
  const { src: videoSrc, type: videoType } = videoSrcFromProp 
    ? { src: videoSrcFromProp, type: 'video/mp4' }
    : getVideoSource(video.thumbnail);
  
  // Log video path for debugging
  useEffect(() => {
    console.log(`Loading video: ${videoSrc} for ${video.title}`);
    
    // Preload the video
    const preloadVideo = new Audio();
    preloadVideo.src = videoSrc;
    preloadVideo.load();
  }, [videoSrc, video.title]);

  // Handle escape key to exit fullscreen or close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  // Toggle fullscreen mode for the video
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Calculate modal classes based on fullscreen state
  const modalClasses = isFullscreen 
    ? "fixed inset-0 z-50 bg-black" 
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-900/90 backdrop-blur-sm";

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative bg-white rounded-2xl overflow-hidden w-full max-w-4xl animate-modal-open";

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 z-10"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Video container */}
        <div className={isFullscreen ? "w-full h-full" : "aspect-video w-full"}>
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay
              controlsList="nodownload"
              poster={video.thumbnail}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={videoSrc} type={videoType} />
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent"></div>
            )}
          </div>
        </div>

        {/* Info section - hide in fullscreen mode */}
        {!isFullscreen && (
          <div className="p-6 bg-white">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-burgundy-900">{video.title}</h3>
                <p className="text-gray-600 mb-2">{video.description}</p>
                <p className="text-gray-500 text-sm">{video.date}</p>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <button
                onClick={toggleFullscreen}
                className="btn btn-tertiary flex items-center gap-1"
              >
                {isFullscreen ? (
                  <>
                    <Minimize size={16} />
                    إنهاء ملء الشاشة
                  </>
                ) : (
                  <>
                    <Maximize size={16} />
                    ملء الشاشة
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal;
