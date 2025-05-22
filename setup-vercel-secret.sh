#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Vercel secret for OpenAI API key...${NC}"

# Check if the Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed. Installing it now...${NC}"
    npm install -g vercel
fi

# Extract API key from .env file
if [ -f "./frontend/.env" ]; then
    API_KEY=$(grep VITE_OPENAI_API_KEY ./frontend/.env | cut -d '=' -f2)
    
    if [ -z "$API_KEY" ]; then
        echo -e "${RED}Error: Could not find VITE_OPENAI_API_KEY in .env file${NC}"
        echo -e "${YELLOW}Please enter your OpenAI API key:${NC}"
        read -r API_KEY
    else
        echo -e "${GREEN}Found API key in .env file${NC}"
    fi
else
    echo -e "${YELLOW}No .env file found. Please enter your OpenAI API key:${NC}"
    read -r API_KEY
fi

# Trim any whitespace from API key
API_KEY=$(echo "$API_KEY" | xargs)

if [ -z "$API_KEY" ]; then
    echo -e "${RED}Error: API key cannot be empty${NC}"
    exit 1
fi

echo -e "${YELLOW}Adding 'openai_api_key' secret to Vercel...${NC}"

# Try adding the secret
if vercel secrets add openai_api_key "$API_KEY"; then
    echo -e "${GREEN}✅ Successfully added 'openai_api_key' secret to Vercel${NC}"
    echo -e "${YELLOW}Now you can deploy your project to Vercel using:${NC}"
    echo -e "vercel"
else
    echo -e "${RED}Failed to add secret. Make sure you're logged in to Vercel CLI${NC}"
    echo -e "${YELLOW}Try logging in first with:${NC}"
    echo -e "vercel login"
    exit 1
fi

# Reminder about environment variables
echo -e "\n${YELLOW}Important:${NC}"
echo -e "Make sure your vercel.json has the environment variable configured:"
echo -e "${GREEN}\"env\": {\"VITE_OPENAI_API_KEY\": \"@openai_api_key\"}${NC}"
