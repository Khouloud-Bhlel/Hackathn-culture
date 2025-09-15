#!/bin/bash

# Enhanced Artifacts Generator Script
# This script runs the enhancement process to generate default descriptions
# for all artifacts in the museum application - NO OpenAI API is used

# Display banner
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║            Museum Default Enhancement Tool                ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: This script must be run from the frontend directory"
  echo "Please navigate to the frontend directory and try again:"
  echo "  cd frontend"
  echo "  ./enhance-artifacts.sh"
  exit 1
fi

echo "🔍 Note: This script generates default descriptions WITHOUT using OpenAI API"
echo "📝 OpenAI API is only used for voice chat functionality, not for artifact descriptions"

# Run the default description generator
echo "🚀 Generating enhanced artifact descriptions..."
  
  # If still empty, prompt for it
  if [ -z "$VITE_OPENAI_API_KEY" ]; then
    # Run the npm script for generating default descriptions
npm run generate-default

# Check exit status
if [ $? -ne 0 ]; then
  echo "❌ Enhancement process failed. Please check the error messages above."
  exit 1
else
  echo "✅ Enhancement process completed successfully!"
  echo "The enhanced artifacts have been saved to the public directory."
  echo "You can now start the application to use the enhanced descriptions:"
  echo "  npm run dev"
  echo ""
  echo "📢 Note: For voice chat functionality, please run:"
  echo "  npm run voice-chat"
fi
