#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Test OpenAI Voice Transcription API     ${NC}"
echo -e "${BLUE}============================================${NC}"

# Function to check API key type
check_api_key() {
  local API_KEY=$1
  
  if [[ "$API_KEY" == sk-proj-* ]]; then
    echo -e "${RED}⚠️ You're using a project-scoped API key (starts with sk-proj-).${NC}"
    echo -e "${RED}This type of key doesn't have permission for audio transcription.${NC}"
    return 1
  elif [[ "$API_KEY" == sk-* ]]; then
    echo -e "${GREEN}✓ You're using a standard API key (starts with sk-).${NC}"
    return 0
  else
    echo -e "${RED}❌ Invalid API key format or no key provided.${NC}"
    return 2
  fi
}

# Get OpenAI API key from environment or prompt
if [[ -n "$VITE_OPENAI_API_KEY" ]]; then
  API_KEY=$VITE_OPENAI_API_KEY
  echo -e "${YELLOW}Using API key from environment variable.${NC}"
else
  echo -e "${YELLOW}Enter your OpenAI API key:${NC}"
  read -r API_KEY
fi

# Check API key type
check_api_key "$API_KEY"
KEY_TYPE=$?

# Create temporary audio file
TEMP_FILE=$(mktemp --suffix=.mp3)
echo -e "${YELLOW}Creating test audio file...${NC}"

# Generate a simple tone using SoX (if available)
if command -v sox &> /dev/null; then
  sox -n "$TEMP_FILE" synth 2 sine 440
else
  echo -e "${RED}SoX not found. Creating empty audio file instead.${NC}"
  dd if=/dev/zero of="$TEMP_FILE" bs=1k count=10
fi

echo -e "${YELLOW}Testing OpenAI audio transcription API...${NC}"

# Try API call with curl
RESPONSE=$(curl -s -X POST \
  https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@$TEMP_FILE" \
  -F model="whisper-1")

# Check if response contains an error
if [[ "$RESPONSE" == *"error"* ]]; then
  ERROR_MESSAGE=$(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | cut -d '"' -f 4)
  ERROR_TYPE=$(echo "$RESPONSE" | grep -o '"type":"[^"]*"' | cut -d '"' -f 4)
  
  echo -e "${RED}❌ API Test Failed: $ERROR_TYPE${NC}"
  echo -e "${RED}Error Message: $ERROR_MESSAGE${NC}"
  
  if [ $KEY_TYPE -eq 1 ]; then
    echo -e "${YELLOW}============================================${NC}"
    echo -e "${YELLOW}The issue is with your project-scoped API key.${NC}"
    echo -e "${YELLOW}To fix this:${NC}"
    echo -e "${YELLOW}1. Go to https://platform.openai.com/api-keys${NC}"
    echo -e "${YELLOW}2. Create a new SECRET KEY (not project API key)${NC}"
    echo -e "${YELLOW}3. Update your environment variables${NC}"
    echo -e "${YELLOW}============================================${NC}"
  fi
else
  echo -e "${GREEN}✓ API Test Successful!${NC}"
  echo -e "${GREEN}Response: $RESPONSE${NC}"
fi

# Clean up temporary file
rm "$TEMP_FILE"
echo -e "${YELLOW}Cleaned up test audio file.${NC}"
