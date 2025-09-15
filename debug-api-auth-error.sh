#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Debug OpenAI API Authentication Error   ${NC}"
echo -e "${BLUE}============================================${NC}"

# Check environment files
echo -e "${YELLOW}Checking environment files:${NC}"

# Check runtime-env.js
RUNTIME_ENV_FILE="./frontend/public/runtime-env.js"
if [ -f "$RUNTIME_ENV_FILE" ]; then
  echo -e "${GREEN}✓ Found runtime-env.js${NC}"
  echo -e "${YELLOW}Content:${NC}"
  cat "$RUNTIME_ENV_FILE"
  
  # Check if the API key is properly set
  if grep -q 'VITE_OPENAI_API_KEY: "\${VITE_OPENAI_API_KEY}"' "$RUNTIME_ENV_FILE"; then
    echo -e "${RED}❌ API key is not properly set - contains \${VITE_OPENAI_API_KEY} placeholder${NC}"
  elif grep -q 'VITE_OPENAI_API_KEY: ""' "$RUNTIME_ENV_FILE"; then
    echo -e "${RED}❌ API key is empty${NC}"
  elif grep -q "VITE_OPENAI_API_KEY: \"" "$RUNTIME_ENV_FILE"; then
    echo -e "${GREEN}✓ API key appears to be set${NC}"
    
    # Extract and check API key format
    API_KEY=$(grep -o 'VITE_OPENAI_API_KEY: "[^"]*"' "$RUNTIME_ENV_FILE" | sed 's/VITE_OPENAI_API_KEY: "//;s/"$//')
    
    if [[ "$API_KEY" == sk-proj-* ]]; then
      echo -e "${YELLOW}⚠️ Using project-scoped key (sk-proj-*) - may have limited permissions${NC}"
      USING_PROJ_KEY=true
    elif [[ "$API_KEY" == sk-* ]]; then
      echo -e "${GREEN}✓ Using standard key format (sk-*)${NC}"
    else
      echo -e "${RED}❌ API key has invalid format: $API_KEY${NC}"
    fi
  else
    echo -e "${RED}❌ Could not determine if API key is set${NC}"
  fi
else
  echo -e "${RED}❌ runtime-env.js not found${NC}"
fi

# Check .env file
ENV_FILE="./frontend/.env"
if [ -f "$ENV_FILE" ]; then
  echo -e "\n${GREEN}✓ Found .env file${NC}"
  echo -e "${YELLOW}Content:${NC}"
  cat "$ENV_FILE"
  
  # Check if API key is set in .env
  if grep -q "VITE_OPENAI_API_KEY=" "$ENV_FILE"; then
    ENV_API_KEY=$(grep "VITE_OPENAI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2)
    
    if [ -z "$ENV_API_KEY" ]; then
      echo -e "${RED}❌ API key is empty in .env file${NC}"
    elif [[ "$ENV_API_KEY" == sk-proj-* ]]; then
      echo -e "${YELLOW}⚠️ Using project-scoped key (sk-proj-*) in .env - may have limited permissions${NC}"
      USING_PROJ_KEY=true
    elif [[ "$ENV_API_KEY" == sk-* ]]; then
      echo -e "${GREEN}✓ Using standard key format (sk-*) in .env${NC}"
    else
      echo -e "${RED}❌ API key has invalid format in .env: $ENV_API_KEY${NC}"
    fi
  else
    echo -e "${RED}❌ VITE_OPENAI_API_KEY not found in .env file${NC}"
  fi
else
  echo -e "\n${RED}❌ .env file not found${NC}"
fi

# Check any JS files that might handle the API calls
echo -e "\n${YELLOW}Checking API call implementation:${NC}"

# Find potential OpenAI API call files
API_FILES=$(grep -l "api.openai.com" --include="*.js" --include="*.ts" --include="*.tsx" -r ./frontend/src 2>/dev/null || echo "")

if [ -z "$API_FILES" ]; then
  echo -e "${RED}❌ Could not find files with OpenAI API calls${NC}"
else
  echo -e "${GREEN}✓ Found files that may contain OpenAI API calls:${NC}"
  for file in $API_FILES; do
    echo "  - $file"
    
    # Check how the API key is being used
    if grep -q "Authorization: Bearer" "$file"; then
      echo -e "${GREEN}    ✓ File uses proper Authorization: Bearer header${NC}"
    elif grep -q "headers: { Authorization:" "$file"; then
      echo -e "${GREEN}    ✓ File sets Authorization header${NC}"
    else
      echo -e "${RED}    ❌ Could not find proper Authorization header in $file${NC}"
    fi
    
    # Check if environment variable is properly accessed
    if grep -q "process.env.VITE_OPENAI_API_KEY" "$file"; then
      echo -e "${GREEN}    ✓ File accesses API key from process.env${NC}"
    elif grep -q "window.env.VITE_OPENAI_API_KEY" "$file"; then
      echo -e "${GREEN}    ✓ File accesses API key from window.env${NC}"
    elif grep -q "import.meta.env.VITE_OPENAI_API_KEY" "$file"; then
      echo -e "${GREEN}    ✓ File accesses API key from import.meta.env${NC}"
    else
      echo -e "${RED}    ❌ Could not determine how API key is accessed in $file${NC}"
    fi
  done
fi

# Check Vercel configuration
echo -e "\n${YELLOW}Checking Vercel configuration:${NC}"
VERCEL_JSON="./vercel.json"

if [ -f "$VERCEL_JSON" ]; then
  echo -e "${GREEN}✓ Found vercel.json${NC}"
  echo -e "${YELLOW}Environment configuration:${NC}"
  grep -A 5 "\"env\":" "$VERCEL_JSON"
  
  # Check if API key is properly configured
  if grep -q "\"VITE_OPENAI_API_KEY\": \"@openai_api_key\"" "$VERCEL_JSON"; then
    echo -e "${GREEN}✓ API key is configured to use Vercel secret @openai_api_key${NC}"
  elif grep -q "\"VITE_OPENAI_API_KEY\":" "$VERCEL_JSON"; then
    echo -e "${RED}❌ API key is not using Vercel secret format${NC}"
  else
    echo -e "${RED}❌ API key not found in vercel.json env section${NC}"
  fi
else
  echo -e "${RED}❌ vercel.json not found${NC}"
fi

echo -e "\n${BLUE}============================================${NC}"
echo -e "${YELLOW}Recommendations:${NC}"

if [ "$USING_PROJ_KEY" = true ]; then
  echo -e "1. Replace project-scoped API key (sk-proj-*) with standard API key (sk-*)"
  echo -e "   Get a standard API key from: https://platform.openai.com/api-keys"
fi

echo -e "2. Make sure runtime-env.js contains the actual API key, not a placeholder"
echo -e "3. Verify that your frontend correctly accesses the API key from window.env"
echo -e "4. Check that the API key is properly included in Authorization headers"
echo -e "5. For Vercel deployment, ensure your secret is correctly set with:"
echo -e "   vercel secret add openai_api_key YOUR_ACTUAL_API_KEY"
echo -e "${BLUE}============================================${NC}"
