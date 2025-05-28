#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       Fix Media Paths in Enhanced JSON     ${NC}"
echo -e "${BLUE}============================================${NC}"

# Run the Node.js script to fix media paths
node ./scripts/fix-media-paths.cjs

# Check if the script was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Media paths have been fixed${NC}"
  
  # Run validation to verify the fixes
  echo -e "\n${YELLOW}Running validation to verify changes...${NC}"
  ./validate-media-paths-simple.sh
else
  echo -e "${RED}✗ Error fixing media paths${NC}"
  exit 1
fi
