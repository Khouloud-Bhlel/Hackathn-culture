/**
 * Helper utility to ensure all media files are properly included
 * in the enhanced artifacts data
 */

import { mediaItems } from './albumData';
import { EnhancedMediaItem } from './enhancedArtifacts';

/**
 * Scans the public directories and ensures all media files are included 
 * in the enhanced artifacts data
 */
export async function scanAndUpdateMediaItems(): Promise<EnhancedMediaItem[]> {
  console.log('Scanning media directories for missing files...');
  
  // Start with existing media items
  let enhancedItems: EnhancedMediaItem[] = mediaItems.map(item => {
    // Ensure details has all required properties
    const details = (item.details || {}) as {
      period?: string;
      location?: string;
      material?: string;
      dimensions?: { width: string; height: string } | string;
      story?: string;
    };
    return {
      ...item,
      details: {
        period: details.period || 'غير معروف',
        location: details.location || 'غير معروف',
        material: details.material || 'غير معروف',
        dimensions: typeof details.dimensions === 'object' 
          ? { 
              width: details.dimensions.width || '', 
              height: details.dimensions.height || '' 
            }
          : (details.dimensions || 'غير معروف'),
        story: details.story || 'قطعة من مجموعة المتحف.'
      }
    } as EnhancedMediaItem;
  });
  
  try {
    // Try to fetch the enhanced data first
    const response = await fetch('/enhanced-artifacts.json');
    
    if (response.ok) {
      const data = await response.json();
      enhancedItems = data;
      console.log('Loaded enhanced artifacts from JSON file');
    } else {
      console.warn('Could not load enhanced-artifacts.json, using default items');
    }

    // Get the list of all image files from the directory
    const imageFiles = await fetchImagesList();
    
    // For each image, ensure it's in the mediaItems
    for (const imagePath of imageFiles) {
      const fileName = imagePath.split('/').pop() || '';
      if (!fileName.endsWith('.jpeg') && !fileName.endsWith('.jpg') && !fileName.endsWith('.png')) {
        continue; // Skip non-image files
      }
      
      // Check if this image is already in the list
      const existing = enhancedItems.find(item => 
        item.thumbnail === imagePath || item.thumbnail === `/images/${fileName}`
      );
      
      // If not found, add it as a new image
      if (!existing) {
        const newItem: EnhancedMediaItem = {
          type: 'images',
          title: `صورة ${fileName.split('.')[0]}`,
          description: 'صورة من مجموعة المتحف',
          thumbnail: `/images/${fileName}`,
          date: getCurrentArabicDate(),
          details: {
            period: 'غير معروف',
            location: 'غير معروف',
            material: 'غير معروف',
            dimensions: 'غير معروف',
            story: 'قطعة من مجموعة المتحف تحتاج إلى مزيد من المعلومات.'
          }
        };
        
        enhancedItems.push(newItem);
        console.log(`Added new image: ${fileName}`);
      }
    }
    
    // Get the list of video files as well
    const videoFiles = await fetchVideosList();
    
    // For each video, ensure it's in the mediaItems
    for (const videoPath of videoFiles) {
      const fileName = videoPath.split('/').pop() || '';
      if (!fileName.endsWith('.mp4') && !fileName.endsWith('.webm') && !fileName.endsWith('.ogg')) {
        continue; // Skip non-video files
      }
      
      // Generate a thumbnail name from the video filename
      const thumbnailName = fileName.replace(/\.(mp4|webm|ogg)$/, '.jpeg');
      
      // Check if this video is already in the list (by checking video path association)
      const existing = enhancedItems.find(item => 
        item.type === 'videos' && 
        (item.videoUrl === videoPath || item.videoUrl === `/videos/${fileName}`)
      );
      
      // If not found, add it as a new video
      if (!existing) {
        // Check if there's an image with the same name to use as thumbnail
        const thumbnailExists = imageFiles.some(path => path.includes(thumbnailName));
        
        const thumbnailPath = thumbnailExists 
          ? `/images/${thumbnailName}` 
          : '/images/fallback-image.svg';
        
        const newItem: EnhancedMediaItem = {
          type: 'videos',
          title: `فيديو ${fileName.split('.')[0]}`,
          description: 'فيديو من مجموعة المتحف',
          thumbnail: thumbnailPath,
          date: getCurrentArabicDate(),
          videoUrl: `/videos/${fileName}`,
          details: {
            period: 'غير معروف',
            location: 'غير معروف',
            material: 'غير معروف',
            dimensions: 'غير معروف',
            story: 'فيديو من مجموعة المتحف يحتاج إلى مزيد من المعلومات.'
          }
        };
        
        enhancedItems.push(newItem);
        console.log(`Added new video: ${fileName}`);
      }
    }
    
    // Save the updated items to localStorage
    localStorage.setItem('enhanced-artifacts', JSON.stringify(enhancedItems));
    
    return enhancedItems;
    
  } catch (error) {
    console.error('Error scanning media directories:', error);
    return enhancedItems;
  }
}

/**
 * Helper function to fetch the list of images in the /images directory
 * This is a mock function since we can't directly list directory contents in the browser
 */
async function fetchImagesList(): Promise<string[]> {
  try {
    // In a real implementation, this would call an API to list directory contents
    // For now, we'll return a hardcoded list based on our knowledge of the files
    return [
      '/images/012d4bbf-14d6-4a5c-ae99-5eca4e179175.jpeg',
      '/images/0183c9b6-9ac0-4e04-a1d3-25b7820d200e.jpeg',
      '/images/0897001c-bfd3-4099-9f5f-6a8799629397.jpeg',
      '/images/0a403a17-d520-4eb3-8e7f-776d6afdb7eb.jpeg',
      '/images/169f8d74-0fbc-4ed3-84dd-51f8964ca6bf.jpeg',
      '/images/32fda20c-c9bd-4aab-b2cf-e0e33454efda.jpeg',
      '/images/43929058-2b7b-44a3-a7f9-13eb830cd82d.jpeg',
      '/images/43d15ac4-4229-4bf7-bdde-8c75e9be13ac.jpeg',
      '/images/4ed0dd86-c549-40e7-a37a-a39ab2054b62.jpeg',
      '/images/50cd96e8-8405-420d-b833-bafb79aa8970.jpeg',
      '/images/54d87251-629a-4f20-8531-59e5fc7e5aa9.jpeg',
      '/images/79255007-ebd4-4265-a443-db0ebd6cc166.jpeg',
      '/images/8647f546-091f-4e39-a4d5-0cc647c2652c.jpeg',
      '/images/8f87e511-92ab-4054-945c-84e1f324707c.jpeg',
      '/images/95854e3d-c03d-41fd-bf70-1db714787537.jpeg',
      '/images/989c1827-a0ea-4184-afd6-e561579e2172.jpeg',
      '/images/9a245834-3207-4b43-90a9-00651d2faede.jpeg',
      '/images/9ce4d8f3-d071-4184-afb7-1e9655d4a80c.jpeg',
      '/images/9f7312d9-2067-4e0d-85d3-04e1db8e4136.jpeg',
      '/images/a10ebf2e-22ff-4354-bcc5-14d72b2f0a51.jpeg',
      '/images/a161da6b-253c-4a00-ac29-4dcb0a688d69.jpeg',
      '/images/a56bdc62-1c47-4021-9549-edc4ac6024b3.jpeg',
      '/images/b5b51605-1c17-40a4-b678-557251497897.jpeg',
      '/images/cb98a6c7-6c67-4abf-bfa0-ea48ff33ec32.jpeg',
      '/images/d3d42f3e-9c45-4bdd-a435-a30215e4ce10.jpeg',
      '/images/dd530a97-8939-47e4-9793-563cc729d35d.jpeg',
      '/images/e554eec8-8887-44f7-ad4c-223e3ce8fc94.jpeg',
      '/images/e57de67e-2cec-47d0-8a90-fd72366e9d89.jpeg',
      '/images/fa773ac1-56de-4378-91fb-5b529185e67d.jpeg',
      '/images/fallback-image.svg'
    ];
  } catch (error) {
    console.error('Error fetching images list:', error);
    return [];
  }
}

/**
 * Helper function to fetch the list of videos in the /videos directory
 */
async function fetchVideosList(): Promise<string[]> {
  try {
    // In a real implementation, this would call an API to list directory contents
    return [
      '/videos/164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4',
      '/videos/1def7a12-fc1b-44c0-a194-dce3b16d149f.mp4',
      '/videos/23dbabf0-23d0-485b-99e7-3f8b6f5ed1e7.mp4',
      '/videos/28d3fdb2-88a4-4c96-b20a-dd1a163e44fc.mp4',
      '/videos/51ed0e52-05c7-4b22-b77c-4ad7636c48da.mp4',
      '/videos/66280461-94ba-4f3e-b806-53424eef11f4.mp4',
      '/videos/68887ce9-f7b2-408a-a3be-4a6b7f45352c.mp4',
      '/videos/89e5cee0-56f3-4f75-9c2d-0e3761a6a931.mp4',
      '/videos/97ee7aab-6621-49d2-8fa3-3e59da5131e3.mp4',
      '/videos/cb546f94-b0c7-41fa-833c-ae5cf24f3748.mp4'
    ];
  } catch (error) {
    console.error('Error fetching videos list:', error);
    return [];
  }
}

/**
 * Get current date in Arabic format
 */
function getCurrentArabicDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}
