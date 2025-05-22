# Voice Chat Testing Guide

This document provides instructions on how to test and troubleshoot the voice chat functionality in the museum application.

## Prerequisites

- An OpenAI API key (get one from https://platform.openai.com/api-keys)
- A microphone connected to your computer
- A modern web browser (Chrome, Firefox, Safari)

## Testing Steps

1. **Update your API key** (if you haven't already or if it's not working)
   ```bash
   ./update-api-key.sh
   ```
   This script will help you update your OpenAI API key and test if it's valid.

2. **Test the OpenAI API directly**
   ```bash
   ./test-openai-api.sh
   ```
   This script tests if your API key works with various OpenAI endpoints.

3. **Run the application with voice chat enabled**
   ```bash
   ./run-voice-chat.sh
   ```
   This script starts the application with all necessary environment variables.

4. **Test voice chat in the application**
   - Open any 3D artifact (Nefertiti, Vase, or Golden Mask)
   - Click on the "محادثة" (Chat) tab
   - Click the microphone button and speak a question in Arabic
   - Wait for the response

## Troubleshooting

### Error: "401 Unauthorized"
This means your API key is not valid. Run `./update-api-key.sh` to update it.

### Error: "API key not available"
This means your application can't find the API key. Make sure:
- You have a `.env` file in the frontend directory
- The file contains `VITE_OPENAI_API_KEY=your_key_here`
- There are no spaces or extra characters in the file

### No sound for AI responses
- Check your system volume
- Make sure your browser allows audio playback
- Try clicking the sound icon next to the AI response

### Microphone not working
- Make sure your browser has permission to access the microphone
- Try reloading the page
- Check if your microphone works in other applications

## Notes

- The OpenAI API key is ONLY used for voice chat functionality, not for artifact descriptions.
- All artifact descriptions are loaded from the local JSON file.
- The voice chat feature requires an internet connection to work.
