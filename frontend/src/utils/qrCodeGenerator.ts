/**
 * QR Code Generator Tool for Museum Artifacts
 * This script helps create QR codes for testing the museum application.
 * 
 * Usage:
 * - Run this file in a browser or Node.js environment
 * - It will generate URLs that can be used with any QR code generator
 */

import { mediaItems } from '../utils/albumData';

/**
 * Generate QR Code content in different formats
 */
function generateQRCodeFormats(artifactTitle: string): {
  standard: string;
  short: string;
  urlPath: string;
  fullUrl: string;
} {
  // Normalize the title
  const normalizedTitle = artifactTitle.replace(/\s+/g, '-').toLowerCase();
  
  return {
    standard: `museum-artifact:${normalizedTitle}`,
    short: `artifact:${normalizedTitle}`,
    urlPath: `/artifacts/${normalizedTitle}`,
    fullUrl: `https://museum-app.example.com/artifacts/${normalizedTitle}`
  };
}

/**
 * Generate QR codes for all artifacts
 */
function generateAllArtifactQRCodes(): Array<{
  title: string;
  type: string;
  qrCodes: {
    standard: string;
    short: string;
    urlPath: string;
    fullUrl: string;
  };
}> {
  const allCodes: Array<{
    title: string;
    type: string;
    qrCodes: {
      standard: string;
      short: string;
      urlPath: string;
      fullUrl: string;
    };
  }> = [];
  
  mediaItems.forEach(item => {
    const codes = generateQRCodeFormats(item.title);
    allCodes.push({
      title: item.title,
      type: item.type,
      qrCodes: codes
    });
  });
  
  return allCodes;
}

// Log the QR code content for all artifacts - can be used with any QR code generator
console.log("=== Museum Artifact QR Codes ===");
const allCodes = generateAllArtifactQRCodes();
allCodes.forEach(item => {
  console.log(`\n${item.title} (${item.type}):`);
  console.log(`- Standard: ${item.qrCodes.standard}`);
  console.log(`- Short: ${item.qrCodes.short}`);
  console.log(`- URL Path: ${item.qrCodes.urlPath}`);
  console.log(`- Full URL: ${item.qrCodes.fullUrl}`);
});

export { generateQRCodeFormats, generateAllArtifactQRCodes };
