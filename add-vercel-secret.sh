#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}      Add OpenAI API Key to Vercel         ${NC}"
echo -e "${BLUE}============================================${NC}"

# Step 1: Check if Vercel CLI is installed
echo -e "\n${YELLOW}Step 1: Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}❌ Vercel CLI not found. Please install it first:${NC}"
  echo -e "   npm install -g vercel"
  exit 1
else
  echo -e "${GREEN}✓ Vercel CLI is installed${NC}"
fi

# Step 2: Get OpenAI API key
echo -e "\n${YELLOW}Step 2: Enter your OpenAI API key${NC}"
echo -e "${YELLOW}This must be a standard API key that starts with 'sk-' (not 'sk-proj-')${NC}"
echo -e "${YELLOW}You can create one at: https://platform.openai.com/api-keys${NC}"
read -p "API key: " API_KEY

if [[ ! "$API_KEY" == sk-* || "$API_KEY" == sk-proj-* ]]; then
  echo -e "${RED}⚠️ Warning: This doesn't look like a standard OpenAI API key${NC}"
  echo -e "${YELLOW}Standard keys start with 'sk-' but not 'sk-proj-'${NC}"
  read -p "Continue anyway? (y/N): " CONTINUE
  if [[ ! "$CONTINUE" == "y" ]]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
  fi
fi

# Step 3: Log in to Vercel if needed
echo -e "\n${YELLOW}Step 3: Verifying Vercel authentication...${NC}"
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}You need to log in to Vercel first${NC}"
  vercel login
fi

# Step 4: Add the secret to Vercel
echo -e "\n${YELLOW}Step 4: Adding OpenAI API Key as a Vercel secret...${NC}"
echo -e "${YELLOW}Adding secret: openai_api_key${NC}"

vercel secrets add openai_api_key "$API_KEY"

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ Success! The OpenAI API key has been added to your Vercel secrets.${NC}"
  echo -e "${GREEN}The secret is named 'openai_api_key' and can be referenced as @openai_api_key in your vercel.json file.${NC}"
else
  echo -e "\n${RED}❌ Failed to add the secret to Vercel.${NC}"
  echo -e "${YELLOW}Try adding it manually with:${NC}"
  echo -e "   vercel secrets add openai_api_key \"YOUR_API_KEY\""
fi
