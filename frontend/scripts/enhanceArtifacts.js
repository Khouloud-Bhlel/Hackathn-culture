/**
 * Generate enhanced descriptions for artifacts using OpenAI API
 * This script processes all media items and adds AI-generated descriptions
 * The results are saved to a JSON file that can be imported into the app
 */

import { mediaItems } from '../utils/albumData';
import { generateArtifactDescription } from '../utils/openaiService';
import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'enhanced-artifacts.json');

/**
 * Process all media items and generate enhanced descriptions
 */
async function enhanceArtifacts() {
  console.log('Starting artifact enhancement process...');
  console.log(`Total artifacts to process: ${mediaItems.length}`);
  
  const enhancedItems = [...mediaItems];
  let processed = 0;

  for (const item of enhancedItems) {
    try {
      // Only process items without detailed descriptions
      if (!item.details?.story) {
        console.log(`Processing: ${item.title} (${item.type})`);
        
        // Generate enhanced description
        const enhancedDescription = await generateArtifactDescription(item.title, item.description);
        
        // Create details object if it doesn't exist
        if (!item.details) {
          item.details = {
            period: 'غير معروف',
            location: 'غير معروف',
            material: 'غير معروف',
            dimensions: 'غير معروف',
            story: enhancedDescription
          };
        } else {
          // Just add the story if details already exist
          item.details.story = enhancedDescription;
        }
        
        // Update the description as well
        item.description = enhancedDescription.split('.')[0] + '.'; // First sentence only for description
        
        processed++;
        console.log(`Processed ${processed}/${mediaItems.length} artifacts`);
      } else {
        console.log(`Skipping: ${item.title} (already has detailed description)`);
      }
    } catch (error) {
      console.error(`Failed to enhance: ${item.title}`, error);
    }
    
    // Add a small delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save the enhanced data to a JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enhancedItems, null, 2), 'utf-8');
  console.log(`\nEnhancement complete! Enhanced data saved to: ${OUTPUT_FILE}`);
  console.log(`Successfully processed: ${processed} artifacts`);
}

// Execute the function
enhanceArtifacts().catch(error => {
  console.error('Error running enhancement script:', error);
  process.exit(1);
});
