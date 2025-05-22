/**
 * Utility for automatically generating and loading enhanced artifact data
 * This will check if the enhanced-artifacts.json file exists, and if not,
 * it will generate it using default descriptions
 */

import { mediaItems } from './albumData';
import { EnhancedMediaItem } from './enhancedArtifacts';

/**
 * Generate default enhanced descriptions without requiring OpenAI
 * This creates a fallback JSON file that can be used without API access
 */
export async function generateDefaultEnhancedData(): Promise<EnhancedMediaItem[]> {
  console.log('Generating default enhanced data for artifacts...');
  
  const enhancedItems: EnhancedMediaItem[] = mediaItems.map(item => {
    // Create a copy of the item with enhanced data
    const enhancedItem: EnhancedMediaItem = {
      ...item,
      description: item.description,
    };

    // If the item doesn't have details, add default details
    if (!enhancedItem.details) {
      enhancedItem.details = {
        period: item.type === '3d' ? 'العصر الفرعوني' : 'غير معروف',
        location: item.type === '3d' ? 'مصر القديمة' : 'غير معروف',
        material: item.type === '3d' ? 'مواد متنوعة' : 'غير معروف',
        dimensions: 'غير معروف',
        story: `${item.description} هذه القطعة تعتبر من القطع المهمة في مجموعة المتحف، وتعكس الحضارة المصرية القديمة وفنونها المتنوعة.`
      };
    }

    return enhancedItem;
  });

  // Save the enhanced data to local storage
  localStorage.setItem('enhanced-artifacts', JSON.stringify(enhancedItems));
  
  return enhancedItems;
}

/**
 * Attempt to load enhanced artifacts, and generate default data if not available
 */
export async function ensureEnhancedData(): Promise<EnhancedMediaItem[]> {
  try {
    // Try to fetch the enhanced data from the JSON file
    const response = await fetch('/enhanced-artifacts.json');
    
    if (response.ok) {
      const data = await response.json();
      console.log('Enhanced artifacts loaded from JSON file');
      // Also save to localStorage as backup
      localStorage.setItem('enhanced-artifacts', JSON.stringify(data));
      return data;
    } else {
      // If the file doesn't exist, check localStorage
      const storedData = localStorage.getItem('enhanced-artifacts');
      if (storedData) {
        console.log('Enhanced artifacts loaded from localStorage');
        return JSON.parse(storedData);
      }
      
      // If not in localStorage either, generate default data
      console.log('Enhanced artifacts not found, generating default data');
      return await generateDefaultEnhancedData();
    }
  } catch (error) {
    console.error('Error loading enhanced artifacts:', error);
    
    // If there's an error, try localStorage
    const storedData = localStorage.getItem('enhanced-artifacts');
    if (storedData) {
      console.log('Enhanced artifacts loaded from localStorage after error');
      return JSON.parse(storedData);
    }
    
    // Last resort: generate default data
    return await generateDefaultEnhancedData();
  }
}
