#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Verifying OpenAI API Key for Vercel Deployment${NC}"

# Check if an OpenAI API key is provided as an argument
if [ $# -eq 1 ]; then
    API_KEY=$1
# Try to get API key from environment variable
elif [ ! -z "$VITE_OPENAI_API_KEY" ]; then
    API_KEY=$VITE_OPENAI_API_KEY
# Try to get API key from .env file
elif [ -f "./.env" ]; then
    API_KEY=$(grep VITE_OPENAI_API_KEY ./.env | cut -d '=' -f2)
else
    echo -e "${YELLOW}No API key found. Please enter your OpenAI API key:${NC}"
    read -r API_KEY
fi

# Trim any whitespace from API key
API_KEY=$(echo "$API_KEY" | xargs)

if [ -z "$API_KEY" ]; then
    echo -e "${RED}Error: API key cannot be empty${NC}"
    exit 1
fi

echo -e "${YELLOW}Testing OpenAI API key...${NC}"

# Make a simple API call to verify the key works
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}]}' \
    https://api.openai.com/v1/chat/completions)

if [ "$RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✅ API key is valid!${NC}"
    echo -e "${YELLOW}Ready for Vercel deployment.${NC}"
    
    # Provide guidance on next steps
    echo -e "\n${YELLOW}Next steps for deployment:${NC}"
    echo -e "1. Add the API key to Vercel:"
    echo -e "   ${GREEN}./setup-vercel-secret.sh${NC}"
    echo -e "2. Push your code to GitHub"
    echo -e "3. Deploy to Vercel:"
    echo -e "   ${GREEN}vercel${NC}"
    
    exit 0
else
    echo -e "${RED}❌ API key is invalid (HTTP response: $RESPONSE)${NC}"
    echo -e "Please check your OpenAI API key and try again."
    exit 1
fi
