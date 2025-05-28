#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       Simple Media Path Validation        ${NC}"
echo -e "${BLUE}============================================${NC}"

# Define paths
PUBLIC_DIR="./public"
IMAGES_DIR="$PUBLIC_DIR/images"
VIDEOS_DIR="$PUBLIC_DIR/videos"
MODELS_DIR="$PUBLIC_DIR/3d_Models"
ENHANCED_ARTIFACTS="$PUBLIC_DIR/enhanced-artifacts.json"

# Check if the enhanced artifacts file exists
if [ ! -f "$ENHANCED_ARTIFACTS" ]; then
  echo -e "${RED}Error: enhanced-artifacts.json not found at $ENHANCED_ARTIFACTS${NC}"
  exit 1
fi

echo -e "\n${BLUE}Checking directory structure...${NC}"

# Check directories
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓ $2 directory exists: $1${NC}"
    return 0
  else
    echo -e "${RED}✗ $2 directory not found: $1${NC}"
    return 1
  fi
}

check_dir "$PUBLIC_DIR" "Public"
check_dir "$IMAGES_DIR" "Images" 
check_dir "$VIDEOS_DIR" "Videos"
check_dir "$MODELS_DIR" "3D Models"

# Count media files
IMAGE_COUNT=$(find "$IMAGES_DIR" -type f | wc -l)
VIDEO_COUNT=$(find "$VIDEOS_DIR" -type f | wc -l)
MODEL_COUNT=$(find "$MODELS_DIR" -type f | wc -l)

echo -e "\n${BLUE}Media file counts:${NC}"
echo -e "${GREEN}Images: $IMAGE_COUNT files${NC}"
echo -e "${GREEN}Videos: $VIDEO_COUNT files${NC}"
echo -e "${GREEN}3D Models: $MODEL_COUNT files${NC}"

# Extract media paths from enhanced-artifacts.json and check if they exist
echo -e "\n${BLUE}Checking paths from enhanced-artifacts.json...${NC}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo -e "${YELLOW}jq not found. Basic path checking only.${NC}"
  
  # Simple summary of artifacts data
  ARTIFACT_COUNT=$(grep -o "\"title\":" "$ENHANCED_ARTIFACTS" | wc -l)
  echo -e "${GREEN}Found approximately $ARTIFACT_COUNT artifacts in enhanced-artifacts.json${NC}"
else
  # Use jq for detailed validation
  echo -e "${GREEN}Using jq for detailed path validation${NC}"
  
  # Count artifacts by type
  IMAGE_ARTIFACTS=$(jq '[.[] | select(.type == "images")] | length' "$ENHANCED_ARTIFACTS")
  VIDEO_ARTIFACTS=$(jq '[.[] | select(.type == "videos")] | length' "$ENHANCED_ARTIFACTS")
  MODEL_ARTIFACTS=$(jq '[.[] | select(.type == "3d")] | length' "$ENHANCED_ARTIFACTS")
  
  echo -e "${GREEN}Image artifacts: $IMAGE_ARTIFACTS${NC}"
  echo -e "${GREEN}Video artifacts: $VIDEO_ARTIFACTS${NC}"
  echo -e "${GREEN}3D model artifacts: $MODEL_ARTIFACTS${NC}"
  
  # Check thumbnail paths
  echo -e "\n${BLUE}Checking thumbnail paths...${NC}"
  INVALID_THUMBNAILS=0
  while IFS= read -r thumbnail; do
    # Remove quotes and leading slash
    thumbnail=$(echo "$thumbnail" | tr -d '"' | sed 's/^\///')
    if [ ! -f "$PUBLIC_DIR/$thumbnail" ]; then
      echo -e "${RED}✗ Thumbnail not found: $thumbnail${NC}"
      INVALID_THUMBNAILS=$((INVALID_THUMBNAILS + 1))
    fi
  done < <(jq -r '.[].thumbnail' "$ENHANCED_ARTIFACTS")
  
  if [ $INVALID_THUMBNAILS -eq 0 ]; then
    echo -e "${GREEN}✓ All thumbnails found${NC}"
  else
    echo -e "${YELLOW}⚠ $INVALID_THUMBNAILS thumbnails not found${NC}"
  fi
  
  # Check video paths
  echo -e "\n${BLUE}Checking video paths...${NC}"
  INVALID_VIDEOS=0
  VIDEO_URL_COUNT=0
  while IFS= read -r video; do
    if [ "$video" != "null" ]; then
      VIDEO_URL_COUNT=$((VIDEO_URL_COUNT + 1))
      # Remove quotes and leading slash
      video=$(echo "$video" | tr -d '"' | sed 's/^\///')
      if [ ! -f "$PUBLIC_DIR/$video" ]; then
        echo -e "${RED}✗ Video not found: $video${NC}"
        INVALID_VIDEOS=$((INVALID_VIDEOS + 1))
      fi
    fi
  done < <(jq -r '.[].videoUrl // "null"' "$ENHANCED_ARTIFACTS")
  
  if [ $VIDEO_URL_COUNT -eq 0 ]; then
    echo -e "${YELLOW}⚠ No videoUrl properties found in enhanced-artifacts.json${NC}"
  elif [ $INVALID_VIDEOS -eq 0 ]; then
    echo -e "${GREEN}✓ All video paths found${NC}"
  else
    echo -e "${YELLOW}⚠ $INVALID_VIDEOS videos not found${NC}"
  fi
  
  # Check model paths
  echo -e "\n${BLUE}Checking 3D model paths...${NC}"
  INVALID_MODELS=0
  MODEL_URL_COUNT=0
  while IFS= read -r model; do
    if [ "$model" != "null" ]; then
      MODEL_URL_COUNT=$((MODEL_URL_COUNT + 1))
      # Remove quotes and leading slash
      model=$(echo "$model" | tr -d '"' | sed 's/^\///')
      if [ ! -f "$PUBLIC_DIR/$model" ]; then
        echo -e "${RED}✗ 3D model not found: $model${NC}"
        INVALID_MODELS=$((INVALID_MODELS + 1))
      fi
    fi
  done < <(jq -r '.[].modelUrl // "null"' "$ENHANCED_ARTIFACTS")
  
  if [ $MODEL_URL_COUNT -eq 0 ]; then
    echo -e "${YELLOW}⚠ No modelUrl properties found in enhanced-artifacts.json${NC}"
  elif [ $INVALID_MODELS -eq 0 ]; then
    echo -e "${GREEN}✓ All 3D model paths found${NC}"
  else
    echo -e "${YELLOW}⚠ $INVALID_MODELS 3D models not found${NC}"
  fi
fi

# Final report
echo -e "\n${BLUE}Media path validation complete!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Next steps if you have invalid paths:${NC}"
echo -e "1. Update the paths in enhanced-artifacts.json to match your directory structure"
echo -e "2. Ensure all media files are in the correct directories"
echo -e "3. Make sure media filenames match exactly what's referenced in enhanced-artifacts.json"
