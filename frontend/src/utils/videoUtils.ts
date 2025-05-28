import { getVideoForThumbnail } from './albumData';
import { validateMediaPath } from './mediaPathValidation';

/**
 * Determines the correct video source based on the thumbnail path
 * and ensures the video can be played correctly
 */
export const getVideoSource = (thumbnailPath: string): { 
  src: string; 
  type: string;
} => {
  const videoPath = getVideoForThumbnail(thumbnailPath);
  
  // Determine the MIME type based on the file extension
  let type = 'video/mp4'; // Default to MP4
  
  if (videoPath.endsWith('.webm')) {
    type = 'video/webm';
  } else if (videoPath.endsWith('.mov')) {
    type = 'video/quicktime';
  } else if (videoPath.endsWith('.ogg')) {
    type = 'video/ogg';
  }
  
  return {
    src: videoPath,
    type
  };
};

/**
 * Asynchronously gets the video source with validation
 * This is useful when you want to verify the video exists before trying to play it
 */
export const getValidatedVideoSource = async (thumbnailPath: string): Promise<{ 
  src: string; 
  type: string;
  isValid: boolean;
}> => {
  const { src, type } = getVideoSource(thumbnailPath);
  
  // Validate that the video exists
  const isValid = await validateMediaPath(src, 'video');
  
  if (!isValid) {
    console.warn(`Video not found at path: ${src}, will try fallback videos`);
    
    // Try common video files as fallback
    const videoFiles = [
      '/videos/164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4',
      '/videos/1def7a12-fc1b-44c0-a194-dce3b16d149f.mp4',
      '/videos/23dbabf0-23d0-485b-99e7-3f8b6f5ed1e7.mp4'
    ];
    
    // Try each fallback video
    for (const fallback of videoFiles) {
      const fallbackValid = await validateMediaPath(fallback, 'video');
      if (fallbackValid) {
        return {
          src: fallback,
          type: 'video/mp4',
          isValid: true
        };
      }
    }
  }
  
  return {
    src,
    type,
    isValid
  };
};
