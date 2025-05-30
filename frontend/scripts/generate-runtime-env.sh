#!/bin/bash

# This script generates a runtime-env.js file with environment variables
# This allows environment variables to be injected at runtime in production
# particularly useful for Vercel deployments

# Set output file path
OUTPUT_FILE="./public/runtime-env.js"

echo "Generating runtime environment configuration..."

# Get API key, trying multiple environment variables
API_KEY=${OPENAI_API_KEY:-${VITE_OPENAI_API_KEY:-"no_key_found"}}

# Create the runtime-env.js file
cat > $OUTPUT_FILE << EOF
// This file is generated at build time and injected at runtime
// It allows environment variables to be used after the app is built
window.env = {
  VITE_OPENAI_API_KEY: "${API_KEY}"
};
EOF

echo "✅ Created $OUTPUT_FILE with runtime environment variables"
echo "  - API key status: ${API_KEY:0:4}...${API_KEY: -4}"
