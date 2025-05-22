#!/bin/bash

# Display banner
echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║       OpenAI API Key Update Script        ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for .env file
if [ -f ".env" ]; then
  CURRENT_KEY=$(grep "VITE_OPENAI_API_KEY" .env | cut -d '=' -f2)
  echo -e "${BLUE}Current API key:${NC} ${YELLOW}${CURRENT_KEY:0:10}...${CURRENT_KEY: -5}${NC}"
  
  # Validate current key
  echo -e "\n${BLUE}Testing current API key...${NC}"
  RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
                   -H "Authorization: Bearer $CURRENT_KEY" \
                   https://api.openai.com/v1/models)
  
  if [ "$RESPONSE_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Current API key is valid!${NC}"
    read -p "Do you still want to update it? (y/N): " SHOULD_UPDATE
    if [[ ! "$SHOULD_UPDATE" =~ ^[Yy]$ ]]; then
      echo -e "${GREEN}Keeping existing API key. No changes made.${NC}"
      exit 0
    fi
  else
    echo -e "${RED}❌ Current API key is invalid (HTTP $RESPONSE_CODE)${NC}"
    echo -e "${YELLOW}You need to update your API key.${NC}"
  fi
else
  echo -e "${YELLOW}No .env file found. Creating one now...${NC}"
  touch .env
fi

# Instructions for getting an API key
echo -e "\n${BLUE}To get a new OpenAI API key:${NC}"
echo -e "1. Go to ${YELLOW}https://platform.openai.com/api-keys${NC}"
echo -e "2. Sign in to your OpenAI account"
echo -e "3. Click 'Create new secret key'"
echo -e "4. Copy the key (you won't be able to see it again)\n"

# Prompt for new API key
echo -e "${BLUE}Enter your new OpenAI API key:${NC}"
read -r NEW_API_KEY

# Validate input
if [[ ! "$NEW_API_KEY" =~ ^sk-[a-zA-Z0-9]{20,}$ ]]; then
  echo -e "${RED}⚠️ The API key format looks incorrect.${NC}"
  echo -e "${YELLOW}API keys typically start with 'sk-' followed by a long string.${NC}"
  read -p "Do you want to continue anyway? (y/N): " CONTINUE
  if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo -e "${RED}API key update cancelled.${NC}"
    exit 1
  fi
fi

# Update the .env file
if grep -q "VITE_OPENAI_API_KEY" .env; then
  # Replace existing key
  sed -i "s/VITE_OPENAI_API_KEY=.*/VITE_OPENAI_API_KEY=$NEW_API_KEY/" .env
else
  # Add new key
  echo "VITE_OPENAI_API_KEY=$NEW_API_KEY" >> .env
fi

echo -e "\n${GREEN}✅ API key has been updated in .env file!${NC}"

# Test the new key
echo -e "\n${BLUE}Testing new API key...${NC}"
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
               -H "Authorization: Bearer $NEW_API_KEY" \
               https://api.openai.com/v1/models)

if [ "$RESPONSE_CODE" == "200" ]; then
  echo -e "${GREEN}✅ New API key is valid and working!${NC}"
  echo -e "\n${BLUE}What would you like to do next?${NC}"
  echo -e "1. Run the application with voice chat"
  echo -e "2. Exit"
  read -p "Enter your choice (1-2): " CHOICE
  
  if [ "$CHOICE" == "1" ]; then
    echo -e "${GREEN}Starting application with new API key...${NC}"
    ./run-voice-chat.sh
  else
    echo -e "${GREEN}API key updated successfully. You can now run the application.${NC}"
  fi
else
  echo -e "${RED}❌ New API key test failed (HTTP $RESPONSE_CODE)${NC}"
  echo -e "${YELLOW}There might be an issue with the API key or OpenAI's services.${NC}"
  echo -e "${YELLOW}Please check the key and try again.${NC}"
fi
