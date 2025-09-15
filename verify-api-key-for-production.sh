#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   OpenAI API Key Production Verification   ${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "\n${YELLOW}This script verifies that the OpenAI API key is properly configured for production deployment.${NC}"

# Check if API key is present
if [[ -z "${VITE_OPENAI_API_KEY}" ]]; then
    echo -e "${RED}❌ Error: VITE_OPENAI_API_KEY environment variable is not set.${NC}"
    echo -e "${YELLOW}Please set the VITE_OPENAI_API_KEY environment variable before deploying.${NC}"
    echo -e "${YELLOW}Example: export VITE_OPENAI_API_KEY='sk-your-key'${NC}"
    exit 1
fi

# Extract the first 5 characters to check key type
KEY_PREFIX="${VITE_OPENAI_API_KEY:0:5}"

if [[ "$KEY_PREFIX" == "sk-pr" ]]; then
    echo -e "${RED}❌ Warning: You are using a project-scoped API key (starts with sk-proj-).${NC}"
    echo -e "${RED}   This type of key may not have permission for audio transcription.${NC}"
    echo -e "${YELLOW}   The voice chat feature will likely not work properly.${NC}"
    echo -e "${YELLOW}   Please use a standard API key (starts with sk-) instead.${NC}"
    
    # Ask if user wants to continue anyway
    echo -e "${YELLOW}Do you want to continue with deployment anyway? (y/n)${NC}"
    read -r CONTINUE
    if [[ ! "$CONTINUE" == "y" ]]; then
        echo -e "${RED}Deployment cancelled.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Continuing with deployment using project-scoped key. Voice chat may not work.${NC}"
elif [[ "$KEY_PREFIX" == "sk-" ]]; then
    echo -e "${GREEN}✓ Using a standard OpenAI API key. This should work for all features.${NC}"
else
    echo -e "${RED}❌ Error: Invalid API key format.${NC}"
    echo -e "${YELLOW}The API key should start with 'sk-' for standard keys.${NC}"
    exit 1
fi

echo -e "${GREEN}API key verification completed.${NC}"
echo -e "${YELLOW}Remember to add this API key to your production environment variables.${NC}"
echo -e "${YELLOW}For Vercel, add VITE_OPENAI_API_KEY in the project environment variables.${NC}"

exit 0
