/**
 * This is a modified version of the enhance artifacts utility.
 * It adds videoUrl properties to video artifacts based on thumbnail paths.
 */

import { mediaItems } from './albumData';
import { getVideoForThumbnail } from './albumData';
import { EnhancedMediaItem } from './enhancedArtifacts';

/**
 * Enhance the artifacts data with additional information
 * and correct video URLs
 */
export async function enhanceArtifactsWithVideos(): Promise<EnhancedMediaItem[]> {
  console.log('Enhancing artifacts with video URLs...');
  
  // Try to load existing enhanced data first
  try {
    const response = await fetch('/enhanced-artifacts.json');
    
    if (response.ok) {
      const data = await response.json() as EnhancedMediaItem[];
      console.log('Loaded original enhanced artifacts data');
      
      // Add videoUrl properties to video items if they don't have them
      const enhancedData = data.map(item => {
        if (item.type === 'videos') {
          if (!item.videoUrl) {
            // Use the improved getVideoForThumbnail function to map thumbnails to videos
            const videoUrl = getVideoForThumbnail(item.thumbnail);
            
            console.log(`Adding videoUrl: ${videoUrl} for ${item.title}`);
            
            return {
              ...item,
              videoUrl
            };
          }
        }
        return item;
      });
      
      console.log('Enhanced video artifacts with direct URLs');
      localStorage.setItem('enhanced-artifacts-with-videos', JSON.stringify(enhancedData));
      return enhancedData;
    }
  } catch (error) {
    console.error('Error enhancing artifacts with videos:', error);
  }
  
  // Fallback to enhancing the original media items
  const enhancedData = mediaItems.map(item => {
    // Create a deep copy of the item we can safely modify
    const enhancedItem = { ...item } as any;
    
    // Fix dimensions structure if needed
    if (enhancedItem.details && typeof enhancedItem.details.dimensions === 'object') {
      enhancedItem.details = {
        ...enhancedItem.details,
        dimensions: {
          width: enhancedItem.details.dimensions.width || '',
          height: enhancedItem.details.dimensions.height || ''
        }
      };
    }
    
    if (item.type === 'videos') {
      // Get video file path from thumbnail
      const videoPath = getVideoForThumbnail(item.thumbnail);
      
      // Update the path to point to the videos directory
      const videoUrl = videoPath.replace('/images/', '/videos/');
      
      enhancedItem.videoUrl = videoUrl;
    }
    
    return enhancedItem as EnhancedMediaItem;
  });
  
  console.log('Created enhanced artifacts with video URLs from scratch');
  localStorage.setItem('enhanced-artifacts-with-videos', JSON.stringify(enhancedData));
  return enhancedData;
}
