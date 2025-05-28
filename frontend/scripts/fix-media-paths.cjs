/**
 * Fix Media Paths in enhanced-artifacts.json
 * This script is in CommonJS format for compatibility
 */

const fs = require('fs');
const path = require('path');
const process = require('process');

// Define color constants for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Define base paths
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');
const MODELS_DIR = path.join(PUBLIC_DIR, '3d_Models');
const ENHANCED_ARTIFACTS_PATH = path.join(PUBLIC_DIR, 'enhanced-artifacts.json');
const BACKUP_PATH = path.join(PUBLIC_DIR, 'enhanced-artifacts-backup.json');

console.log(`${colors.blue}============================================${colors.reset}`);
console.log(`${colors.blue}       Fixing Media Paths in JSON          ${colors.reset}`);
console.log(`${colors.blue}============================================${colors.reset}`);

// Check if the enhanced artifacts file exists
if (!fs.existsSync(ENHANCED_ARTIFACTS_PATH)) {
  console.error(`${colors.red}Error: enhanced-artifacts.json not found at ${ENHANCED_ARTIFACTS_PATH}${colors.reset}`);
  process.exit(1);
}

// Create a backup of the original file
try {
  fs.copyFileSync(ENHANCED_ARTIFACTS_PATH, BACKUP_PATH);
  console.log(`${colors.green}✓ Created backup at ${BACKUP_PATH}${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error creating backup: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Read and parse the enhanced artifacts file
let artifacts;
try {
  artifacts = JSON.parse(fs.readFileSync(ENHANCED_ARTIFACTS_PATH, 'utf8'));
  console.log(`${colors.green}✓ Successfully loaded enhanced-artifacts.json with ${artifacts.length} items${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error parsing enhanced-artifacts.json: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Get available media files
const getAvailableFiles = (dir) => {
  try {
    return fs.readdirSync(dir).filter(file => {
      // Exclude directories
      const stats = fs.statSync(path.join(dir, file));
      return stats.isFile();
    });
  } catch (error) {
    console.error(`${colors.red}Error reading directory ${dir}: ${error.message}${colors.reset}`);
    return [];
  }
};

// Get lists of available media files
const imageFiles = getAvailableFiles(IMAGES_DIR);
const videoFiles = getAvailableFiles(VIDEOS_DIR);
const modelFiles = getAvailableFiles(MODELS_DIR);

console.log(`${colors.blue}Found ${imageFiles.length} image files, ${videoFiles.length} video files, and ${modelFiles.length} model files${colors.reset}`);

// Function to check if a file exists in the public directory
const fileExists = (relativePath) => {
  if (!relativePath) return false;
  
  const cleanedPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  const absolutePath = path.join(PUBLIC_DIR, cleanedPath);
  
  return fs.existsSync(absolutePath);
};

// Function to get the filename from a path
const getFilename = (filePath) => {
  return filePath ? path.basename(filePath) : '';
};

// Function to find a matching file in the directory
const findMatchingFile = (filename, fileList) => {
  // Try exact match first
  const exactMatch = fileList.find(file => file === filename);
  if (exactMatch) return exactMatch;
  
  // Try case-insensitive match
  const lowerFilename = filename.toLowerCase();
  const caseMatch = fileList.find(file => file.toLowerCase() === lowerFilename);
  if (caseMatch) return caseMatch;
  
  // Try match without extension
  const nameWithoutExt = filename.split('.')[0];
  const extMatch = fileList.find(file => file.split('.')[0] === nameWithoutExt);
  if (extMatch) return extMatch;
  
  // Try partial match
  const partialMatch = fileList.find(file => file.includes(nameWithoutExt) || nameWithoutExt.includes(file.split('.')[0]));
  if (partialMatch) return partialMatch;
  
  return null;
};

// Summary counters
let thumbnailsFixed = 0;
let videosFixed = 0;
let modelsFixed = 0;
let videoUrlsAdded = 0;

// Fix paths in the artifacts array
const updatedArtifacts = artifacts.map((item, index) => {
  const updatedItem = { ...item };
  
  // Fix thumbnail path
  if (item.thumbnail && !fileExists(item.thumbnail)) {
    const currentFilename = getFilename(item.thumbnail);
    const matchingImage = findMatchingFile(currentFilename, imageFiles);
    
    if (matchingImage) {
      updatedItem.thumbnail = `/images/${matchingImage}`;
      console.log(`${colors.green}Fixed thumbnail: ${item.thumbnail} → ${updatedItem.thumbnail}${colors.reset}`);
      thumbnailsFixed++;
    } else {
      console.log(`${colors.yellow}Could not find a match for thumbnail: ${item.thumbnail}${colors.reset}`);
    }
  }
  
  // Fix model path
  if (item.type === '3d' && item.modelUrl && !fileExists(item.modelUrl)) {
    const currentFilename = getFilename(item.modelUrl);
    const matchingModel = findMatchingFile(currentFilename, modelFiles);
    
    if (matchingModel) {
      updatedItem.modelUrl = `/3d_Models/${matchingModel}`;
      console.log(`${colors.green}Fixed model path: ${item.modelUrl} → ${updatedItem.modelUrl}${colors.reset}`);
      modelsFixed++;
    } else if (modelFiles.length > 0) {
      updatedItem.modelUrl = `/3d_Models/${modelFiles[0]}`;
      console.log(`${colors.yellow}Using default model for: ${item.title} → ${updatedItem.modelUrl}${colors.reset}`);
      modelsFixed++;
    } else {
      console.log(`${colors.yellow}Could not find a match for model: ${item.modelUrl}${colors.reset}`);
    }
  }
  
  // Add or fix video URLs for video type items
  if (item.type === 'videos') {
    if (!item.videoUrl) {
      // Try to match a video based on the thumbnail filename
      const thumbnailFilename = getFilename(item.thumbnail);
      const thumbnailBaseName = thumbnailFilename.split('.')[0];
      const matchingVideo = videoFiles.find(file => 
        file.includes(thumbnailBaseName) || thumbnailBaseName.includes(file.split('.')[0])
      );
      
      if (matchingVideo) {
        updatedItem.videoUrl = `/videos/${matchingVideo}`;
        console.log(`${colors.green}Added video URL: ${updatedItem.videoUrl} for ${item.title}${colors.reset}`);
        videoUrlsAdded++;
      } else {
        // If no match by name, just use the first available video as a fallback
        if (videoFiles.length > 0) {
          const randomIndex = index % videoFiles.length;
          updatedItem.videoUrl = `/videos/${videoFiles[randomIndex]}`;
          console.log(`${colors.yellow}Added fallback video URL: ${updatedItem.videoUrl} for ${item.title}${colors.reset}`);
          videoUrlsAdded++;
        }
      }
    } else if (!fileExists(item.videoUrl)) {
      const currentFilename = getFilename(item.videoUrl);
      const matchingVideo = findMatchingFile(currentFilename, videoFiles);
      
      if (matchingVideo) {
        updatedItem.videoUrl = `/videos/${matchingVideo}`;
        console.log(`${colors.green}Fixed video URL: ${item.videoUrl} → ${updatedItem.videoUrl}${colors.reset}`);
        videosFixed++;
      } else {
        console.log(`${colors.yellow}Could not find a match for video: ${item.videoUrl}${colors.reset}`);
      }
    }
  }
  
  return updatedItem;
});

// Write the updated artifacts back to the file
try {
  fs.writeFileSync(ENHANCED_ARTIFACTS_PATH, JSON.stringify(updatedArtifacts, null, 2));
  console.log(`${colors.green}✓ Successfully wrote updated artifacts to ${ENHANCED_ARTIFACTS_PATH}${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Error writing to enhanced-artifacts.json: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Print summary
console.log(`${colors.blue}============================================${colors.reset}`);
console.log(`${colors.blue}               Summary                      ${colors.reset}`);
console.log(`${colors.blue}============================================${colors.reset}`);
console.log(`${colors.green}Thumbnails fixed: ${thumbnailsFixed}${colors.reset}`);
console.log(`${colors.green}Video URLs fixed: ${videosFixed}${colors.reset}`);
console.log(`${colors.green}Video URLs added: ${videoUrlsAdded}${colors.reset}`);
console.log(`${colors.green}Model paths fixed: ${modelsFixed}${colors.reset}`);

if (thumbnailsFixed === 0 && videosFixed === 0 && modelsFixed === 0 && videoUrlsAdded === 0) {
  console.log(`${colors.green}No paths needed fixing!${colors.reset}`);
} else {
  console.log(`${colors.green}Path fixes complete! Please validate the changes.${colors.reset}`);
}
