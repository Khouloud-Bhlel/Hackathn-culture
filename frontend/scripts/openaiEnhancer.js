#!/usr/bin/env node

/**
 * Simple OpenAI enhanced artifacts generator
 * This version works with paths containing spaces and loads API key correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mediaItems } from '../src/utils/albumData.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output file path
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'enhanced-artifacts.json');

// Get API key from environment variable
const API_KEY = process.env.VITE_OPENAI_API_KEY || '';

// Check if API key is available
if (!API_KEY) {
  console.error('❌ Error: VITE_OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

console.log(`API key detected: ${API_KEY.substring(0, 10)}...${API_KEY.slice(-5)}`);
console.log(`Total artifacts to process: ${mediaItems.length}`);

/**
 * Generate a description for an artifact using OpenAI
 */
async function generateArtifactDescription(title, existingDescription) {
  try {
    console.log(`Generating description for: ${title}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في التاريخ والآثار المصرية. قم بإنشاء وصف تفصيلي وممتع لقطعة أثرية مصرية باللغة العربية. الوصف يجب أن يكون دقيقاً تاريخياً وجذاباً للزوار.'
          },
          {
            role: 'user',
            content: `عنوان القطعة الأثرية: "${title}". الوصف الحالي: "${existingDescription}". أرجو إنشاء وصف أكثر تفصيلاً وعمقاً.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return existingDescription;
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating description:', error);
    return existingDescription; // Return existing description on error
  }
}

/**
 * Process all media items and generate enhanced descriptions
 */
async function enhanceArtifacts() {
  console.log('🚀 Starting artifact enhancement process...');
  
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
  
  // Make sure the public directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Save the enhanced data to a JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enhancedItems, null, 2), 'utf-8');
  console.log(`\n✅ Enhancement complete! Enhanced data saved to: ${OUTPUT_FILE}`);
  console.log(`Successfully processed: ${processed} artifacts`);
}

// Execute the enhancement function
enhanceArtifacts().catch(error => {
  console.error('Error running enhancement script:', error);
  process.exit(1);
});
