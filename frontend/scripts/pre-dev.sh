#!/bin/bash

# Pre-dev script: This automatically generates enhanced data before starting the dev server
# OpenAI API is now ONLY used for voice chat functionality, NOT for artifact descriptions

echo "🚀 Preparing enhanced artifact data before starting the dev server..."

# Use the default generator for artifact descriptions
echo "ℹ️ Using default descriptions for artifacts (OpenAI restricted to voice chat only)..."
npm run generate-default

# Check if we have an OpenAI API key and export it if found
if [ -f ".env" ]; then
  # Export environment variables from .env
  export $(grep -v '^#' .env | xargs)
fi

# Check if API key is available (either from .env or already set in environment)
if [[ -n "$VITE_OPENAI_API_KEY" && "$VITE_OPENAI_API_KEY" != "your_openai_api_key_here" ]]; then
  echo "🔑 OpenAI API key detected: ${VITE_OPENAI_API_KEY:0:4}...${VITE_OPENAI_API_KEY: -4} (used for voice chat only)"
else
  # In CI/CD environments (like Vercel), the environment variable might be set later
  if [ "$CI" == "true" ] || [ "$VERCEL" == "1" ]; then
    echo "🔄 Running in CI/CD environment. API key will be configured at runtime."
  else
    echo "⚠️ No valid OpenAI API key found. Voice chat functionality will be disabled."
  fi
fi

# Ensure the public directory exists
mkdir -p public

# Check if we have the enhanced data
if [ -f "public/enhanced-artifacts.json" ]; then
  echo "✅ Enhanced artifact data is ready!"
else
  echo "❌ Failed to generate enhanced data. Please check the errors above."
  exit 1
fi
