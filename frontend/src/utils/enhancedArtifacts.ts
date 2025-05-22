// Enhanced artifacts data loader
import { mediaItems } from './albumData';

// Type definitions
export interface EnhancedMediaItem {
  type: 'images' | 'videos' | '3d';
  title: string;
  description: string;
  thumbnail: string;
  date: string;
  modelUrl?: string;
  videoUrl?: string;  // Added for video items to specify direct path to video files
  details?: {
    period: string;
    location: string;
    material: string;
    dimensions: string | { width: string; height: string; }; // Support for both string and object formats
    story: string;
  };
}

// Variable to store the enhanced media items
let enhancedMediaItems: EnhancedMediaItem[] = [...mediaItems];

/**
 * Load enhanced artifacts from the JSON file
 * This will attempt to load the enhanced data, but fall back to the original data if needed
 */
export async function loadEnhancedArtifacts(): Promise<EnhancedMediaItem[]> {
  try {
    // Try to fetch the enhanced data
    const response = await fetch('/enhanced-artifacts.json');
    
    if (response.ok) {
      const data = await response.json();
      enhancedMediaItems = data;
      console.log('Enhanced artifacts data loaded successfully');
      
      // Save to localStorage as a backup
      localStorage.setItem('enhanced-artifacts', JSON.stringify(data));
      return data;
    } else {
      // Check if we have data in localStorage
      const storedData = localStorage.getItem('enhanced-artifacts');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        enhancedMediaItems = parsedData;
        console.log('Enhanced artifacts loaded from localStorage');
        return parsedData;
      }
      
      console.warn('Enhanced artifacts data not found, using default data');
      
      // Generate and save default enhanced data to localStorage
      const defaultEnhanced = enhancedMediaItems.map(item => {
        if (!item.details) {
          return {
            ...item,
            details: {
              period: 'غير معروف',
              location: 'غير معروف',
              material: 'غير معروف',
              dimensions: 'غير معروف',
              story: `${item.description} قطعة أثرية مهمة تعكس الحضارة المصرية القديمة وفنونها.`
            }
          };
        }
        return item;
      });
      
      localStorage.setItem('enhanced-artifacts', JSON.stringify(defaultEnhanced));
      enhancedMediaItems = defaultEnhanced;
      return defaultEnhanced;
    }
  } catch (error) {
    console.error('Error loading enhanced artifacts:', error);
    
    // Try localStorage as a fallback
    const storedData = localStorage.getItem('enhanced-artifacts');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        enhancedMediaItems = parsedData;
        return parsedData;
      } catch (e) {
        console.error('Error parsing stored data:', e);
      }
    }
    
    return enhancedMediaItems;
  }
}

/**
 * Get the enhanced media items
 * If not yet loaded, it will return the original media items
 */
export function getEnhancedMediaItems(): EnhancedMediaItem[] {
  return enhancedMediaItems;
}

/**
 * Get an enhanced artifact by ID
 * This uses the same matching logic as getArtifactById but with enhanced data
 */
export function getEnhancedArtifactById(artifactId: string): EnhancedMediaItem | null {
  // Normalize the input for better matching
  const normalizedInput = artifactId.toLowerCase().replace(/[-_\s]+/g, '').trim();
  
  // First find by matching the filename in thumbnail
  const fileMatch = enhancedMediaItems.find(item => {
    const filename = item.thumbnail.split('/').pop() || '';
    const id = filename.split('.')[0];
    return id === artifactId;
  });
  
  if (fileMatch) {
    return fileMatch;
  }
  
  // If not found, check if artifactId contains type prefix
  if (artifactId.includes(':')) {
    const [type, id] = artifactId.split(':');
    
    if (type === 'video') {
      return enhancedMediaItems.find(item => {
        const filename = item.thumbnail.split('/').pop() || '';
        const itemId = filename.split('.')[0];
        return itemId === id && item.type === 'videos';
      }) || null;
    }
    
    if (type === 'model') {
      return enhancedMediaItems.find(item => {
        const filename = item.thumbnail.split('/').pop() || '';
        const itemId = filename.split('.')[0];
        return itemId === id && item.type === '3d';
      }) || null;
    }
  }
  
  // Try matching by title (for QR codes that contain artifact titles)
  const titleMatch = enhancedMediaItems.find(item => {
    const normalizedTitle = item.title.toLowerCase().replace(/[-_\s]+/g, '').trim();
    // Exact match
    return normalizedTitle === normalizedInput;
  });
  
  if (titleMatch) {
    return titleMatch;
  }
  
  // Try fuzzy matching of titles
  const fuzzyMatch = enhancedMediaItems.find(item => {
    const normalizedTitle = item.title.toLowerCase().replace(/[-_\s]+/g, '').trim();
    // Check if one is a substring of the other
    return normalizedTitle.includes(normalizedInput) || normalizedInput.includes(normalizedTitle);
  });
  
  return fuzzyMatch || null;
}
