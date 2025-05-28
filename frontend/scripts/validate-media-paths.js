#!/usr/bin/env node

/**
 * Media Path Validation Script
 * This script checks all media paths in the project to ensure they are valid
 * and helps identify any issues with image or video paths.
 * 
 * Run with: node validate-media-paths.js
 */

// Import required modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
import chalk from 'chalk';

// Set up __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define base directories
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');
const MODELS_DIR = path.join(PUBLIC_DIR, '3d_Models');
const ENHANCED_ARTIFACTS_PATH = path.join(PUBLIC_DIR, 'enhanced-artifacts.json');

// Utility function to check if a file exists
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

// Utility function to validate a media path
async function validateMediaPath(relativePath, type = 'unknown') {
  // Handle absolute paths
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  const absolutePath = path.join(process.cwd(), 'public', cleanPath);
  
  const exists = await fileExists(absolutePath);
  
  if (!exists) {
    console.log(chalk.red(`❌ ${type.toUpperCase()} not found: ${relativePath}`));
    return false;
  }
  
  return true;
}

// Check image paths from enhanced artifacts
async function checkEnhancedArtifacts() {
  console.log(chalk.blue('\nChecking enhanced artifacts media paths...'));
  
  try {
    // Read enhanced artifacts file
    const enhancedArtifactsExists = await fileExists(ENHANCED_ARTIFACTS_PATH);
    
    if (!enhancedArtifactsExists) {
      console.log(chalk.yellow('⚠️ Enhanced artifacts file not found at: public/enhanced-artifacts.json'));
      return;
    }
    
    const enhancedArtifactsData = await fs.promises.readFile(ENHANCED_ARTIFACTS_PATH, 'utf8');
    const enhancedArtifacts = JSON.parse(enhancedArtifactsData);
    
    console.log(chalk.green(`Found ${enhancedArtifacts.length} artifacts in enhanced-artifacts.json`));
    
    let validImages = 0;
    let invalidImages = 0;
    let validVideos = 0;
    let invalidVideos = 0;
    let validModels = 0;
    let invalidModels = 0;
    
    // Check each artifact
    for (const artifact of enhancedArtifacts) {
      // Check thumbnail path
      if (artifact.thumbnail) {
        const thumbnailValid = await validateMediaPath(artifact.thumbnail, 'image');
        if (thumbnailValid) {
          validImages++;
        } else {
          invalidImages++;
          console.log(`  - ${chalk.yellow('Missing thumbnail for:')} ${chalk.cyan(artifact.title)}`);
        }
      }
      
      // Check video paths
      if (artifact.type === 'videos' && artifact.videoUrl) {
        const videoValid = await validateMediaPath(artifact.videoUrl, 'video');
        if (videoValid) {
          validVideos++;
        } else {
          invalidVideos++;
          console.log(`  - ${chalk.yellow('Missing video for:')} ${chalk.cyan(artifact.title)}`);
          console.log(`    ${chalk.yellow('Video path:')} ${artifact.videoUrl}`);
          console.log(`    ${chalk.yellow('Thumbnail:')} ${artifact.thumbnail}`);
        }
      }
      
      // Check 3D model paths
      if (artifact.type === '3d' && artifact.modelUrl) {
        const modelValid = await validateMediaPath(artifact.modelUrl, '3D model');
        if (modelValid) {
          validModels++;
        } else {
          invalidModels++;
          console.log(`  - ${chalk.yellow('Missing 3D model for:')} ${chalk.cyan(artifact.title)}`);
          console.log(`    ${chalk.yellow('Model path:')} ${artifact.modelUrl}`);
        }
      }
    }
    
    // Print summary
    console.log(chalk.blue('\nMedia Validation Summary:'));
    console.log(chalk.green(`✅ Valid images: ${validImages}`));
    console.log(chalk.red(`❌ Invalid images: ${invalidImages}`));
    console.log(chalk.green(`✅ Valid videos: ${validVideos}`));
    console.log(chalk.red(`❌ Invalid videos: ${invalidVideos}`));
    console.log(chalk.green(`✅ Valid 3D models: ${validModels}`));
    console.log(chalk.red(`❌ Invalid 3D models: ${invalidModels}`));
    
  } catch (error) {
    console.error(chalk.red('Error checking enhanced artifacts:'), error);
  }
}

// Check video paths from the thumbnails
async function checkVideoThumbnailMappings() {
  console.log(chalk.blue('\nChecking video thumbnail mappings...'));
  
  try {
    // Read all files in the images directory
    const imageFiles = await fs.promises.readdir(IMAGES_DIR);
    // Read all files in the videos directory
    const videoFiles = await fs.promises.readdir(VIDEOS_DIR);
    
    console.log(chalk.green(`Found ${imageFiles.length} images and ${videoFiles.length} videos`));
    
    let possibleMatches = 0;
    
    // Check for potential matches between image and video files
    for (const imageFile of imageFiles) {
      const imageBaseName = path.basename(imageFile, path.extname(imageFile));
      
      // Check if there's a video with the same name
      for (const videoFile of videoFiles) {
        const videoBaseName = path.basename(videoFile, path.extname(videoFile));
        
        if (imageBaseName === videoBaseName) {
          possibleMatches++;
          console.log(chalk.green(`✅ Found matching pair:`));
          console.log(`  - Image: ${imageFile}`);
          console.log(`  - Video: ${videoFile}`);
        }
      }
    }
    
    console.log(chalk.blue(`\nFound ${possibleMatches} direct thumbnail-to-video matches`));
    
    // Suggestions for improving mappings
    if (possibleMatches < videoFiles.length) {
      console.log(chalk.yellow('\nSuggestions to improve video mappings:'));
      console.log('1. Create thumbnails with the same base filename as videos');
      console.log('2. Update the getVideoForThumbnail function with explicit mappings');
      console.log('3. Consider using a consistent naming convention for thumbnails and videos');
    }
    
  } catch (error) {
    console.error(chalk.red('Error checking video thumbnail mappings:'), error);
  }
}

// Run validations
async function runValidations() {
  console.log(chalk.blue('Starting media path validation...'));
  
  await checkEnhancedArtifacts();
  await checkVideoThumbnailMappings();
  
  console.log(chalk.green('\nMedia path validation complete!'));
}

runValidations().catch(error => {
  console.error(chalk.red('Error running validations:'), error);
  process.exit(1);
});
