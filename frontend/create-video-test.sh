#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}          Video Playback Test              ${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if we have videos
VIDEO_DIR="./public/videos"
if [ ! -d "$VIDEO_DIR" ]; then
  echo -e "${RED}Error: Videos directory not found at $VIDEO_DIR${NC}"
  exit 1
fi

VIDEO_COUNT=$(find "$VIDEO_DIR" -type f | wc -l)
echo -e "${GREEN}Found $VIDEO_COUNT videos in $VIDEO_DIR${NC}"

# Check if enhanced-artifacts.json has video entries
ENHANCED_ARTIFACTS="./public/enhanced-artifacts.json"
if [ ! -f "$ENHANCED_ARTIFACTS" ]; then
  echo -e "${RED}Error: enhanced-artifacts.json not found at $ENHANCED_ARTIFACTS${NC}"
  exit 1
fi

# Create video test HTML
TEST_HTML="./public/temp-video-test.html"
echo -e "${YELLOW}Creating video test page at $TEST_HTML${NC}"

cat > "$TEST_HTML" << EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Playback Test</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .video-container { margin-bottom: 40px; border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
    h1, h2 { color: #333; }
    video { max-width: 100%; }
    .status { margin-top: 10px; }
    .success { color: green; }
    .error { color: red; }
    .info { color: blue; }
  </style>
</head>
<body>
  <h1>Video Playback Test</h1>
  <p>This page tests the playback of all videos in your project.</p>
  
  <h2>Videos from enhanced-artifacts.json</h2>
  <div id="enhanced-videos"></div>
  
  <h2>All Videos in Directory</h2>
  <div id="all-videos"></div>
  
  <script>
    // Function to load enhanced artifacts and display videos
    async function loadEnhancedVideos() {
      try {
        const response = await fetch('/enhanced-artifacts.json');
        
        if (response.ok) {
          const artifacts = await response.json();
          const enhancedVideosContainer = document.getElementById('enhanced-videos');
          
          // Filter only video items
          const videoItems = artifacts.filter(item => item.type === 'videos');
          
          if (videoItems.length === 0) {
            enhancedVideosContainer.innerHTML = '<p class="error">No video items found in enhanced-artifacts.json</p>';
            return;
          }
          
          // Create a container for each video
          videoItems.forEach((video, index) => {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            
            const videoTitle = document.createElement('h3');
            videoTitle.textContent = video.title || \`Video \${index + 1}\`;
            
            const videoElement = document.createElement('video');
            videoElement.controls = true;
            videoElement.width = 640;
            videoElement.height = 360;
            videoElement.preload = 'metadata';
            
            // Set poster if thumbnail available
            if (video.thumbnail) {
              videoElement.poster = video.thumbnail;
            }
            
            // Create source element
            const sourceElement = document.createElement('source');
            sourceElement.src = video.videoUrl || '';
            sourceElement.type = 'video/mp4';
            
            videoElement.appendChild(sourceElement);
            
            // Create status div
            const statusDiv = document.createElement('div');
            statusDiv.className = 'status';
            statusDiv.innerHTML = '<p class="info">Loading video...</p>';
            
            // Add event listeners
            videoElement.onloadeddata = () => {
              statusDiv.innerHTML = '<p class="success">✓ Video loaded successfully</p>';
            };
            
            videoElement.onerror = () => {
              statusDiv.innerHTML = \`<p class="error">✗ Error loading video: \${video.videoUrl || 'No URL provided'}</p>\`;
            };
            
            // Add info about the video
            const videoInfo = document.createElement('div');
            videoInfo.innerHTML = \`
              <p><strong>Title:</strong> \${video.title || 'No title'}</p>
              <p><strong>URL:</strong> \${video.videoUrl || 'No URL'}</p>
              <p><strong>Thumbnail:</strong> \${video.thumbnail || 'No thumbnail'}</p>
            \`;
            
            // Assemble container
            videoContainer.appendChild(videoTitle);
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(statusDiv);
            videoContainer.appendChild(videoInfo);
            
            enhancedVideosContainer.appendChild(videoContainer);
          });
          
        } else {
          console.error('Failed to load enhanced-artifacts.json');
          document.getElementById('enhanced-videos').innerHTML = '<p class="error">Failed to load enhanced-artifacts.json</p>';
        }
      } catch (error) {
        console.error('Error:', error);
        document.getElementById('enhanced-videos').innerHTML = '<p class="error">Error loading enhanced videos</p>';
      }
    }
    
    // Function to test all videos in the /videos directory
    function loadAllVideos() {
      const allVideosContainer = document.getElementById('all-videos');
      
      // List of videos from directory (hard-coded for this test page)
      const videos = [
        EOL

# Add all videos from the videos directory
for video_file in "$VIDEO_DIR"/*; do
  if [ -f "$video_file" ]; then
    filename=$(basename "$video_file")
    echo "        '/videos/$filename'," >> "$TEST_HTML"
  fi
done

cat >> "$TEST_HTML" << EOL
      ];
      
      if (videos.length === 0) {
        allVideosContainer.innerHTML = '<p class="error">No videos found in directory</p>';
        return;
      }
      
      videos.forEach((videoUrl, index) => {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        
        const videoTitle = document.createElement('h3');
        videoTitle.textContent = 'Video ' + (index + 1) + ' - ' + videoUrl.split('/').pop();
        
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.width = 640;
        videoElement.height = 360;
        videoElement.preload = 'metadata';
        
        // Create source element
        const sourceElement = document.createElement('source');
        sourceElement.src = videoUrl;
        sourceElement.type = 'video/mp4';
        
        videoElement.appendChild(sourceElement);
        
        // Create status div
        const statusDiv = document.createElement('div');
        statusDiv.className = 'status';
        statusDiv.innerHTML = '<p class="info">Loading video...</p>';
        
        // Add event listeners
        videoElement.onloadeddata = () => {
          statusDiv.innerHTML = '<p class="success">✓ Video loaded successfully</p>';
        };
        
        videoElement.onerror = () => {
          statusDiv.innerHTML = \`<p class="error">✗ Error loading video: \${videoUrl}</p>\`;
        };
        
        // Add info about the video
        const videoInfo = document.createElement('div');
        videoInfo.innerHTML = \`
          <p><strong>URL:</strong> \${videoUrl}</p>
        \`;
        
        // Assemble container
        videoContainer.appendChild(videoTitle);
        videoContainer.appendChild(videoElement);
        videoContainer.appendChild(statusDiv);
        videoContainer.appendChild(videoInfo);
        
        allVideosContainer.appendChild(videoContainer);
      });
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      loadEnhancedVideos();
      loadAllVideos();
    });
  </script>
</body>
</html>
EOL

echo -e "${GREEN}✓ Video test page created${NC}"
echo -e "${YELLOW}To test videos, open: http://localhost:YOUR_PORT/temp-video-test.html${NC}"
echo -e "${YELLOW}If you're running 'npm run dev', the port is typically 5173${NC}"

# If server is running, provide link
if [ -n "$(lsof -i :5173 2>/dev/null)" ]; then
  echo -e "${GREEN}Server detected on port 5173. Open this URL:${NC}"
  echo -e "${BLUE}http://localhost:5173/temp-video-test.html${NC}"
fi
