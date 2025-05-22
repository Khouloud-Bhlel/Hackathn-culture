/**
 * This utility scans the public/images directory for all image files.
 */

import { mediaItems } from './albumData';

// Interface for image file data
export interface ImageFileData {
  id: string;
  filename: string;
  path: string;
  title: string;
}

/**
 * Gets a list of all image files in the public/images directory
 * This function relies on the mediaItems for now, but can be extended to
 * fetch the directory listing from the server if needed
 */
export async function scanImageDirectory(): Promise<ImageFileData[]> {
  // For now, we'll extract images from mediaItems
  // In a production environment, you might want to use a server endpoint
  // that returns a listing of all files in the public/images directory
  
  // Extract unique images from mediaItems
  const knownImages = mediaItems
    .filter(item => item.thumbnail)
    .map(item => {
      const filename = item.thumbnail.split('/').pop() || '';
      const id = filename.split('.')[0];
      return {
        id,
        filename,
        path: item.thumbnail,
        title: item.title || 'Untitled Artifact'
      };
    })
    // Filter out duplicates by filename
    .filter((item, index, self) => 
      index === self.findIndex(t => t.filename === item.filename)
    );
  
  // In the future, you could extend this with a fetch request:
  // const response = await fetch('/api/images');
  // const allImages = await response.json();
  // ...

  return knownImages;
}

/**
 * Gets information about an image file by its ID
 * @param id The ID of the image (filename without extension)
 */
export async function getImageById(id: string): Promise<ImageFileData | null> {
  const allImages = await scanImageDirectory();
  return allImages.find(image => image.id === id) || null;
}

/**
 * Creates a title for an image if it doesn't have one in mediaItems
 * @param filename The filename of the image
 */
export function generateImageTitle(filename: string): string {
  // First check if we have a title in mediaItems
  const mediaItem = mediaItems.find(item => {
    const itemFilename = item.thumbnail.split('/').pop() || '';
    return itemFilename === filename;
  });
  
  if (mediaItem?.title) {
    return mediaItem.title;
  }
  
  // Otherwise, generate a title from the filename
  const id = filename.split('.')[0];
  // Format the ID to look nicer by splitting on dashes and capitalizing
  const formattedId = id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return `Artifact ${formattedId}`;
}
