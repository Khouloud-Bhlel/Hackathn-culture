#!/bin/bash

# Load the API key from .env file
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
  echo "🔑 OpenAI API key loaded from .env file"
  echo "API key set to: ${VITE_OPENAI_API_KEY:0:10}...${VITE_OPENAI_API_KEY: -5}"
else
  echo "❌ .env file not found. Please create one with your OpenAI API key."
  exit 1
fi

# Run the simplified enhancement script
npx tsx ./scripts/simpleEnhanceArtifacts.js

# Check if the file was created
ls -la ./public/enhanced-artifacts.json

echo "Now starting development server..."
npm run dev
