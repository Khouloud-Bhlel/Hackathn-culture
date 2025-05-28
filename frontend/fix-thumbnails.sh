#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       Manual Fix for Missing Thumbnails    ${NC}"
echo -e "${BLUE}============================================${NC}"

ARTIFACTS_FILE="./public/enhanced-artifacts.json"
BACKUP_FILE="./public/enhanced-artifacts-manual-backup.json"

# Create a backup first
cp "$ARTIFACTS_FILE" "$BACKUP_FILE"
echo -e "${GREEN}✓ Created backup at $BACKUP_FILE${NC}"

# Fix for sullecthum_mosaic_ostia.jpeg - replace with an existing image
echo -e "${YELLOW}Fixing thumbnail for sullecthum_mosaic_ostia.jpeg...${NC}"
sed -i 's|"/images/sullecthum_mosaic_ostia.jpeg"|"/images/4ed0dd86-c549-40e7-a37a-a39ab2054b62.jpeg"|g' "$ARTIFACTS_FILE"

# Fix for salakta_roman_lamps_2023.jpeg - replace with an existing image
echo -e "${YELLOW}Fixing thumbnail for salakta_roman_lamps_2023.jpeg...${NC}"
sed -i 's|"/images/salakta_roman_lamps_2023.jpeg"|"/images/9f7312d9-2067-4e0d-85d3-04e1db8e4136.jpeg"|g' "$ARTIFACTS_FILE"

# Verify if the changes were made successfully
if grep -q "sullecthum_mosaic_ostia.jpeg\|salakta_roman_lamps_2023.jpeg" "$ARTIFACTS_FILE"; then
  echo -e "${RED}✗ Some replacements failed${NC}"
else
  echo -e "${GREEN}✓ All replacements successful${NC}"
fi

echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Running validation to verify changes...${NC}"
./validate-media-paths-simple.sh
