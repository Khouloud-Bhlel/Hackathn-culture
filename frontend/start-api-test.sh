#!/bin/bash

# A direct script to test the OpenAI API key

# Set the API key
export VITE_OPENAI_API_KEY=""

# Save to .env file
echo "VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY" > .env

# Print confirmation
echo "Using API key: ${VITE_OPENAI_API_KEY:0:10}...${VITE_OPENAI_API_KEY: -5}"

# Run generate-default to create the JSON file
echo "Generating default data..."
npm run generate-default

# Start the server
echo "Starting development server..."
npm run dev
