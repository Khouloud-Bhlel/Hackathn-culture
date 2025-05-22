import React, { useEffect, useState } from 'react';
import { getEnhancedArtifactById, loadEnhancedArtifacts, EnhancedMediaItem } from '../utils/enhancedArtifacts';
import ImageModal from './ImageModal';
import ModelDetails from './3DModelDetails';

/**
 * This component handles artifact deep links and displays the relevant content.
 * It checks localStorage for any stored artifact ID and displays the relevant content.
 */
const ArtifactHandler: React.FC = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<EnhancedMediaItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load enhanced artifacts data on component mount
  useEffect(() => {
    loadEnhancedArtifacts().then(() => {
      setDataLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;

    // Check if there's a stored artifact ID
    const artifactId = localStorage.getItem('currentArtifactId');
    // Check if we should show chat interface immediately
    const showChatFlag = localStorage.getItem('showArtifactChat') === 'true';
    
    if (artifactId) {
      // Find the corresponding artifact in the media items using the utility
      const artifact = getEnhancedArtifactById(artifactId);
      
      if (artifact) {
        setSelectedArtifact(artifact);
        setVisible(true);
        setShowChat(showChatFlag);
        
        // Clear the stored IDs so they don't trigger again on page refreshes
        localStorage.removeItem('currentArtifactId');
        localStorage.removeItem('showArtifactChat');
      }
    }
    
    // Check URL hash for direct links
    const hashParam = window.location.hash;
    if (hashParam && hashParam.startsWith('#artifact:')) {
      const id = hashParam.substring('#artifact:'.length);
      // Find the corresponding artifact using the utility
      const artifact = getEnhancedArtifactById(id);
      
      if (artifact) {
        setSelectedArtifact(artifact);
        setVisible(true);
      }
    }
  }, [dataLoaded]);

  // If nothing to display, render nothing
  if (!selectedArtifact || !visible) {
    return null;
  }

  const handleClose = () => {
    setVisible(false);
    setShowChat(false);
    
    // Remove the hash from the URL
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  // Render the appropriate detail component based on artifact type
  return (
    <>
      {selectedArtifact.type === '3d' && (
        <ModelDetails 
          model={selectedArtifact} 
          onClose={handleClose} 
          initialShowChat={showChat}
        />
      )}
      
      {(selectedArtifact.type === 'images' || selectedArtifact.type === 'videos') && (
        <ImageModal 
          image={selectedArtifact} 
          onClose={handleClose} 
          initialShowChat={showChat}
        />
      )}
    </>
  );
};

export default ArtifactHandler;