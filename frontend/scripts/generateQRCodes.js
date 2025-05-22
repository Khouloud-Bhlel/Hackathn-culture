#!/usr/bin/env node
/**
 * QR Code Generation Script
 * This script generates QR codes for testing the museum application.
 * 
 * Usage:
 *   node generateQRCodes.js
 * 
 * Requirements:
 *   - qrcode npm package: npm install qrcode
 *   - fs-extra npm package: npm install fs-extra
 */

const fs = require('fs-extra');
const qrcode = require('qrcode');
const path = require('path');

// Sample artifact titles from your application
const artifactTitles = [
  'تمثال نفرتيتي',
  'إناء فخاري',
  'قناع توت عنخ آمون',
  'مجموعة الفخار',
  'النقوش الهيروغليفية',
  'قصة المتحف',
  'تاج الملك',
  'لوحة جدارية',
  'عملات قديمة',
  'أدوات كتابة قديمة'
];

// QR code formats to generate
const formats = [
  { name: 'standard', prefix: 'museum-artifact:' },
  { name: 'short', prefix: 'artifact:' },
  { name: 'path', prefix: '/artifacts/' },
  { name: 'url', prefix: 'https://museum-app.example.com/artifacts/' }
];

// Output directory
const outputDir = path.join(__dirname, 'public', 'qr-codes');

// Create output directory if it doesn't exist
fs.ensureDirSync(outputDir);

// Generate QR codes for all artifacts in all formats
async function generateQRCodes() {
  console.log('Generating QR codes...');
  
  for (const title of artifactTitles) {
    // Normalize the title
    const normalizedTitle = title.replace(/\s+/g, '-').toLowerCase();
    
    for (const format of formats) {
      const content = `${format.prefix}${normalizedTitle}`;
      const filename = `${normalizedTitle}-${format.name}.png`;
      const outputPath = path.join(outputDir, filename);
      
      try {
        await qrcode.toFile(outputPath, content, {
          errorCorrectionLevel: 'H',
          margin: 1,
          scale: 8,
          color: {
            dark: '#6d2e46',  // Burgundy color
            light: '#ffffff'  // White
          }
        });
        console.log(`Generated: ${filename}`);
      } catch (err) {
        console.error(`Error generating QR code for ${title} in ${format.name} format:`, err);
      }
    }
  }
  
  console.log(`\nQR codes generated in: ${outputDir}`);
  console.log('Use these QR codes for testing the museum application.');
}

// Run the generator
generateQRCodes();
