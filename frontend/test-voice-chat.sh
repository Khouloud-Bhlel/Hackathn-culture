#!/bin/bash

# Clear terminal for better readability
clear

# Display banner
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     Museum App - Voice Chat Test with OpenAI API Key       ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Check for .env file
if [ ! -f ".env" ]; then
  echo "❌ .env file not found. Creating one..."
  echo "✅ Created .env file with API key"
fi

# Read the API key from .env file
API_KEY=$(grep "VITE_OPENAI_API_KEY" .env | cut -d '=' -f2)

# Verify API key looks valid
if [[ ${#API_KEY} -lt 20 ]]; then
  echo "⚠️ API key in .env looks too short: ${API_KEY:0:5}..."
  
  # Ask if user wants to update it
  echo "Do you want to update the API key? (y/n)"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Enter your OpenAI API key:"
    read -r NEW_API_KEY
    sed -i "s/VITE_OPENAI_API_KEY=.*/VITE_OPENAI_API_KEY=$NEW_API_KEY/" .env
    API_KEY=$NEW_API_KEY
    echo "✅ API key updated"
  fi
fi

# Set environment variable for this session
export VITE_OPENAI_API_KEY=$API_KEY
echo "✅ API key set in environment: ${API_KEY:0:5}...${API_KEY: -5}"

# Test OpenAI API connectivity
echo "🧪 Testing OpenAI API connectivity..."
curl -s -o /dev/null -w "%{http_code}" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     https://api.openai.com/v1/models > /tmp/api_test.txt

STATUS_CODE=$(cat /tmp/api_test.txt)
if [ "$STATUS_CODE" == "200" ]; then
  echo "✅ API connection successful (HTTP 200 OK)"
else
  echo "⚠️ API connection test returned HTTP $STATUS_CODE - there might be issues with API access"
fi

# Run the app with DEBUG logging enabled
echo "🚀 Starting application with voice chat enabled..."
echo "📢 Please check the browser console for detailed API key logs"
export DEBUG=1
npm run dev
