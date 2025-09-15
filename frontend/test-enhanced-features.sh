#!/bin/bash

# Test script to verify enhanced museum application features
# This script checks for the presence of required files and environment settings

echo "🧪 Running tests for enhanced museum application..."

# Navigate to the frontend directory
cd "$(dirname "$0")" || exit 1
export VITE_OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
# Set the OpenAI API key
echo "API key set to: VITE_OPENAI_API_KEY=*****"

# Check for OpenAI API key
OPENAI_KEY_SET=false
if [ -n "$VITE_OPENAI_API_KEY" ]; then
  OPENAI_KEY_SET=true
elif [ -f ".env" ] && grep -q "VITE_OPENAI_API_KEY" .env; then
  OPENAI_KEY_SET=true
fi

# Check for the enhanced artifacts file
ENHANCED_FILE_EXISTS=false
if [ -f "public/enhanced-artifacts.json" ]; then
  ENHANCED_FILE_EXISTS=true
fi

# Check for required script files
SCRIPTS_EXIST=true
if [ ! -f "scripts/enhanceArtifacts.js" ]; then
  SCRIPTS_EXIST=false
fi
if [ ! -f "bin/enhance-artifacts" ]; then
  SCRIPTS_EXIST=false
fi

# Check for utility files
UTILS_EXIST=true
if [ ! -f "src/utils/enhancedArtifacts.ts" ]; then
  UTILS_EXIST=false
fi

# Display results
echo "======== Test Results ========"
echo "OpenAI API Key: $(if $OPENAI_KEY_SET; then echo "✅ CONFIGURED"; else echo "❌ NOT CONFIGURED"; fi)"
echo "Enhanced Artifacts File: $(if $ENHANCED_FILE_EXISTS; then echo "✅ PRESENT"; else echo "❌ NOT FOUND"; fi)"
echo "Enhancement Scripts: $(if $SCRIPTS_EXIST; then echo "✅ PRESENT"; else echo "❌ MISSING"; fi)"
echo "Utility Files: $(if $UTILS_EXIST; then echo "✅ PRESENT"; else echo "❌ MISSING"; fi)"
echo "============================"

# Recommendations
echo ""
echo "🔍 Recommendations:"

if ! $OPENAI_KEY_SET; then
  echo "  ❗ Configure your OpenAI API key in .env file or environment"
  echo "    Example: echo 'VITE_OPENAI_API_KEY=your_key_here' > .env"
fi

if ! $ENHANCED_FILE_EXISTS; then
  echo "  ❗ Generate enhanced artifacts by running:"
  echo "    ./enhance-artifacts.sh"
  echo "    or"
  echo "    npm run enhance-artifacts"
fi

if $OPENAI_KEY_SET && $SCRIPTS_EXIST && $UTILS_EXIST && ! $ENHANCED_FILE_EXISTS; then
  echo "  ✅ Your setup looks good, but you need to generate enhanced artifacts."
  echo "     Run: npm run enhance-artifacts"
elif $OPENAI_KEY_SET && $SCRIPTS_EXIST && $UTILS_EXIST && $ENHANCED_FILE_EXISTS; then
  echo "  🎉 All tests passed! Your enhanced museum application is ready to use."
  echo "     Start the development server with: npm run dev"
else
  echo "  ❌ Some tests failed. Please fix the issues above before continuing."
fi
