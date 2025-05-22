import { mediaItems } from './albumData';

/**
 * Check if a QR code result matches an artifact
 * @param qrResult The scan result from QR code scanner
 * @returns The matching artifact or null if none found
 */
export function matchQRCodeToArtifact(qrResult: string) {
  // Different possible QR code formats to handle
  const qrPatterns = [
    /^museum-artifact:(.+)$/,       // Standard museum format
    /^artifact:(.+)$/,              // Short format
    /^\/artifacts\/(.+)$/,          // URL path format
    /^https?:\/\/[^\/]+\/artifacts\/(.+)$/  // Full URL format
  ];
  
  // Extract the ID from the QR code
  let artifactId: string | null = null;
  
  for (const pattern of qrPatterns) {
    const match = qrResult.match(pattern);
    if (match && match[1]) {
      artifactId = match[1].trim().toLowerCase();
      break;
    }
  }
  
  if (!artifactId) {
    return null;
  }
  
  // Try to match with an artifact
  return mediaItems.find(item => {
    // Try different matching strategies
    const normalizedTitle = item.title.replace(/\s+/g, '-').toLowerCase();
    
    return (
      normalizedTitle === artifactId ||
      item.title.toLowerCase().includes(artifactId) ||
      (item.title.toLowerCase().replace(/\s+/g, '') === artifactId.replace(/\s+/g, '')) ||
      (item.description.toLowerCase().includes(artifactId))
    );
  }) || null;
}

/**
 * Navigate to an artifact detail view
 * @param artifactId The ID of the artifact to navigate to
 * @param showChat Whether to immediately show the chat interface
 */
export function navigateToArtifact(artifactId: string, showChat: boolean = false) {
  // Store the ID in localStorage for the ArtifactHandler to pick up
  localStorage.setItem('currentArtifactId', artifactId);
  
  // Set flag to show chat interface if requested
  if (showChat) {
    localStorage.setItem('showArtifactChat', 'true');
  }
  
  // Add the artifact ID to the URL hash
  window.location.hash = `artifact:${artifactId}`;
  
  // Dispatch a custom event that components can listen for
  window.dispatchEvent(new CustomEvent('artifactSelected', {
    detail: { artifactId, showChat }
  }));
}

/**
 * Creates a URL for QR code generation for a specific artifact
 */
export function createArtifactQRCodeURL(artifact: typeof mediaItems[0]): string {
  const artifactId = artifact.title.replace(/\s+/g, '-').toLowerCase();
  return `museum-artifact:${artifactId}`;
}
