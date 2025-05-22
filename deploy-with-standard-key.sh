#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Deploy with Standard OpenAI API Key     ${NC}"
echo -e "${BLUE}============================================${NC}"

# Prompt for the API key
echo -e "\n${YELLOW}Please enter your standard OpenAI API key (starts with sk-):${NC}"
read -r API_KEY

# Validate the API key format
if [[ ! "$API_KEY" == sk-* ]]; then
    echo -e "${RED}Error: The key doesn't start with 'sk-'. This doesn't appear to be a standard API key.${NC}"
    echo -e "${YELLOW}OpenAI project-scoped keys (sk-proj-*) don't have permission for audio transcription.${NC}"
    echo -e "${YELLOW}You need a standard API key from https://platform.openai.com/api-keys${NC}"
    echo -e "${YELLOW}Do you want to continue anyway? (y/n)${NC}"
    read -r CONTINUE
    if [[ ! "$CONTINUE" == "y" ]]; then
        echo -e "${RED}Deployment cancelled.${NC}"
        exit 1
    fi
fi

# Update the runtime-env.js file
RUNTIME_ENV_FILE="./frontend/public/runtime-env.js"
echo -e "\n${YELLOW}Updating runtime environment file...${NC}"
cat > "$RUNTIME_ENV_FILE" << EOL
// This file is generated at build time and injected at runtime
// It allows environment variables to be used after the app is built
window.env = {
  // Using a standard OpenAI API key for full permissions
  VITE_OPENAI_API_KEY: "${API_KEY}"
};
EOL
echo -e "${GREEN}✓ Updated ${RUNTIME_ENV_FILE} with new API key${NC}"

# Update the .env file
ENV_FILE="./frontend/.env"
echo -e "\n${YELLOW}Updating .env file...${NC}"
cat > "$ENV_FILE" << EOL
# This is a placeholder. In production, use Vercel environment variables.
# For local development only. DO NOT COMMIT THIS FILE WITH REAL VALUES.
VITE_OPENAI_API_KEY=${API_KEY}
EOL
echo -e "${GREEN}✓ Updated ${ENV_FILE} with new API key${NC}"

# Set up Vercel environment
echo -e "\n${YELLOW}Setting up Vercel deployment...${NC}"
echo -e "${YELLOW}Would you like to deploy to Vercel now? (y/n)${NC}"
read -r DEPLOY

if [[ "$DEPLOY" == "y" ]]; then
    # Ensure we're in the right directory
    cd "$(dirname "$0")" || exit 1
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}Vercel CLI is not installed. Installing it now...${NC}"
        npm install -g vercel
    fi
    
    # Add the API key to Vercel environment
    echo -e "${YELLOW}Adding API key to Vercel environment...${NC}"
    vercel env add VITE_OPENAI_API_KEY
    
    # Deploy to Vercel
    echo -e "${YELLOW}Deploying to Vercel...${NC}"
    vercel --prod
    
    echo -e "\n${GREEN}✓ Deployment complete!${NC}"
    echo -e "${YELLOW}Please test your voice chat feature on the new deployment.${NC}"
    echo -e "${YELLOW}If you continue to have issues, please check:${NC}"
    echo -e "${YELLOW}1. Your OpenAI account billing status${NC}"
    echo -e "${YELLOW}2. API key permissions at https://platform.openai.com/account/api-keys${NC}"
else
    echo -e "\n${YELLOW}Skipping Vercel deployment.${NC}"
    echo -e "${YELLOW}You can deploy manually with:${NC}"
    echo -e "${YELLOW}vercel --prod${NC}"
fi
