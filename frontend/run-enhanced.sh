#!/bin/bash

# This script runs our updated enhance-artifacts script with proper environment handling

# Set API key in environment and .env file
export VITE_OPENAI_API_KEY=""
echo "VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY" > .env

echo "API key set to: ${VITE_OPENAI_API_KEY:0:10}...${VITE_OPENAI_API_KEY: -5}"

# Run our enhanced script
echo "Running enhanced artifact generation..."
node --experimental-modules ./bin/enhance-artifacts-new.js
