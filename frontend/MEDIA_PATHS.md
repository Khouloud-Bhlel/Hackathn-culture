# Media Path Configuration Guide

This document provides instructions on how to properly set up and configure media paths in the project to ensure that photos and videos display correctly.

## Directory Structure

The project expects media files to be organized in the following directory structure:

```
frontend/
  public/
    images/
      - image1.jpeg
      - image2.jpeg
      ...
    videos/
      - video1.mp4
      - video2.mp4
      ...
    3d_Models/
      - model1.glb
      - model2.glb
      ...
```

## Validating Media Paths

We've provided a utility script to validate all media paths in the project:

```bash
# Navigate to the frontend directory
cd frontend

# Run the validation script
./validate-media-paths.sh
```

This script will:
1. Check all image paths in the enhanced-artifacts.json file
2. Check all video paths and ensure they're correctly mapped to thumbnails
3. Check all 3D model paths
4. Generate a report of any issues found

## Creating Required Directories

If your media directories don't exist, you can create them with:

```bash
# Navigate to the frontend directory
cd frontend

# Run the directory creation script
./create-media-dirs.sh
```

## Media Naming Conventions

For the best results, follow these naming conventions:

### Images (Thumbnails)
- Place all image files in the `public/images/` directory
- Use unique file names with UUID format when possible
- Supported formats: `.jpeg`, `.jpg`, `.png`, `.webp`

### Videos
- Place all video files in the `public/videos/` directory
- Use unique file names with UUID format when possible
- For best video-thumbnail matching, use the same base filename for both:
  - Image: `abc123.jpeg`
  - Video: `abc123.mp4`
- Supported formats: `.mp4`, `.webm`, `.ogg`, `.mov`

### 3D Models
- Place all 3D model files in the `public/3d_Models/` directory
- Supported formats: `.glb`, `.gltf`, `.obj`

## Manual Path Correction

If you need to manually correct paths:

1. Edit the `enhanced-artifacts.json` file in the `public/` directory
2. For video items, ensure the `videoUrl` property points to the correct video file
3. For 3D model items, ensure the `modelUrl` property points to the correct model file
4. For images, ensure the `thumbnail` property has the correct path

## Troubleshooting

If videos or images aren't displaying correctly:

1. Check the browser console for path-related errors
2. Run the validation script to identify issues
3. Ensure all required media directories exist
4. Verify that media filenames match the paths in enhanced-artifacts.json

## Automatic Path Correction

The application includes automatic path correction logic that will attempt to:

1. Fix invalid image paths by checking alternative locations
2. Map thumbnails to videos based on filename patterns
3. Fix 3D model paths by checking alternative locations

This happens automatically when the app loads, but you can also trigger it manually by refreshing the browser.
