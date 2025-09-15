#!/bin/bash

# Set the OpenAI API key
export VITE_OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
# Print the API key for verification
echo "Using API key: $VITE_OPENAI_API_KEY"

# Run the enhancement script
cd "/home/khouloud/Documents/all personnel  projects/project_hakathon-culture/frontend"
npm run generate-default

# Verify the enhanced-artifacts.json file was created
ls -la public/enhanced-artifacts.json
