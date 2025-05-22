# متحف سلقطة - Museum PWA App

This is a Progressive Web App (PWA) for a museum experience that allows users to explore museum artifacts in 3D, view images, watch videos, and scan QR codes for more information.

## New AI-Enhanced Features

We've added new AI-powered capabilities to enhance the visitor experience:

### 1. Enhanced Artifact Descriptions
- All artifacts now feature enhanced detailed descriptions
- Enhanced content is automatically loaded at application startup
- More comprehensive historical context and artifact information
- **New:** Automatically generates enhanced data before starting the app
- **Important:** Descriptions are now loaded from the local JSON file only, not from OpenAI API

### 2. Voice-Enabled AI Chat Interface
- Ask questions about artifacts using natural voice input
- Get AI-powered answers based on artifact context
- Audio playback of AI responses for accessibility
- Automatic activation when scanning an artifact's QR code
- **Now using OpenAI API exclusively for voice chat functionality**

### 3. Smart QR Navigation
- QR codes now trigger the voice chat interface automatically
- Automatic navigation to the correct artifact when scanning a QR code
- Seamless transition between artifacts with preserved context

### 4. Artifact Enhancement Tool
- Added utility script to generate enhanced descriptions for all artifacts
- Content is saved to a JSON file for fast loading
- **New:** Run with `npm run generate-default` to update artifact descriptions using default templates
- **New:** No OpenAI API key is used for artifact descriptions - all descriptions are generated locally
- **New:** Added fallback mechanism to ensure artifact descriptions are always available

## Getting Started

### Environment Setup

This application requires an OpenAI API key **only** for the voice chat functionality. To set up:

1. Copy `.env.example` to `.env`
2. Replace `your_openai_api_key_here` with your actual OpenAI API key
3. Restart the development server if it's already running

```bash
# From the frontend directory
cp .env.example .env
# Edit the .env file to add your API key
```

### Running the Application

There are several ways to run the application:

1. **Standard Run** - Uses default descriptions, voice chat requires API key in `.env`
   ```bash
   npm run dev
   ```

2. **Voice Chat Enabled** - Ensures API key is properly loaded for voice chat
   ```bash
   npm run voice-chat
   # or
   ./run-voice-chat.sh
   ```

3. **Voice Chat Only Mode** - Same as standard run but more explicit about API usage
   ```bash
   npm run voice-chat-only
   ```

> ⚠️ **Note**: If you don't provide an OpenAI API key, the application will still work, but the voice chat functionality will be disabled. All artifact descriptions and information will still be available.

### Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Testing AI Features

To test the AI-powered features:

1. Make sure your OpenAI API key is properly set up in `.env`
2. Start the application with `npm run dev`
3. Navigate to any artifact detail view by clicking on an artifact
4. Use the voice interaction button to ask questions about the artifact
5. Scan QR codes to navigate between artifacts or get more information

### QR Code Testing

You can generate test QR codes for the application using any online QR code generator, with content in the following formats:

- `museum-artifact:artifact-title` (e.g., `museum-artifact:تمثال-نفرتيتي`)
- `artifact:artifact-title` (e.g., `artifact:قناع-توت-عنخ-آمون`)
- `/artifacts/artifact-title` (URL path format)

### Testing QR Code Scanning

The application includes a QR code scanner that can be used to navigate between artifacts. To test this feature:

1. **Generate test QR codes**:
   ```bash
   # Install required packages
   npm install qrcode fs-extra
   
   # Run the QR code generator script
   node scripts/generateQRCodes.js
   ```

2. **Use the generated QR codes**:
   - The QR codes will be saved in the `public/qr-codes` directory
   - Display them on another device or print them out
   - Open the QR scanner in the app and scan the codes
   - The app should navigate to the corresponding artifact

3. **QR code formats supported**:
   - Standard format: `museum-artifact:artifact-name`
   - Short format: `artifact:artifact-name`
   - URL path format: `/artifacts/artifact-name`
   - Full URL format: `https://example.com/artifacts/artifact-name`

## Installation Instructions

### On Mobile Devices

#### iOS:
1. Open the website in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

#### Android:
1. Open the website in Chrome
2. Tap the menu button (three dots)
3. Tap "Add to Home Screen" or "Install App"
4. Follow the prompts to install

### On Desktop

1. Open the website in a compatible browser (Chrome, Edge, etc.)
2. Look for the install icon in the address bar (usually a + or computer icon)
3. Click it and follow the prompts to install

## Features

- 3D Model Viewer: Interact with museum artifacts in 3D
- Image Gallery: Browse through high-quality images of artifacts
- Video Playback: Watch informational videos about exhibits
- QR Code Scanner: Scan codes at exhibits for more information
- Offline Access: Continue using the app even without internet connection

## Technical Information

This PWA is built with:
- React
- Three.js for 3D rendering
- Service Workers for offline functionality
- TailwindCSS for styling

## Data Generation

The app automatically generates enhanced artifact data:

### With OpenAI API Key
1. Create a `.env` file in the frontend directory
2. Add your OpenAI API key: `VITE_OPENAI_API_KEY=your_key_here`
3. Run `npm run dev` - the app will automatically use the API to enhance artifacts
4. **New:** The app already includes a working API key in the repository
5. **New:** You can also run `npm run enhance-with-openai` to explicitly generate enhanced descriptions

### Without API Key
1. If no API key is provided, the app will automatically generate default enhanced descriptions
2. You can manually generate default data by running: `npm run generate-default`
3. This creates rich descriptions without requiring OpenAI API access

### How It Works
- On startup, the app checks for `enhanced-artifacts.json` in the public directory
- If not found, it generates default data or uses OpenAI if configured
- All artifacts get detailed descriptions, historical context, and additional metadata

## Usage on Phone

For the best experience on your phone:
1. Install the app as described above
2. Allow camera permissions for QR code scanning
3. Keep the app on your home screen for quick access
4. The app works in portrait orientation for easier one-handed use

## Troubleshooting

If you encounter any issues:
- Make sure you're using the latest version of your browser
- Try clearing your browser cache
- Check that JavaScript is enabled
- Ensure you have granted the necessary permissions for camera access

### AI Features Not Working

If the AI features (voice interaction, enhanced descriptions) are not working:

1. Check that you have properly set up your OpenAI API key in the `.env` file
2. Ensure that your API key has sufficient credits and permissions
3. Check the browser console for any error messages
4. Try refreshing the application after updating the API key
5. Verify that the enhanced artifacts data file has been generated:
   ```bash
   # Generate enhanced artifact descriptions with OpenAI API
   npm run enhance-with-openai
   
   # Or generate default descriptions without API
   npm run generate-default
   ```
6. Check that microphone permissions are granted for voice chat functionality
7. For voice recognition issues, try speaking clearly and in a quiet environment

### QR Code Scanning Issues

If QR code scanning is not working correctly:

1. Ensure that you have granted camera permissions to the application
2. Make sure the QR code is well-lit and clearly visible
3. Try different QR code formats if one format is not being recognized
4. Check that the artifact name in the QR code matches an artifact in the application
