#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       Media Path Validation Script         ${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if node is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required to run this script.${NC}"
    exit 1
fi

# Check if the validation script exists
if [ ! -f "./scripts/validate-media-paths.js" ]; then
    echo -e "${RED}Error: Media path validation script not found.${NC}"
    echo -e "${YELLOW}Make sure the script exists at ./scripts/validate-media-paths.js${NC}"
    exit 1
fi

# Install required dependencies if needed
echo -e "${YELLOW}Installing required dependencies...${NC}"
npm install chalk node-fetch --save-dev

# Make the script executable
chmod +x ./scripts/validate-media-paths.js

# Run the media path validation script
echo -e "${GREEN}Running media path validation...${NC}"
node ./scripts/validate-media-paths.js

# Return the exit code from the script
exit $?
