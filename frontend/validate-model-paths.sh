#!/bin/bash

# Script to validate 3D model paths in enhanced-artifacts.json
# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Validating 3D model paths in enhanced-artifacts.json...${NC}"

# Path to enhanced-artifacts.json
JSON_FILE="./public/enhanced-artifacts.json"

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo -e "${RED}Error: $JSON_FILE not found${NC}"
    exit 1
fi

# Extract all model URLs from the JSON file
echo -e "${YELLOW}Extracting model URLs from JSON...${NC}"
MODEL_URLS=$(grep -o '"modelUrl": "[^"]*"' "$JSON_FILE" | cut -d'"' -f4)

# Count total model URLs
TOTAL_COUNT=$(echo "$MODEL_URLS" | wc -l)
VALID_COUNT=0
INVALID_COUNT=0
INVALID_PATHS=()

# Check each model URL
echo -e "${YELLOW}Checking model paths...${NC}"
while IFS= read -r model_url; do
    # Skip empty lines
    if [ -z "$model_url" ]; then
        continue
    fi
    
    # Remove leading slash to make it relative to the public directory
    relative_path="${model_url#/}"
    absolute_path="./public/$relative_path"
    
    if [ -f "$absolute_path" ]; then
        VALID_COUNT=$((VALID_COUNT + 1))
        echo -e "${GREEN}✅ Valid: $model_url${NC}"
    else
        INVALID_COUNT=$((INVALID_COUNT + 1))
        INVALID_PATHS+=("$model_url -> $absolute_path")
        echo -e "${RED}❌ Invalid: $model_url${NC}"
    fi
done <<< "$MODEL_URLS"

# Print results
echo -e "\n${YELLOW}Summary:${NC}"
echo -e "${GREEN}✅ Valid model paths: $VALID_COUNT${NC}"
if [ $INVALID_COUNT -gt 0 ]; then
    echo -e "${RED}❌ Invalid model paths: $INVALID_COUNT${NC}"
    echo -e "${YELLOW}Invalid paths:${NC}"
    for path in "${INVALID_PATHS[@]}"; do
        echo -e "  ${RED}$path${NC}"
    done
    
    echo -e "\n${YELLOW}Options to fix the invalid paths:${NC}"
    echo "1. Download the missing 3D models to the correct location"
    echo "2. Update the enhanced-artifacts.json file to reference available models"
    echo "3. If you have the models elsewhere, move them to the correct location"
    
    echo -e "\n${YELLOW}Would you like to update the JSON to use only the available model? (y/n)${NC}"
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Updating JSON to use only available model...${NC}"
        # Replace all model URLs with the available one
        AVAILABLE_MODEL="/3d_Models/Ancient_Oil_Lamp_0516193953_texture.glb"
        for invalid_path in "${INVALID_PATHS[@]}"; do
            original_path=$(echo "$invalid_path" | cut -d ' ' -f 1)
            # Update the JSON file
            sed -i "s|\"modelUrl\": \"$original_path\"|\"modelUrl\": \"$AVAILABLE_MODEL\"|g" "$JSON_FILE"
        done
        echo -e "${GREEN}JSON updated to use available model!${NC}"
    fi
else
    echo -e "${GREEN}All model paths are valid!${NC}"
fi
