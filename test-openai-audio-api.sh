#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       Test OpenAI API Key for Audio        ${NC}"
echo -e "${BLUE}============================================${NC}"

# Prompt for the API key
echo -e "\n${YELLOW}Please enter your OpenAI API key to test:${NC}"
read -r API_KEY

# Function to test the API key with different endpoints
test_api_endpoint() {
    local endpoint=$1
    local request_type=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Testing $description...${NC}"
    
    if [ "$request_type" = "GET" ]; then
        # For GET requests
        RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
                      -H "Authorization: Bearer $API_KEY" \
                      "$endpoint")
    else
        # For POST requests
        RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
                      -H "Content-Type: application/json" \
                      -H "Authorization: Bearer $API_KEY" \
                      -d "$data" \
                      "$endpoint")
    fi
    
    HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d":" -f2)
    RESPONSE_BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✓ Success! $description is accessible${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed with HTTP $HTTP_STATUS${NC}"
        echo -e "${RED}Error response: $RESPONSE_BODY${NC}"
        return 1
    fi
}

# Test basic API access
echo -e "\n${YELLOW}1. Testing basic API access...${NC}"
test_api_endpoint "https://api.openai.com/v1/models" "GET" "" "Basic API access"

# Test chat completions API
echo -e "\n${YELLOW}2. Testing chat completions API...${NC}"
test_api_endpoint "https://api.openai.com/v1/chat/completions" "POST" '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}],"max_tokens":10}' "Chat completions API"

# Test text-to-speech API
echo -e "\n${YELLOW}3. Testing text-to-speech API...${NC}"
test_api_endpoint "https://api.openai.com/v1/audio/speech" "POST" '{"model":"tts-1","input":"Hello world","voice":"alloy"}' "Text-to-speech API"

# We can't easily test transcription with this script since it requires an audio file
echo -e "\n${YELLOW}Note: Audio transcription API requires an audio file, so we couldn't test it directly.${NC}"
echo -e "${YELLOW}However, if the text-to-speech test passed, it's likely that the audio transcription will work too.${NC}"

# Provide a summary
echo -e "\n${BLUE}============================================${NC}"
echo -e "${BLUE}                 Summary                   ${NC}"
echo -e "${BLUE}============================================${NC}"

if [[ "$API_KEY" == sk-proj-* ]]; then
    echo -e "${YELLOW}⚠️ You're using a project-scoped API key (starts with sk-proj-).${NC}"
    echo -e "${YELLOW}These keys may have limited permissions. If you're still having troubles,${NC}"
    echo -e "${YELLOW}please obtain a standard API key (starts with sk-) instead.${NC}"
elif [[ "$API_KEY" == sk-* ]]; then
    echo -e "${GREEN}✓ You're using a standard API key (starts with sk-).${NC}"
    echo -e "${GREEN}This key should have full permissions, including audio APIs.${NC}"
else
    echo -e "${RED}✗ Unknown API key format. Please ensure you're using a valid OpenAI API key.${NC}"
fi

echo -e "\n${YELLOW}If you still experience 401 Unauthorized errors, please check:${NC}"
echo -e "${YELLOW}1. Your OpenAI account billing status (https://platform.openai.com/account/billing)${NC}"
echo -e "${YELLOW}2. Usage limits for your account${NC}"
echo -e "${YELLOW}3. If you're using a project-scoped key, ensure the project has audio permissions enabled${NC}"
