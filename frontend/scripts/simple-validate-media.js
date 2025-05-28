#!/usr/bin/env node

/**
 * Simple Media Path Validator
 * This script checks for the existence of media files referenced in the enhanced-artifacts.json
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Define colors for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Define base paths
const BASE_PATH = process.cwd();
const PUBLIC_PATH = path.join(BASE_PATH, 'public');
const ENHANCED_ARTIFACTS_PATH = path.join(PUBLIC_PATH, 'enhanced-artifacts.json');

console.log(`${colors.blue}============================================${colors.reset}`);
console.log(`${colors.blue}       Media Path Validation (Simple)       ${colors.reset}`);
console.log(`${colors.blue}============================================${colors.reset}`);

// Check if enhanced-artifacts.json exists
if (!fs.existsSync(ENHANCED_ARTIFACTS_PATH)) {
  console.error(`${colors.red}Error: enhanced-artifacts.json not found at ${ENHANCED_ARTIFACTS_PATH}${colors.reset}`);
  process.exit(1);
}

// Read the enhanced artifacts data
let artifacts;
try {
  const artifactsData = fs.readFileSync(ENHANCED_ARTIFACTS_PATH, 'utf8');
  artifacts = JSON.parse(artifactsData);
  console.log(`${colors.green}✓ Successfully loaded enhanced-artifacts.json${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error parsing enhanced-artifacts.json: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Check media directories
const checkDirectory = (dirPath, name) => {
  if (fs.existsSync(dirPath)) {
    console.log(`${colors.green}✓ ${name} directory exists${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}✗ ${name} directory not found: ${dirPath}${colors.reset}`);
    return false;
  }
};

// Check if a file exists
const fileExists = (filePath) => {
  if (!filePath) return false;
  
  // Remove leading slash if present
  const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const absolutePath = path.join(PUBLIC_PATH, cleanedPath);
  
  return fs.existsSync(absolutePath);
};

// Check images directory
const imagesDir = path.join(PUBLIC_PATH, 'images');
checkDirectory(imagesDir, 'Images');

// Check videos directory
const videosDir = path.join(PUBLIC_PATH, 'videos');
checkDirectory(videosDir, 'Videos');

// Check 3D models directory
const modelsDir = path.join(PUBLIC_PATH, '3d_Models');
checkDirectory(modelsDir, 'Models');

// Validation summary
let imagesCount = 0;
let imagesValid = 0;
let videosCount = 0;
let videosValid = 0;
let modelsCount = 0;
let modelsValid = 0;

// Check all artifacts
console.log(`\n${colors.blue}Checking media paths...${colors.reset}`);
artifacts.forEach((item, index) => {
  // Check thumbnail path
  if (item.thumbnail) {
    imagesCount++;
    const thumbnailExists = fileExists(item.thumbnail);
    if (thumbnailExists) {
      imagesValid++;
    } else {
      console.log(`${colors.yellow}Image not found (${index}): ${item.thumbnail} - ${item.title}${colors.reset}`);
    }
  }
  
  // Check video path for video items
  if (item.type === 'videos') {
    videosCount++;
    if (item.videoUrl) {
      const videoExists = fileExists(item.videoUrl);
      if (videoExists) {
        videosValid++;
      } else {
        console.log(`${colors.yellow}Video not found: ${item.videoUrl} - ${item.title}${colors.reset}`);
      }
    } else {
      console.log(`${colors.yellow}Missing videoUrl for: ${item.title}${colors.reset}`);
    }
  }
  
  // Check model path for 3D items
  if (item.type === '3d' && item.modelUrl) {
    modelsCount++;
    const modelExists = fileExists(item.modelUrl);
    if (modelExists) {
      modelsValid++;
    } else {
      console.log(`${colors.yellow}3D model not found: ${item.modelUrl} - ${item.title}${colors.reset}`);
    }
  }
});

// Print summary
console.log(`\n${colors.blue}Summary:${colors.reset}`);
console.log(`${colors.green}Images: ${imagesValid}/${imagesCount} valid${colors.reset}`);
console.log(`${colors.green}Videos: ${videosValid}/${videosCount} valid${colors.reset}`);
console.log(`${colors.green}3D Models: ${modelsValid}/${modelsCount} valid${colors.reset}`);

// Provide suggestions if there are invalid paths
if (imagesValid < imagesCount || videosValid < videosCount || modelsValid < modelsCount) {
  console.log(`\n${colors.blue}Suggestions:${colors.reset}`);
  console.log(`1. Ensure all media files are in the correct directories (images/, videos/, 3d_Models/)`);
  console.log(`2. Check filenames for typos`);
  console.log(`3. Update enhanced-artifacts.json with correct paths`);
  console.log(`4. Run ./create-media-dirs.sh to ensure all directories exist`);
}

// Exit with success code if everything passed
const allPassed = imagesValid === imagesCount && videosValid === videosCount && modelsValid === modelsCount;
console.log(`\n${allPassed ? colors.green + '✓ All media paths are valid!' : colors.yellow + '⚠ Some media paths are invalid!'}${colors.reset}`);
