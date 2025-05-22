#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Fix OpenAI Voice Transcription 401 Error ${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "\n${YELLOW}This script will help you fix the 401 Unauthorized error with OpenAI's voice transcription API.${NC}"
echo -e "${YELLOW}The issue is with your project-scoped API key (starting with sk-proj-) which may not have${NC}"
echo -e "${YELLOW}permission to use the audio transcription and speech synthesis endpoints.${NC}"

# Function to check if a file exists
file_exists() {
    [ -f "$1" ]
}

# STEP 1: Check current API key
echo -e "\n${YELLOW}STEP 1: Checking current API key...${NC}"

RUNTIME_ENV_FILE="./frontend/public/runtime-env.js"
if file_exists "$RUNTIME_ENV_FILE"; then
    echo -e "${GREEN}Found runtime-env.js file${NC}"
    # Extract API key from runtime-env.js
    API_KEY=$(grep -o 'VITE_OPENAI_API_KEY: "[^"]*"' "$RUNTIME_ENV_FILE" | sed 's/VITE_OPENAI_API_KEY: "//;s/"$//')
    
    if [[ "$API_KEY" == sk-proj-* ]]; then
        echo -e "${YELLOW}⚠️ Current API key is a project-scoped key (starts with sk-proj-).${NC}"
        echo -e "${YELLOW}This type of key has limited permissions and may not work with audio APIs.${NC}"
    elif [[ "$API_KEY" == sk-* ]]; then
        echo -e "${GREEN}✓ Current API key is a standard key (starts with sk-).${NC}"
        echo -e "${YELLOW}If you're still experiencing 401 errors, the key might be invalid or expired.${NC}"
    else
        echo -e "${RED}❌ Could not determine API key type or no key found.${NC}"
    fi
else
    echo -e "${RED}❌ Could not find runtime-env.js file${NC}"
    API_KEY=""
fi

# STEP 2: Get a new API key
echo -e "\n${YELLOW}STEP 2: Get a new API key${NC}"
echo -e "${YELLOW}You need a standard OpenAI API key (starting with sk-).${NC}"
echo -e "${YELLOW}You can generate one at: https://platform.openai.com/api-keys${NC}"
echo -e "${YELLOW}Do you have a standard OpenAI API key to use? (y/n)${NC}"
read -r HAVE_KEY

if [[ "$HAVE_KEY" == "y" ]]; then
    echo -e "${YELLOW}Please enter your standard OpenAI API key (should start with sk-):${NC}"
    read -r NEW_API_KEY
    
    if [[ ! "$NEW_API_KEY" == sk-* ]]; then
        echo -e "${RED}❌ The key you entered doesn't start with 'sk-'. This might not be a standard API key.${NC}"
        echo -e "${YELLOW}Do you want to continue anyway? (y/n)${NC}"
        read -r CONTINUE
        if [[ ! "$CONTINUE" == "y" ]]; then
            echo -e "${RED}Operation cancelled.${NC}"
            exit 1
        fi
    fi
    
    # STEP 3: Update runtime-env.js
    echo -e "\n${YELLOW}STEP 3: Updating runtime environment...${NC}"
    
    if file_exists "$RUNTIME_ENV_FILE"; then
        # Create a backup
        cp "$RUNTIME_ENV_FILE" "${RUNTIME_ENV_FILE}.bak"
        echo -e "${GREEN}✓ Created backup of runtime-env.js${NC}"
        
        # Update the file
        cat > "$RUNTIME_ENV_FILE" << EOL
// This file is generated at build time and injected at runtime
// It allows environment variables to be used after the app is built
window.env = {
  VITE_OPENAI_API_KEY: "${NEW_API_KEY}"
};
EOL
        echo -e "${GREEN}✓ Updated runtime-env.js with new API key${NC}"
    else
        echo -e "${RED}❌ Could not find runtime-env.js file to update${NC}"
        # Try to create the directory if it doesn't exist
        mkdir -p "./frontend/public"
        
        # Create the file
        cat > "$RUNTIME_ENV_FILE" << EOL
// This file is generated at build time and injected at runtime
// It allows environment variables to be used after the app is built
window.env = {
  VITE_OPENAI_API_KEY: "${NEW_API_KEY}"
};
EOL
        echo -e "${GREEN}✓ Created new runtime-env.js with API key${NC}"
    fi
    
    # STEP 4: Update .env file if it exists
    ENV_FILE="./frontend/.env"
    if file_exists "$ENV_FILE"; then
        # Create a backup
        cp "$ENV_FILE" "${ENV_FILE}.bak"
        echo -e "${GREEN}✓ Created backup of .env file${NC}"
        
        # Check if VITE_OPENAI_API_KEY already exists in the file
        if grep -q "VITE_OPENAI_API_KEY" "$ENV_FILE"; then
            # Replace the existing line
            sed -i "s/VITE_OPENAI_API_KEY=.*/VITE_OPENAI_API_KEY=${NEW_API_KEY}/" "$ENV_FILE"
        else
            # Append to the file
            echo "VITE_OPENAI_API_KEY=${NEW_API_KEY}" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✓ Updated .env file with new API key${NC}"
    else
        # Create .env file
        echo "VITE_OPENAI_API_KEY=${NEW_API_KEY}" > "$ENV_FILE"
        echo -e "${GREEN}✓ Created new .env file with API key${NC}"
    fi
    
    # STEP 5: Deploy to Vercel
    echo -e "\n${YELLOW}STEP 5: Deploy to Vercel${NC}"
    echo -e "${YELLOW}Would you like to deploy your application to Vercel now? (y/n)${NC}"
    read -r DEPLOY
    
    if [[ "$DEPLOY" == "y" ]]; then
        echo -e "${YELLOW}Starting deployment to Vercel...${NC}"
        if [ -f "./audio-api-deploy.sh" ]; then
            chmod +x ./audio-api-deploy.sh
            ./audio-api-deploy.sh
        elif [ -f "../audio-api-deploy.sh" ]; then
            chmod +x ../audio-api-deploy.sh
            ../audio-api-deploy.sh
        else
            echo -e "${RED}❌ Could not find audio-api-deploy.sh script${NC}"
            echo -e "${YELLOW}You can deploy manually using:${NC}"
            echo -e "${YELLOW}vercel --prod${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping deployment.${NC}"
        echo -e "${YELLOW}You can deploy manually later using:${NC}"
        echo -e "${YELLOW}vercel --prod${NC}"
    fi
else
    echo -e "${RED}Please generate a standard OpenAI API key at: https://platform.openai.com/api-keys${NC}"
    echo -e "${RED}Then run this script again.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Done! Summary of changes:${NC}"
echo -e "${GREEN}1. Updated API key in runtime-env.js${NC}"
echo -e "${GREEN}2. Updated API key in .env file${NC}"
if [[ "$DEPLOY" == "y" ]]; then
    echo -e "${GREEN}3. Deployed to Vercel${NC}"
fi

echo -e "\n${YELLOW}After deployment, test your voice chat feature to confirm the 401 error is fixed.${NC}"
echo -e "${YELLOW}If you continue to experience issues, check your OpenAI account's billing status.${NC}"
