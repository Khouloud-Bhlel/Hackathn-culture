// API configuration utility
import { useState, useEffect } from 'react';
import { getOpenAIApiKey, isValidApiKey, logApiKeyDetails } from './runtimeConfig';

// NOTE: This API key is now ONLY used for voice chat functionality and not for artifact enhancement
const API_KEY = getOpenAIApiKey();

// Log API key info for debugging (masked for security)
console.log(`[apiConfig] API Key configured: ${!!API_KEY}`);
logApiKeyDetails(API_KEY);

/**
 * Check if the OpenAI API key is properly configured
 * This is only used for voice chat features (not for artifact descriptions)
 */
export const isApiKeyConfigured = (): boolean => {
  // Always get the latest key (it might have been updated at runtime)
  const key = getOpenAIApiKey();
  const isValid = isValidApiKey(key);
  
  console.log(`[apiConfig] API key valid: ${isValid}`);
  return isValid;
};

/**
 * Custom hook to check if OpenAI API key is configured
 */
export const useApiKeyStatus = () => {
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // Small delay to prevent UI flashing
    const timer = setTimeout(() => {
      setIsConfigured(isApiKeyConfigured());
      setIsChecking(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return { isConfigured, isChecking };
};
