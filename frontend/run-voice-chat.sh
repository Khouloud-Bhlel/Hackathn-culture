#!/bin/bash

# Script to run the application with OpenAI API for voice chat
# This script ensures the API key is properly loaded from the .env file

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo -e "${RED}❌ .env file not found. Creating a template...${NC}"
  echo "VITE_OPENAI_API_KEY=your_openai_api_key_here" > .env
  echo -e "${YELLOW}⚠️ Please edit the .env file and add your OpenAI API key${NC}"
  
  # Ask if user wants to update the API key now
  read -p "Do you want to update the API key now? (y/N): " UPDATE_KEY
  if [[ "$UPDATE_KEY" =~ ^[Yy]$ ]]; then
    if [ -f "./update-api-key.sh" ]; then
      ./update-api-key.sh
      # If update-api-key.sh was successful and user chose to continue, return to this script
      if [ $? -eq 0 ]; then
        # Re-export the API key
        export $(grep -v '^#' .env | xargs)
      else
        exit 1
      fi
    else
      echo -e "${RED}❌ update-api-key.sh script not found${NC}"
      exit 1
    fi
  else
    exit 1
  fi
fi

# Export the API key from .env file
export $(grep -v '^#' .env | xargs)

# Validate the API key
if [[ -z "$VITE_OPENAI_API_KEY" || "$VITE_OPENAI_API_KEY" == "your_openai_api_key_here" ]]; then
  echo -e "${RED}❌ Invalid or missing OpenAI API key in .env file${NC}"
  
  # Ask if user wants to update the API key now
  read -p "Do you want to update the API key now? (y/N): " UPDATE_KEY
  if [[ "$UPDATE_KEY" =~ ^[Yy]$ ]]; then
    if [ -f "./update-api-key.sh" ]; then
      ./update-api-key.sh
      # If update-api-key.sh was successful, return to this script
      if [ $? -eq 0 ]; then
        # Re-export the API key
        export $(grep -v '^#' .env | xargs)
      else
        exit 1
      fi
    else
      echo -e "${RED}❌ update-api-key.sh script not found${NC}"
      exit 1
    fi
  else
    exit 1
  fi
fi

# Show API key details (first and last few characters only for security)
echo -e "${GREEN}🔑 OpenAI API key loaded: ${YELLOW}${VITE_OPENAI_API_KEY:0:10}...${VITE_OPENAI_API_KEY: -5}${NC}"
echo -e "${GREEN}✅ API key will be used for voice chat functionality only${NC}"

# Ensure API key is available in the environment
export VITE_OPENAI_API_KEY

# Test the API key
echo -e "${YELLOW}🧪 Testing API key...${NC}"
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
               -H "Authorization: Bearer $VITE_OPENAI_API_KEY" \
               https://api.openai.com/v1/models)

if [ "$RESPONSE_CODE" == "200" ]; then
  echo -e "${GREEN}✅ API key is valid and working!${NC}"
else
  echo -e "${RED}❌ API key test failed (HTTP $RESPONSE_CODE)${NC}"
  echo -e "${YELLOW}⚠️ Voice chat functionality may not work properly${NC}"
  
  # Ask if user wants to update the API key
  read -p "Do you want to update the API key? (y/N): " UPDATE_KEY
  if [[ "$UPDATE_KEY" =~ ^[Yy]$ ]]; then
    if [ -f "./update-api-key.sh" ]; then
      ./update-api-key.sh
      # Return to this script if update was successful
      if [ $? -eq 0 ]; then
        # Re-export the API key
        export $(grep -v '^#' .env | xargs)
      else
        exit 1
      fi
    else
      echo -e "${RED}❌ update-api-key.sh script not found${NC}"
    fi
  else
    read -p "Continue anyway? (y/N): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
fi

# Generate enhanced artifacts data
echo -e "${YELLOW}🚀 Generating enhanced artifacts data...${NC}"
npm run generate-default

# Start the dev server with API key in the environment
echo -e "${GREEN}🚀 Starting development server with voice chat enabled...${NC}"
echo -e "${YELLOW}📢 Check the browser console for API key status logs${NC}"
npm run dev
