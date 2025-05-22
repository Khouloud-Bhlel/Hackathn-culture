#!/bin/bash

# Display banner
echo "╔═══════════════════════════════════════════╗"
echo "║                                           ║"
echo "║       OpenAI API Key Test Script          ║"
echo "║                                           ║"
echo "╚═══════════════════════════════════════════╝"

# Check for .env file
if [ -f ".env" ]; then
  API_KEY=$(grep "VITE_OPENAI_API_KEY" .env | cut -d '=' -f2)
  echo "📂 Found API key in .env file: ${API_KEY:0:5}...${API_KEY: -5}"
else
  echo "❌ No .env file found"
  echo "Enter your OpenAI API key to test:"
  read -r API_KEY
fi

echo "🧪 Testing OpenAI API key..."

# Test with basic models endpoint
echo "Test 1: GET /models endpoint"
MODELS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
                  -H "Authorization: Bearer $API_KEY" \
                  https://api.openai.com/v1/models)

HTTP_STATUS=$(echo "$MODELS_RESPONSE" | grep "HTTP_STATUS" | cut -d":" -f2)
RESPONSE_BODY=$(echo "$MODELS_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" == "200" ]; then
  echo "✅ Models API Test: Success (HTTP 200)"
  echo "🔍 Found models: $(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)"
else
  echo "❌ Models API Test: Failed (HTTP $HTTP_STATUS)"
  echo "Error response: $RESPONSE_BODY"
fi

# Test with chat completions endpoint
echo -e "\nTest 2: POST /chat/completions endpoint"
CHAT_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
                 -H "Content-Type: application/json" \
                 -H "Authorization: Bearer $API_KEY" \
                 -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}],"max_tokens":5}' \
                 https://api.openai.com/v1/chat/completions)

HTTP_STATUS=$(echo "$CHAT_RESPONSE" | grep "HTTP_STATUS" | cut -d":" -f2)
RESPONSE_BODY=$(echo "$CHAT_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" == "200" ]; then
  echo "✅ Chat API Test: Success (HTTP 200)"
  CONTENT=$(echo "$RESPONSE_BODY" | grep -o '"content":"[^"]*"' | head -1 | sed 's/"content":"//;s/"$//')
  echo "🔍 Response: $CONTENT"
else
  echo "❌ Chat API Test: Failed (HTTP $HTTP_STATUS)"
  echo "Error response: $RESPONSE_BODY"
fi

# Test with audio API
echo -e "\nTest 3: POST /audio/speech endpoint (TTS)"
TTS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $API_KEY" \
                -d '{"model":"tts-1","input":"Hello world","voice":"alloy"}' \
                https://api.openai.com/v1/audio/speech)

HTTP_STATUS=$(echo "$TTS_RESPONSE" | grep "HTTP_STATUS" | cut -d":" -f2)
RESPONSE_BODY=$(echo "$TTS_RESPONSE" | grep -v "HTTP_STATUS")

if [ "$HTTP_STATUS" == "200" ]; then
  echo "✅ TTS API Test: Success (HTTP 200)"
  echo "🔍 Received audio data"
else
  echo "❌ TTS API Test: Failed (HTTP $HTTP_STATUS)"
  echo "Error response: $RESPONSE_BODY"
fi

echo -e "\n🔎 Summary:"
echo "Based on these tests, your API key is $([ "$HTTP_STATUS" == "200" ] && echo "valid and working" || echo "invalid or unauthorized")."
echo "If you're seeing HTTP 401 errors, your API key may have expired or been revoked."
echo "Get a new API key from https://platform.openai.com/api-keys"
