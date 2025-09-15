// Test OpenAI Audio API
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

// API Key from command-line args or environment variable
const API_KEY = process.argv[2] || process.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
  console.error("Error: No API key provided");
  console.log("Usage: node test-openai-api.js YOUR_API_KEY");
  process.exit(1);
}

console.log("API Key begins with:", API_KEY.substring(0, 7) + "...");

// Create a temporary audio file (1 second of silence)
const tempFile = "test-audio.mp3";
const buffer = Buffer.alloc(32000); // 1 second of silence at 32kHz

fs.writeFileSync(tempFile, buffer);
console.log("Created test audio file:", tempFile);

async function testAudioTranscription() {
  try {
    console.log("Testing OpenAI Audio Transcription API...");
    
    const form = new FormData();
    form.append('file', fs.createReadStream(tempFile));
    form.append('model', 'whisper-1');
    
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      form,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );
    
    console.log("✅ Success!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", JSON.stringify(error.response.data, null, 2));
    }
    return false;
  } finally {
    // Clean up the temp file
    fs.unlinkSync(tempFile);
    console.log("Deleted test audio file");
  }
}

async function run() {
  try {
    const result = await testAudioTranscription();
    console.log("Test completed. Result:", result ? "PASS" : "FAIL");
  } catch (e) {
    console.error("Unexpected error:", e);
  }
}

run();
