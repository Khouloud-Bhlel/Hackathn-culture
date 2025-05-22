#!/bin/bash

# Script to generate default enhanced artifacts without requiring OpenAI API
# This is useful for testing the application without having an API key

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║       Generate Default Enhanced Artifact Descriptions     ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: This script must be run from the frontend directory"
  echo "Please navigate to the frontend directory and try again:"
  echo "  cd frontend"
  echo "  ./generate-default-enhanced.sh"
  exit 1
fi

# Run the script
echo "🚀 Generating default enhanced artifact descriptions..."
echo "This will create descriptions without using OpenAI API."

npx tsx ./scripts/generateDefaultEnhanced.js

# Check exit status
if [ $? -ne 0 ]; then
  echo "❌ Generation process failed. Please check the error messages above."
  exit 1
else
  echo "✅ Generation process completed successfully!"
  echo "The enhanced artifacts have been saved to public/enhanced-artifacts.json"
  echo "You can now start the application:"
  echo "  npm run dev"
fi
