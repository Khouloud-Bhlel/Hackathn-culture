import React, { useState, useEffect } from 'react';
import { Share2, Play, Image as ImageIcon, Search, ArrowUp, Cuboid as Cube, Info } from 'lucide-react';
import { loadEnhancedArtifacts, EnhancedMediaItem } from '../utils/enhancedArtifacts';
import { validateMediaPath } from '../utils/mediaPathValidation';
import { getVideoSource } from '../utils/videoUtils';
import { enhanceArtifactsWithVideos } from '../utils/enhanceVideoArtifacts';
import ImageModal from './ImageModal';
import VideoModal from './VideoModal';
import Scene3D from './3DModel';
import ModelDetails from './3DModelDetails';
import InstallButton from './InstallButton';

const AlbumGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos' | '3d'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<EnhancedMediaItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [show3D, setShow3D] = useState<{ [key: string]: boolean }>({});
  const [showModelDetails, setShowModelDetails] = useState(false);
  const [displayItems, setDisplayItems] = useState<EnhancedMediaItem[]>([]);

  useEffect(() => {
    // Get enhanced media items
    async function loadData() {
      setIsLoading(true);
      
      try {
        // First try to load enhanced artifacts with correct video URLs
        const items = await enhanceArtifactsWithVideos();
        
        // Validate and fix media paths for all items
        const validatedItems = await validateMediaPaths(items);
        
        setDisplayItems(validatedItems);
      } catch (error) {
        console.error('Error loading enhanced artifacts:', error);
        // Fallback to basic enhanced artifacts
        const items = await loadEnhancedArtifacts();
        setDisplayItems(items);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredItems = displayItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title.includes(searchQuery) || 
                         item.description.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getRandomRotation = () => {
    return Math.random() * 6 - 3;
  };

  const toggle3D = (id: string) => {
    setShow3D(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Validate and fix media paths
  const validateMediaPaths = async (items: EnhancedMediaItem[]): Promise<EnhancedMediaItem[]> => {
    const validatedItems = await Promise.all(items.map(async (item) => {
      const enhancedItem = { ...item };
      
      // Check if thumbnail path is valid
      if (item.thumbnail) {
        const isThumbnailValid = await validateMediaPath(item.thumbnail, 'image');
        if (!isThumbnailValid && item.thumbnail.includes('/')) {
          // Try fixing the path by changing directory
          const filename = item.thumbnail.split('/').pop() || '';
          const alternativePath = `/images/${filename}`;
          const isAlternativeValid = await validateMediaPath(alternativePath, 'image');
          
          if (isAlternativeValid) {
            console.log(`Fixed thumbnail path for ${item.title}: ${alternativePath}`);
            enhancedItem.thumbnail = alternativePath;
          }
        }
      }
      
      // Fix video paths for video items
      if (item.type === 'videos') {
        if (!item.videoUrl || !(await validateMediaPath(item.videoUrl, 'video'))) {
          // If no videoUrl or invalid, get from thumbnail
          const { src } = getVideoSource(item.thumbnail);
          const isVideoValid = await validateMediaPath(src, 'video');
          
          if (isVideoValid) {
            console.log(`Fixed video path for ${item.title}: ${src}`);
            enhancedItem.videoUrl = src;
          } else {
            // Try alternative method - direct mapping from filename
            const thumbnailName = (item.thumbnail.split('/').pop() || '').split('.')[0];
            const videoFiles = await getVideoFiles();
            
            // Find a video with matching filename pattern
            const matchingVideo = videoFiles.find(video => 
              video.includes(thumbnailName) || thumbnailName.includes(video.split('.')[0])
            );
            
            if (matchingVideo) {
              const videoPath = `/videos/${matchingVideo}`;
              console.log(`Found matching video for ${item.title}: ${videoPath}`);
              enhancedItem.videoUrl = videoPath;
            } else {
              console.warn(`Could not find a valid video for ${item.title}`);
            }
          }
        }
      }
      
      // Fix 3D model paths
      if (item.type === '3d' && item.modelUrl) {
        const isModelValid = await validateMediaPath(item.modelUrl, 'model');
        if (!isModelValid) {
          // Try alternative path in 3d_Models directory
          const filename = item.modelUrl.split('/').pop() || '';
          const alternativePath = `/3d_Models/${filename}`;
          const isAlternativeValid = await validateMediaPath(alternativePath, 'model');
          
          if (isAlternativeValid) {
            console.log(`Fixed 3D model path for ${item.title}: ${alternativePath}`);
            enhancedItem.modelUrl = alternativePath;
          }
        }
      }
      
      return enhancedItem;
    }));
    
    return validatedItems;
  };
  
  // Helper function to get all video files
  const getVideoFiles = async (): Promise<string[]> => {
    // This is just a list of known video files in the project
    // In a real implementation, you might fetch this from an API or endpoint
    return [
      '164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4',
      '1def7a12-fc1b-44c0-a194-dce3b16d149f.mp4',
      '23dbabf0-23d0-485b-99e7-3f8b6f5ed1e7.mp4',
      '28d3fdb2-88a4-4c96-b20a-dd1a163e44fc.mp4',
      '51ed0e52-05c7-4b22-b77c-4ad7636c48da.mp4',
      '66280461-94ba-4f3e-b806-53424eef11f4.mp4',
      '68887ce9-f7b2-408a-a3be-4a6b7f45352c.mp4',
      '89e5cee0-56f3-4f75-9c2d-0e3761a6a931.mp4',
      '97ee7aab-6621-49d2-8fa3-3e59da5131e3.mp4',
      'cb546f94-b0c7-41fa-833c-ae5cf24f3748.mp4'
    ];
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 container-custom scroll-container">
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 z-40 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
        aria-label="العودة إلى الأعلى"
      >
        <ArrowUp size={24} className="text-burgundy-900" />
      </button>

      <header className="text-center mb-8 sm:mb-12 animate-fade-in px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-burgundy-900 animate-slide-down">
          الألبوم السحري
        </h1>
        <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 animate-slide-up">
          استكشف مجموعتنا من الصور والفيديوهات والنماذج ثلاثية الأبعاد
        </p>

              <div className="max-w-md mx-auto mb-6 sm:mb-8 relative animate-fade-in">
          <input
            type="text"
            placeholder="ابحث عن صور وفيديوهات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 pr-12 rounded-full border-2 border-burgundy-900 focus:outline-none focus:ring-2 focus:ring-burgundy-900 focus:ring-opacity-50 transition-all duration-300 text-base sm:text-lg bg-white"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-burgundy-900" size={20} />
        </div>


        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`btn text-sm sm:text-base ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'} animate-bounce-in`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveFilter('images')}
            className={`btn text-sm sm:text-base ${activeFilter === 'images' ? 'btn-primary' : 'btn-secondary'} animate-bounce-in delay-100`}
          >
            <ImageIcon size={16} className="inline-block ml-2" />
            الصور
          </button>
          <button
            onClick={() => setActiveFilter('videos')}
            className={`btn text-sm sm:text-base ${activeFilter === 'videos' ? 'btn-primary' : 'btn-secondary'} animate-bounce-in delay-200`}
          >
            <Play size={16} className="inline-block ml-2" />
            الفيديوهات
          </button>
          <button
            onClick={() => setActiveFilter('3d')}
            className={`btn text-sm sm:text-base ${activeFilter === '3d' ? 'btn-primary' : 'btn-secondary'} animate-bounce-in delay-300`}
          >
            <Cube size={16} className="inline-block ml-2" />
            النماذج ثلاثية الأبعاد
          </button>
          <InstallButton />
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-900"></div>
          <p className="mr-2">جاري تحميل البيانات المحسنة...</p>
        </div>
      ) : (
        <div className="masonry-grid px-2 sm:px-0">
          {filteredItems.map((item, index) => (
            <div 
              key={index}
              className="masonry-item animate-float animate-fade-in cursor-pointer"
              style={{
                '--rotation': `${getRandomRotation()}deg`,
              } as React.CSSProperties}
              onClick={() => {
                if (item.type === '3d') {
                  setSelectedMedia(item);
                  setShowModelDetails(true);
                } else {
                  setSelectedMedia(item);
                }
              }}
            >
            <div className="relative group overflow-hidden rounded-lg border-4 border-burgundy-900 shadow-custom hover:shadow-xl transition-all duration-500">
              {item.type === '3d' && show3D[item.title] ? (
                <div className="aspect-square">
                  <Scene3D modelUrl={item.modelUrl!} className="bg-sand-50" />
                </div>
              ) : (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/30 to-transparent opacity-50"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/80 via-burgundy-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-bold text-base sm:text-lg mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{item.description}</p>
                </div>
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2">
                  {item.type === '3d' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle3D(item.title);
                        }}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                        aria-label={show3D[item.title] ? 'عرض الصورة' : 'عرض النموذج ثلاثي الأبعاد'}
                      >
                        <Cube size={16} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMedia(item);
                          setShowModelDetails(true);
                        }}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                        aria-label="معلومات"
                      >
                        <Info size={16} className="text-white" />
                      </button>
                    </>
                  )}
                  {item.type !== '3d' && (
                    <button
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                      aria-label="مشاركة"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Share2 size={16} className="text-white" />
                    </button>
                  )}
                </div>
                {item.type === 'videos' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <Play 
                        size={36} 
                        className="text-white opacity-100 transform scale-100 hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>            </div>
          ))}
        </div>
      )}

      {selectedMedia?.type === 'images' && (
        <ImageModal 
          image={{
            ...selectedMedia,
            details: selectedMedia.details ? {
              ...selectedMedia.details,
              dimensions: typeof selectedMedia.details.dimensions === 'object' 
                ? `${selectedMedia.details.dimensions.width}x${selectedMedia.details.dimensions.height}`
                : selectedMedia.details.dimensions
            } : undefined
          }}
          onClose={() => setSelectedMedia(null)}
        />
      )}

      {selectedMedia?.type === 'videos' && (
        <VideoModal
          video={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}

      {showModelDetails && selectedMedia?.type === '3d' && (
        <ModelDetails
          model={{
            ...selectedMedia,
            details: selectedMedia.details ? {
              ...selectedMedia.details,
              dimensions: typeof selectedMedia.details.dimensions === 'object' 
                ? `${selectedMedia.details.dimensions.width}x${selectedMedia.details.dimensions.height}`
                : selectedMedia.details.dimensions
            } : undefined
          }}
          onClose={() => {
            setShowModelDetails(false);
            setSelectedMedia(null);
          }}
        />
      )}
    </div>
  );
};

export default AlbumGallery;