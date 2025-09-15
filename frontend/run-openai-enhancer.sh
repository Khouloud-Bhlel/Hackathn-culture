#!/bin/bash

# Direct OpenAI enhancer script
# This script runs our simplified OpenAI-based artifact enhancement script

# Set the API key in the environment
export VITE_OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
# Save it to .env file
echo "VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY" > .env

# Run our custom enhancer script
echo "🔑 Running OpenAI enhancer with API key: ${VITE_OPENAI_API_KEY:0:10}...${VITE_OPENAI_API_KEY: -5}"
node --experimental-modules ./scripts/openaiEnhancer.js

# Check if the enhanced file was created
if [ -f "./public/enhanced-artifacts.json" ]; then
  echo "✅ Enhanced artifacts file created successfully"
  ls -la ./public/enhanced-artifacts.json
else
  echo "❌ Failed to create enhanced artifacts file"
  exit 1
fi
