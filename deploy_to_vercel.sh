#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Deploy to Vercel with OpenAI API Key    ${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Installing Vercel CLI...${NC}"
  npm install -g vercel
fi

# Check if API key is available in .env file
ENV_FILE="./frontend/.env"
if [ -f "$ENV_FILE" ]; then
  API_KEY=$(grep VITE_OPENAI_API_KEY "$ENV_FILE" | cut -d '=' -f2)
  if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ No API key found in .env file${NC}"
    echo -e "${YELLOW}Please enter your OpenAI API key:${NC}"
    read -r API_KEY
  else
    echo -e "${GREEN}✓ Found API key in .env file${NC}"
  fi
else
  echo -e "${RED}❌ No .env file found${NC}"
  echo -e "${YELLOW}Please enter your OpenAI API key:${NC}"
  read -r API_KEY
fi

# Set up Vercel secret
echo -e "${YELLOW}Adding OpenAI API key as Vercel secret...${NC}"
vercel secret add openai_api_key "$API_KEY"

# Update vercel.json
VERCEL_JSON="./vercel.json"
if [ -f "$VERCEL_JSON" ]; then
  echo -e "${YELLOW}Checking vercel.json configuration...${NC}"
  if grep -q "\"VITE_OPENAI_API_KEY\": \"@openai_api_key\"" "$VERCEL_JSON"; then
    echo -e "${GREEN}✓ vercel.json already configured correctly${NC}"
  else
    echo -e "${YELLOW}Updating vercel.json to use the secret...${NC}"
    # Create a backup
    cp "$VERCEL_JSON" "${VERCEL_JSON}.bak"
    # Use sed to replace the API key configuration
    sed -i 's/"VITE_OPENAI_API_KEY": "[^"]*"/"VITE_OPENAI_API_KEY": "@openai_api_key"/g' "$VERCEL_JSON"
    echo -e "${GREEN}✓ Updated vercel.json${NC}"
  fi
else
  echo -e "${RED}❌ No vercel.json file found${NC}"
  exit 1
fi

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
cd frontend && vercel --prod

echo -e "\n${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}If you encounter any issues, check:${NC}"
echo -e "1. Your OpenAI API key is a standard key (starts with sk-, not sk-proj-)"
echo -e "2. Your OpenAI account has billing set up"
echo -e "3. Your API key has not expired or reached rate limits"
