#!/bin/bash

# Set the API key directly in the environment
export VITE_OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
echo "API key set to: $VITE_OPENAI_API_KEY"

# Start the development server
cd "/home/khouloud/Documents/all personnel  projects/project_hakathon-culture/frontend"
npm run dev
