/**
 * Media path validation utility
 * Helps ensure that image and video paths are correct
 */

/**
 * Validates if a media path is correct and the file exists
 * @param path The path to validate
 * @param type The type of media ('image', 'video', or 'model')
 * @returns A promise that resolves to true if the file exists, false otherwise
 */
export async function validateMediaPath(path: string, type: 'image' | 'video' | 'model'): Promise<boolean> {
  if (!path) return false;
  
  // Remove leading slash if present for fetch
  
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error validating ${type} path: ${path}`, error);
    return false;
  }
}

/**
 * Ensures a video path is correct
 * @param videoPath Path to the video
 * @param fallbackPath Optional fallback path if the video doesn't exist
 * @returns A promise that resolves to the valid video path or the fallback
 */
export async function ensureValidVideoPath(
  videoPath: string, 
  fallbackPath: string = '/videos/164d8230-9b7c-4c64-99b5-3301f1b5ab58.mp4'
): Promise<string> {
  if (!videoPath) return fallbackPath;
  
  const isValid = await validateMediaPath(videoPath, 'video');
  return isValid ? videoPath : fallbackPath;
}

/**
 * Ensures an image path is correct
 * @param imagePath Path to the image
 * @param fallbackPath Optional fallback path if the image doesn't exist
 * @returns A promise that resolves to the valid image path or the fallback
 */
export async function ensureValidImagePath(
  imagePath: string, 
  fallbackPath: string = '/images/fallback-image.svg'
): Promise<string> {
  if (!imagePath) return fallbackPath;
  
  const isValid = await validateMediaPath(imagePath, 'image');
  return isValid ? imagePath : fallbackPath;
}

/**
 * Fixes a potentially incorrect media path by trying common variations
 * @param path The original path to fix
 * @param type The type of media ('image', 'video', or 'model')
 * @returns A promise that resolves to the fixed path or the original if no fix could be found
 */
export async function fixMediaPath(path: string, type: 'image' | 'video' | 'model'): Promise<string> {
  if (!path) return path;
  
  // First check if the original path is valid
  const isOriginalValid = await validateMediaPath(path, type);
  if (isOriginalValid) return path;
  
  // Try variations on the path
  const pathVariations: string[] = [];
  
  // Get filename and extension
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  const filenameWithoutExt = filename.split('.')[0];
  
  if (type === 'image') {
    // Try different image directories
    pathVariations.push(`/images/${filename}`);
    
    // Try different image extensions
    const imageExts = ['.jpeg', '.jpg', '.png', '.webp', '.svg'];
    for (const ext of imageExts) {
      pathVariations.push(`/images/${filenameWithoutExt}${ext}`);
    }
  } else if (type === 'video') {
    // Try different video directories
    pathVariations.push(`/videos/${filename}`);
    
    // Try different video extensions
    const videoExts = ['.mp4', '.webm', '.ogg', '.mov'];
    for (const ext of videoExts) {
      pathVariations.push(`/videos/${filenameWithoutExt}${ext}`);
    }
  } else if (type === 'model') {
    // Try different 3D model directories
    pathVariations.push(`/3d_Models/${filename}`);
    pathVariations.push(`/models/${filename}`);
    
    // Try different model extensions
    const modelExts = ['.glb', '.gltf', '.obj', '.fbx'];
    for (const ext of modelExts) {
      pathVariations.push(`/3d_Models/${filenameWithoutExt}${ext}`);
      pathVariations.push(`/models/${filenameWithoutExt}${ext}`);
    }
  }
  
  // Try all variations
  for (const variation of pathVariations) {
    const isValid = await validateMediaPath(variation, type);
    if (isValid) return variation;
  }
  
  // If no valid path found, return the original path
  return path;
}
