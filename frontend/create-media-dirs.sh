#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}          Create Media Directories          ${NC}"
echo -e "${BLUE}============================================${NC}"

PUBLIC_DIR="./public"
VIDEOS_DIR="$PUBLIC_DIR/videos"
IMAGES_DIR="$PUBLIC_DIR/images"
MODELS_DIR="$PUBLIC_DIR/3d_Models"

# Function to create directory if it doesn't exist
create_dir_if_not_exists() {
  local dir=$1
  local dir_name=$2
  
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓ ${dir_name} directory exists: ${dir}${NC}"
  else
    echo -e "${YELLOW}Creating ${dir_name} directory: ${dir}${NC}"
    mkdir -p "$dir"
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Successfully created ${dir_name} directory${NC}"
    else
      echo -e "${RED}✗ Failed to create ${dir_name} directory${NC}"
    fi
  fi
}

# Check public directory
if [ -d "$PUBLIC_DIR" ]; then
  echo -e "${GREEN}✓ Public directory exists: $PUBLIC_DIR${NC}"
else
  echo -e "${RED}✗ Public directory not found: $PUBLIC_DIR${NC}"
  echo -e "${YELLOW}Creating public directory${NC}"
  mkdir -p "$PUBLIC_DIR"
fi

# Create videos directory if it doesn't exist
create_dir_if_not_exists "$VIDEOS_DIR" "Videos"

# Create images directory if it doesn't exist
create_dir_if_not_exists "$IMAGES_DIR" "Images"

# Create 3D models directory if it doesn't exist
create_dir_if_not_exists "$MODELS_DIR" "3D Models"

echo -e "${GREEN}Media directories check complete!${NC}"
