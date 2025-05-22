#!/bin/bash

# Script to validate image paths in enhanced-artifacts.json
# This script checks that all thumbnail paths in the JSON file point to actual images

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Validating image paths in enhanced-artifacts.json...${NC}"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed. Please install it with 'sudo apt-get install jq'${NC}"
    exit 1
fi

# Path to enhanced-artifacts.json
JSON_FILE="./public/enhanced-artifacts.json"

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo -e "${RED}Error: $JSON_FILE not found${NC}"
    exit 1
fi

# Extract all thumbnail paths from the JSON file
echo -e "${YELLOW}Extracting thumbnail paths from JSON...${NC}"
THUMBNAILS=$(jq -r '.[].thumbnail' "$JSON_FILE")

# Count total thumbnails
TOTAL_COUNT=$(echo "$THUMBNAILS" | wc -l)
VALID_COUNT=0
INVALID_COUNT=0
INVALID_PATHS=()

# Check each thumbnail path
echo -e "${YELLOW}Checking $TOTAL_COUNT thumbnail paths...${NC}"
for thumbnail in $THUMBNAILS; do
    # Remove leading slash to make it relative to the public directory
    relative_path="${thumbnail#/}"
    absolute_path="./public/$relative_path"
    
    if [ -f "$absolute_path" ]; then
        VALID_COUNT=$((VALID_COUNT + 1))
    else
        INVALID_COUNT=$((INVALID_COUNT + 1))
        INVALID_PATHS+=("$thumbnail -> $absolute_path")
    fi
done

# Print results
echo -e "${GREEN}✅ Valid image paths: $VALID_COUNT${NC}"
if [ $INVALID_COUNT -gt 0 ]; then
    echo -e "${RED}❌ Invalid image paths: $INVALID_COUNT${NC}"
    echo -e "${YELLOW}Invalid paths:${NC}"
    for path in "${INVALID_PATHS[@]}"; do
        echo -e "  ${RED}$path${NC}"
    done
    
    # Provide fix options
    echo -e "\n${YELLOW}Would you like to fix these paths? (y/n)${NC}"
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Attempting to fix paths...${NC}"
        # This is a simplified fix - adjust as needed for your specific situation
        for invalid_path in "${INVALID_PATHS[@]}"; do
            original_path=$(echo "$invalid_path" | cut -d ' ' -f 1)
            filename=$(basename "$original_path")
            
            # Check if the file exists with a different case or extension
            possible_file=$(find ./public/images -iname "$filename" | head -n 1)
            
            if [ -n "$possible_file" ]; then
                # Found a matching file
                correct_path="/images/$(basename "$possible_file")"
                echo -e "${GREEN}Found fix for $original_path -> $correct_path${NC}"
                
                # Update the JSON file
                # This assumes the path is unique in the JSON
                sed -i "s|\"thumbnail\": \"$original_path\"|\"thumbnail\": \"$correct_path\"|g" "$JSON_FILE"
            else
                echo -e "${RED}No matching file found for $original_path${NC}"
            fi
        done
        
        echo -e "${GREEN}Fixed paths in $JSON_FILE${NC}"
    fi
else
    echo -e "${GREEN}All image paths are valid!${NC}"
fi