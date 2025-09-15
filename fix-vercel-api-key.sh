#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}   Fix API Key for Vercel Deployment (2025) ${NC}"
echo -e "${BLUE}============================================${NC}"

# Step 1: Check current API key
echo -e "\n${YELLOW}Step 1: Checking current API key...${NC}"

RUNTIME_ENV_FILE="./frontend/public/runtime-env.js"
if [ -f "$RUNTIME_ENV_FILE" ]; then
  echo -e "${GREEN}✓ Found runtime-env.js${NC}"
else
  echo -e "${RED}❌ runtime-env.js not found. Creating it...${NC}"
  mkdir -p ./frontend/public
fi

# Step 2: Get a new API key
echo -e "\n${YELLOW}Step 2: Enter your OpenAI API key${NC}"
echo -e "${YELLOW}This must be a standard API key that starts with 'sk-' (not 'sk-proj-')${NC}"
echo -e "${YELLOW}You can create one at: https://platform.openai.com/api-keys${NC}"
read -p "API key: " API_KEY

if [[ ! "$API_KEY" == sk-* || "$API_KEY" == sk-proj-* ]]; then
  echo -e "${RED}⚠️ Warning: This doesn't look like a standard OpenAI API key${NC}"
  echo -e "${YELLOW}Standard keys start with 'sk-' but not 'sk-proj-'${NC}"
  read -p "Continue anyway? (y/N): " CONTINUE
  if [[ ! "$CONTINUE" == "y" ]]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
  fi
fi

# Step 3: Update all relevant files
echo -e "\n${YELLOW}Step 3: Updating configuration files...${NC}"

# Update runtime-env.js
echo -e "${YELLOW}Updating runtime-env.js...${NC}"
cat > "$RUNTIME_ENV_FILE" << EOL
// This file is generated at build time and injected at runtime
// It allows environment variables to be used after the app is built
window.env = {
  VITE_OPENAI_API_KEY: "${API_KEY}"
};
EOL
echo -e "${GREEN}✓ Updated runtime-env.js${NC}"

# Update .env file
ENV_FILE="./frontend/.env"
echo -e "${YELLOW}Updating .env file...${NC}"
echo "VITE_OPENAI_API_KEY=${API_KEY}" > "$ENV_FILE"
echo -e "${GREEN}✓ Updated .env file${NC}"

# Update vercel.json
echo -e "${YELLOW}Checking vercel.json...${NC}"
VERCEL_JSON="./vercel.json"
if grep -q "\"VITE_OPENAI_API_KEY\":" "$VERCEL_JSON"; then
  # Backup first
  cp "$VERCEL_JSON" "${VERCEL_JSON}.bak"
  # Update the file using sed
  sed -i 's/"VITE_OPENAI_API_KEY": "[^"]*"/"VITE_OPENAI_API_KEY": "@openai_api_key"/g' "$VERCEL_JSON"
  echo -e "${GREEN}✓ Updated vercel.json to use @openai_api_key secret${NC}"
else
  echo -e "${RED}❌ Could not update vercel.json - VITE_OPENAI_API_KEY not found${NC}"
fi

# Step 4: Add Vercel secret
echo -e "\n${YELLOW}Step 4: Adding Vercel secret...${NC}"
if command -v vercel &> /dev/null; then
  echo -e "${GREEN}Adding API key as Vercel secret...${NC}"
  vercel secret add openai_api_key "$API_KEY"
  echo -e "${GREEN}✓ Added API key as Vercel secret 'openai_api_key'${NC}"
else
  echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  echo -e "${GREEN}✓ Vercel CLI installed${NC}"
  echo -e "${GREEN}Adding API key as Vercel secret...${NC}"
  vercel secret add openai_api_key "$API_KEY"
  echo -e "${GREEN}✓ Added API key as Vercel secret 'openai_api_key'${NC}"
fi

# Step 5: Update generate-runtime-env.sh
echo -e "\n${YELLOW}Step 5: Updating runtime environment generator script...${NC}"
GENERATE_ENV_SCRIPT="./frontend/scripts/generate-runtime-env.sh"

if [ -f "$GENERATE_ENV_SCRIPT" ]; then
  # Backup the script
  cp "$GENERATE_ENV_SCRIPT" "${GENERATE_ENV_SCRIPT}.bak"
  
  # Fix the script to properly handle the API key
  cat > "$GENERATE_ENV_SCRIPT" << 'EOL'
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
EOL

  # Make it executable
  chmod +x "$GENERATE_ENV_SCRIPT"
  echo -e "${GREEN}✓ Updated and fixed generate-runtime-env.sh${NC}"
else
  echo -e "${RED}❌ Could not find generate-runtime-env.sh${NC}"
fi

# Step 6: Test API key
echo -e "\n${YELLOW}Step 6: Testing API key...${NC}"

echo -e "${YELLOW}Creating API test file...${NC}"
TEST_FILE="./frontend/public/test-api.html"
cat > "$TEST_FILE" << EOL
<!DOCTYPE html>
<html>
<head>
  <title>OpenAI API Test</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .result { margin-top: 20px; padding: 10px; border: 1px solid #ccc; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>OpenAI API Test</h1>
  <button id="testButton">Test API</button>
  <div id="result" class="result">Click the button to test the API connection.</div>
  
  <script src="runtime-env.js"></script>
  <script>
    document.getElementById('testButton').addEventListener('click', async () => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = 'Testing API connection...';
      
      try {
        // Check if API key exists
        const apiKey = window.env && window.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
          resultDiv.innerHTML = '<p class="error">❌ API key not found in window.env</p>';
          return;
        }
        
        // Display masked API key
        const firstFour = apiKey.substring(0, 4);
        const lastFour = apiKey.substring(apiKey.length - 4);
        resultDiv.innerHTML = \`<p>Using API key: \${firstFour}...\${lastFour}</p>\`;
        
        // Create a simple test using the Chat API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${apiKey}\`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a testing assistant. Respond with 'API TEST SUCCESSFUL' and nothing else."
              },
              {
                role: "user", 
                content: "Test connection"
              }
            ],
            max_tokens: 20
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          resultDiv.innerHTML += \`<p class="error">❌ API Error: \${response.status} \${response.statusText}</p>\`;
          resultDiv.innerHTML += \`<pre class="error">\${JSON.stringify(error, null, 2)}</pre>\`;
          return;
        }
        
        const data = await response.json();
        resultDiv.innerHTML += \`<p class="success">✅ API test successful!</p>\`;
        resultDiv.innerHTML += \`<p>Response: \${data.choices[0].message.content}</p>\`;
      } catch (error) {
        resultDiv.innerHTML += \`<p class="error">❌ Error: \${error.message}</p>\`;
      }
    });
  </script>
</body>
</html>
EOL
echo -e "${GREEN}✓ Created test file at ${TEST_FILE}${NC}"

# Step 7: Prepare for deployment
echo -e "\n${YELLOW}Step 7: Ready for deployment${NC}"
echo -e "${GREEN}✅ All configurations updated!${NC}"
echo -e "${YELLOW}To deploy to Vercel, run:${NC}"
echo -e "   vercel --prod"
echo -e "\n${YELLOW}To test your API key locally:${NC}"
echo -e "1. Start the development server: cd frontend && npm run dev"
echo -e "2. Open the test page in your browser: http://localhost:5173/test-api.html"
echo -e "\n${YELLOW}If you encounter any issues:${NC}"
echo -e "1. Check that you used a standard API key (starts with sk-, not sk-proj-)"
echo -e "2. Verify that your OpenAI account has billing set up"
echo -e "3. Try running the API test page to verify the key works"
echo -e "${BLUE}============================================${NC}"
