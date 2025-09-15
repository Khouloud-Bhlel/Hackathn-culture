#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Update OpenAI API Key for Voice Chat    ${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${YELLOW}Please enter your standard OpenAI API key (must start with sk-, NOT sk-proj-):${NC}"
read -r API_KEY

if [[ ! "$API_KEY" == sk-* || "$API_KEY" == sk-proj-* ]]; then
  echo -e "${RED}❌ Error: This does not appear to be a standard API key.${NC}"
  echo -e "${YELLOW}Standard keys start with 'sk-' but not 'sk-proj-'${NC}"
  echo -e "${YELLOW}Do you want to continue anyway? (y/n)${NC}"
  read -r CONTINUE
  if [[ ! "$CONTINUE" == "y" ]]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
  fi
fi

# Update runtime-env.js
RUNTIME_ENV_FILE="./frontend/public/runtime-env.js"
echo -e "${YELLOW}Updating ${RUNTIME_ENV_FILE}...${NC}"

# Create a backup
cp "$RUNTIME_ENV_FILE" "${RUNTIME_ENV_FILE}.bak"
echo -e "${GREEN}✓ Created backup at ${RUNTIME_ENV_FILE}.bak${NC}"

# Update the file
cat > "$RUNTIME_ENV_FILE" << EOL
// This file is generated at build time and injected at runtime
// It allows environment variables to be used after the app is built
window.env = {
  VITE_OPENAI_API_KEY: "${API_KEY}"
};
EOL
echo -e "${GREEN}✓ Updated ${RUNTIME_ENV_FILE}${NC}"

# Update .env file
ENV_FILE="./frontend/.env"
echo -e "${YELLOW}Updating ${ENV_FILE}...${NC}"

# Create a backup
cp "$ENV_FILE" "${ENV_FILE}.bak"
echo -e "${GREEN}✓ Created backup at ${ENV_FILE}.bak${NC}"

# Update the file
echo "VITE_OPENAI_API_KEY=${API_KEY}" > "$ENV_FILE"
echo -e "${GREEN}✓ Updated ${ENV_FILE}${NC}"

echo -e "\n${GREEN}✅ API key has been updated in both files${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Deploy to Vercel using: ${GREEN}vercel --prod${NC}"
echo -e "2. Or test locally with: ${GREEN}cd frontend && npm run dev${NC}"
