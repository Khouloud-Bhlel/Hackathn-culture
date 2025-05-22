import { getVideoForThumbnail } from './albumData';

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
