#!/usr/bin/env node

/**
 * Generate a fallback enhanced-artifacts.json file without requiring OpenAI API
 * This script creates default enhanced descriptions and details for all artifacts
 * and saves them to the public directory for the app to use.
 */

import { mediaItems } from '../src/utils/albumData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output file path
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'enhanced-artifacts.json');

/**
 * Generate a default enhanced description for an artifact
 */
function generateDefaultDescription(title, description, type) {
  // Different templates based on artifact type
  if (type === '3d') {
    return `هذه قطعة "${title}" تعتبر من القطع الأثرية المصرية البارزة. ${description} وتعكس القطعة براعة الفنان المصري القديم في النحت والتشكيل، وتوضح جوانب مهمة من الحضارة المصرية القديمة. تم الحفاظ على هذه القطعة بشكل جيد على مر السنين، وهي الآن من المقتنيات المهمة في معرضنا.`;
  } else if (type === 'videos') {
    return `فيديو "${title}" يقدم محتوى تعليمي قيم عن تاريخ مصر القديمة. ${description} يتضمن الفيديو شرحًا تفصيليًا ومعلومات تاريخية دقيقة تساعد الزائر على فهم السياق التاريخي والثقافي للحضارة المصرية.`;
  } else {
    return `صورة "${title}" تعرض قطعة أثرية نادرة من المتحف. ${description} تظهر الصورة التفاصيل الدقيقة والزخارف المميزة التي تعكس الفن المصري القديم وأساليب الصناعة الدقيقة. تعتبر هذه القطعة شاهدًا على إبداع الفنان المصري القديم.`;
  }
}

/**
 * Generate default details for an artifact
 */
function generateDefaultDetails(title, description, type) {
  // Create appropriate details based on artifact type
  if (type === '3d') {
    return {
      period: 'العصر الفرعوني الحديث',
      location: 'مصر القديمة',
      material: 'حجر جيري / برونز / خشب',
      dimensions: 'متنوعة',
      story: `قطعة "${title}" تمثل جزءًا مهمًا من التاريخ المصري القديم. ${description} تم اكتشاف هذه القطعة خلال الحفريات الأثرية وتعتبر شاهدًا على الإبداع والتطور الفني والتقني في الحضارة المصرية القديمة. تخبرنا هذه القطعة قصة عن الحياة اليومية والمعتقدات الدينية والأساليب الفنية للمصريين القدماء.`
    };
  } else {
    return {
      period: 'متنوع',
      location: 'مصر',
      material: 'متنوع',
      dimensions: 'غير محدد',
      story: `${description} هذه القطعة تعكس جانبًا مهمًا من جوانب الحضارة المصرية القديمة وفنونها المتنوعة. تساعدنا على فهم العادات والتقاليد وأساليب الحياة في تلك الفترة التاريخية المهمة.`
    };
  }
}

console.log('🚀 Generating default enhanced artifacts data...');
console.log(`Total artifacts to process: ${mediaItems.length}`);

// Create enhanced version of all media items
const enhancedItems = mediaItems.map((item, index) => {
  console.log(`Processing (${index + 1}/${mediaItems.length}): ${item.title}`);
  
  // Create an enhanced description
  const enhancedDescription = generateDefaultDescription(item.title, item.description, item.type);
  
  // Create details object if it doesn't exist
  const enhancedDetails = item.details || generateDefaultDetails(item.title, item.description, item.type);
  
  // If it has details but no story, add a story
  if (!enhancedDetails.story) {
    enhancedDetails.story = generateDefaultDescription(item.title, item.description, item.type);
  }
  
  return {
    ...item,
    description: enhancedDescription,
    details: enhancedDetails
  };
});

// Make sure the public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('📁 Created public directory');
}

// Save the enhanced data to a JSON file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enhancedItems, null, 2), 'utf-8');
console.log(`\n✅ Default enhanced artifacts data saved to: ${OUTPUT_FILE}`);
console.log(`✅ Successfully processed: ${enhancedItems.length} artifacts`);
