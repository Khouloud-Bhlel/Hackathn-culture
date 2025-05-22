import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Load environment variables from .env file
config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'enhanceArtifacts-fixed.js');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'enhanced-artifacts.json');

// Check if OpenAI API key is available
const apiKey = process.env.VITE_OPENAI_API_KEY || '';
console.log('API Key from env:', apiKey ? 'Found (starts with: ' + apiKey.substring(0, 10) + '...)' : 'Not found');

// Try to read from .env file directly as a fallback
let envApiKey = '';
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_OPENAI_API_KEY=(.+)/);
    if (match && match[1]) {
      envApiKey = match[1].trim();
      console.log('API Key from .env file:', envApiKey ? 'Found (starts with: ' + envApiKey.substring(0, 10) + '...)' : 'Not found');
    }
  }
} catch (error) {
  console.error('Error reading .env file:', error.message);
}

// Use the API key from environment variable or .env file
const finalApiKey = apiKey || envApiKey;

if (!finalApiKey) {
  console.error('❌ Error: VITE_OPENAI_API_KEY environment variable is not set');
  console.log('Please set your OpenAI API key before running this script:');
  console.log('export VITE_OPENAI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Set the API key in the environment for the child process
process.env.VITE_OPENAI_API_KEY = finalApiKey;

console.log('🚀 Starting artifact enhancement process');
console.log('📂 Script path:', SCRIPT_PATH);
console.log('📂 Output will be saved to:', OUTPUT_PATH);

try {
  // Make sure the public directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('📁 Created public directory');
  }

  // Run the script
  console.log('⏳ Running enhancement script (this may take a few minutes)...');
  // Quote the path to handle spaces correctly and pass the API key in the environment
  execSync(`npx tsx "${SCRIPT_PATH}"`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_OPENAI_API_KEY: finalApiKey
    }
  });
  
  // Check if the output file was created
  if (fs.existsSync(OUTPUT_PATH)) {
    console.log('✅ Artifact enhancement completed successfully!');
    console.log(`📄 Enhanced artifacts saved to: ${OUTPUT_PATH}`);
  } else {
    console.error('❌ Error: Output file was not created');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error running enhancement script:', error.message);
  process.exit(1);
}
