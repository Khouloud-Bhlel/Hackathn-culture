#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BLUE}${BOLD}============================================${NC}"
echo -e "${BLUE}${BOLD}       Media Path Management Utility        ${NC}"
echo -e "${BLUE}${BOLD}============================================${NC}"

PUBLIC_DIR="./public"
ENHANCED_ARTIFACTS="$PUBLIC_DIR/enhanced-artifacts.json"

# Function to show menu
show_menu() {
  echo -e "\n${YELLOW}${BOLD}What would you like to do?${NC}"
  echo -e "${BOLD}1)${NC} Validate all media paths"
  echo -e "${BOLD}2)${NC} Fix media paths automatically"
  echo -e "${BOLD}3)${NC} Create necessary media directories"
  echo -e "${BOLD}4)${NC} Show media file counts"
  echo -e "${BOLD}5)${NC} Show project media structure"
  echo -e "${BOLD}6)${NC} Create backup of enhanced-artifacts.json"
  echo -e "${BOLD}7)${NC} Restore backup of enhanced-artifacts.json"
  echo -e "${BOLD}8)${NC} Exit"
  echo
  read -p "Enter your choice [1-8]: " CHOICE
}

# Function to validate media paths
validate_media_paths() {
  echo -e "\n${BLUE}${BOLD}Validating media paths...${NC}"
  ./validate-media-paths-simple.sh
}

# Function to fix media paths
fix_media_paths() {
  echo -e "\n${BLUE}${BOLD}Fixing media paths...${NC}"
  ./fix-media-paths.sh
}

# Function to create directories
create_directories() {
  echo -e "\n${BLUE}${BOLD}Creating media directories...${NC}"
  ./create-media-dirs.sh
}

# Function to show media counts
show_media_counts() {
  echo -e "\n${BLUE}${BOLD}Media File Counts${NC}"
  echo -e "${YELLOW}------------------------------${NC}"
  
  if [ -d "$PUBLIC_DIR/images" ]; then
    IMAGE_COUNT=$(find "$PUBLIC_DIR/images" -type f | wc -l)
    echo -e "${GREEN}Images:${NC} $IMAGE_COUNT files"
  fi
  
  if [ -d "$PUBLIC_DIR/videos" ]; then
    VIDEO_COUNT=$(find "$PUBLIC_DIR/videos" -type f | wc -l)
    echo -e "${GREEN}Videos:${NC} $VIDEO_COUNT files"
  fi
  
  if [ -d "$PUBLIC_DIR/3d_Models" ]; then
    MODEL_COUNT=$(find "$PUBLIC_DIR/3d_Models" -type f | wc -l)
    echo -e "${GREEN}3D Models:${NC} $MODEL_COUNT files"
  fi
  
  if [ -f "$ENHANCED_ARTIFACTS" ]; then
    ARTIFACT_COUNT=$(grep -c "\"title\":" "$ENHANCED_ARTIFACTS")
    echo -e "${GREEN}Total Artifacts:${NC} $ARTIFACT_COUNT items"
    
    if command -v jq &> /dev/null; then
      IMAGE_ARTIFACTS=$(jq '[.[] | select(.type == "images")] | length' "$ENHANCED_ARTIFACTS")
      VIDEO_ARTIFACTS=$(jq '[.[] | select(.type == "videos")] | length' "$ENHANCED_ARTIFACTS")
      MODEL_ARTIFACTS=$(jq '[.[] | select(.type == "3d")] | length' "$ENHANCED_ARTIFACTS")
      
      echo -e "${GREEN}Image Artifacts:${NC} $IMAGE_ARTIFACTS items"
      echo -e "${GREEN}Video Artifacts:${NC} $VIDEO_ARTIFACTS items"
      echo -e "${GREEN}3D Model Artifacts:${NC} $MODEL_ARTIFACTS items"
    fi
  fi
}

# Function to show file structure
show_structure() {
  echo -e "\n${BLUE}${BOLD}Media Directory Structure${NC}"
  echo -e "${YELLOW}------------------------------${NC}"
  
  echo -e "${GREEN}Images directory:${NC}"
  if [ -d "$PUBLIC_DIR/images" ]; then
    ls -la "$PUBLIC_DIR/images" | head -n 20
    IMAGE_COUNT=$(find "$PUBLIC_DIR/images" -type f | wc -l)
    if [ $IMAGE_COUNT -gt 20 ]; then
      echo -e "... and $((IMAGE_COUNT - 18)) more files"
    fi
  else
    echo "Directory not found!"
  fi
  
  echo -e "\n${GREEN}Videos directory:${NC}"
  if [ -d "$PUBLIC_DIR/videos" ]; then
    ls -la "$PUBLIC_DIR/videos"
  else
    echo "Directory not found!"
  fi
  
  echo -e "\n${GREEN}3D Models directory:${NC}"
  if [ -d "$PUBLIC_DIR/3d_Models" ]; then
    ls -la "$PUBLIC_DIR/3d_Models"
  else
    echo "Directory not found!"
  fi
}

# Function to create backup
create_backup() {
  echo -e "\n${BLUE}${BOLD}Creating backup...${NC}"
  BACKUP_FILE="$PUBLIC_DIR/enhanced-artifacts-backup-$(date +"%Y%m%d-%H%M%S").json"
  
  if [ -f "$ENHANCED_ARTIFACTS" ]; then
    cp "$ENHANCED_ARTIFACTS" "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup created at:${NC} $BACKUP_FILE"
  else
    echo -e "${RED}✗ Error: enhanced-artifacts.json not found${NC}"
  fi
}

# Function to restore backup
restore_backup() {
  echo -e "\n${BLUE}${BOLD}Available backups:${NC}"
  
  # Find all backup files
  BACKUPS=($(find "$PUBLIC_DIR" -name "enhanced-artifacts-backup-*.json" -o -name "enhanced-artifacts-backup.json" | sort -r))
  
  if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}No backups found!${NC}"
    return
  fi
  
  # List all backups
  for i in ${!BACKUPS[@]}; do
    echo -e "${BOLD}$((i+1)))${NC} ${BACKUPS[$i]} ($(date -r ${BACKUPS[$i]} "+%Y-%m-%d %H:%M:%S"))"
  done
  
  echo -e "${BOLD}$((${#BACKUPS[@]}+1)))${NC} Cancel"
  
  # Ask for user choice
  read -p "Which backup would you like to restore? " BACKUP_CHOICE
  
  if [ "$BACKUP_CHOICE" -gt 0 ] && [ "$BACKUP_CHOICE" -le ${#BACKUPS[@]} ]; then
    SELECTED_BACKUP=${BACKUPS[$((BACKUP_CHOICE-1))]}
    
    # Create a backup of the current file first
    CURRENT_BACKUP="$PUBLIC_DIR/enhanced-artifacts-pre-restore-$(date +"%Y%m%d-%H%M%S").json"
    cp "$ENHANCED_ARTIFACTS" "$CURRENT_BACKUP"
    
    # Restore the selected backup
    cp "$SELECTED_BACKUP" "$ENHANCED_ARTIFACTS"
    echo -e "${GREEN}✓ Restored backup:${NC} $SELECTED_BACKUP"
    echo -e "${YELLOW}Current file was backed up to:${NC} $CURRENT_BACKUP"
  elif [ "$BACKUP_CHOICE" -eq $((${#BACKUPS[@]}+1)) ]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
  else
    echo -e "${RED}Invalid choice!${NC}"
  fi
}

# Main loop
while true; do
  show_menu
  
  case $CHOICE in
    1) validate_media_paths ;;
    2) fix_media_paths ;;
    3) create_directories ;;
    4) show_media_counts ;;
    5) show_structure ;;
    6) create_backup ;;
    7) restore_backup ;;
    8) echo -e "${GREEN}Exiting...${NC}"; exit 0 ;;
    *) echo -e "${RED}Invalid choice. Please select a number between 1 and 8.${NC}" ;;
  esac
  
  echo -e "\n${YELLOW}Press Enter to continue...${NC}"
  read
done
