# Museum Application Architecture

## Component Overview

### Core Components

- **App.tsx**: The main application component that orchestrates all other components and handles global state.
- **AlbumGallery**: Displays the gallery of artifacts that users can browse.
- **ImageModal**: Displays image artifacts with AI-enhanced descriptions and voice interaction.
- **3DModelDetails**: Displays 3D model artifacts with AI-enhanced descriptions and voice interaction.
- **QRScanner**: Handles QR code scanning and matching to artifacts.
- **ArtifactHandler**: Manages artifact navigation and displaying the correct artifact detail view.
- **ApiKeyNotification**: Notifies users when the OpenAI API key is not configured properly.

### Utility Services

- **openaiService.ts**: Provides functions for interacting with the OpenAI API:
  - `generateArtifactDescription`: Enhances artifact descriptions
  - `voiceToText`: Converts voice recordings to text
  - `generateArtifactResponse`: Generates AI responses to user questions
  - `textToSpeech`: Converts text to speech
  - `enhanceMediaItems`: Adds detailed information to all media items

- **qrCodeUtils.ts**: Utilities for QR code handling:
  - `matchQRCodeToArtifact`: Matches QR code scan results to artifacts
  - `navigateToArtifact`: Navigates to the correct artifact detail view
  - `createArtifactQRCodeURL`: Creates URLs for QR code generation

- **useVoiceAI.ts**: Custom hook that manages voice interaction:
  - Recording and processing voice input
  - Handling conversation state
  - Managing audio playback

- **apiConfig.ts**: Manages OpenAI API key configuration:
  - `isApiKeyConfigured`: Checks if the API key is properly configured
  - `useApiKeyStatus`: Hook for monitoring API key status

- **albumData.ts**: Contains artifact data and utilities:
  - `mediaItems`: Array of artifact data
  - `getArtifactById`: Finds artifacts by ID or title
  - `getVideoForThumbnail`: Maps video files to thumbnails

### Development Tools

- **qrCodeGenerator.ts**: Helps generate QR codes for testing:
  - `generateQRCodeFormats`: Creates different format options for QR codes
  - `generateAllArtifactQRCodes`: Generates QR codes for all artifacts

## Data Flow

1. User starts the application (App.tsx)
2. App shows the gallery of artifacts (AlbumGallery)
3. User can interact in multiple ways:
   - Click on an artifact to view details (ImageModal or 3DModelDetails)
   - Scan a QR code (QRScanner) to navigate to an artifact
   - Use voice interaction to get information about artifacts

4. Voice interaction flow:
   - User clicks the microphone button
   - `useVoiceAI` hook records the user's question
   - Recording is sent to OpenAI via `voiceToText`
   - Question is processed using `generateArtifactResponse`
   - Response is converted to speech using `textToSpeech`
   - Response is played back to the user

5. QR code scanning flow:
   - User scans a QR code with the QRScanner
   - QR code is processed by `matchQRCodeToArtifact`
   - If a match is found, user is navigated to the artifact
   - If no match is found, an error message is shown

## Environment Setup

The application requires an OpenAI API key for AI features to work:
- API key is stored in `.env` file: `VITE_OPENAI_API_KEY`
- `apiConfig.ts` checks if the key is properly configured
- `ApiKeyNotification` shows a warning if the key is missing or invalid

## Security Considerations

- API key is stored in environment variables, not hardcoded
- `.env` file is included in `.gitignore` to prevent accidental exposure
- Users are warned when API key is not properly configured
