// runtimeConfig.ts
// This utility handles runtime environment variable configuration
// Especially useful for Vercel deployments where environment variables
// might be injected at runtime through window.env

/**
 * Get the OpenAI API key from multiple possible sources:
 * 1. Runtime environment (window.env) for production deployments
 * 2. Build-time environment variables
 */
export function getOpenAIApiKey(): string {
  // Check for runtime environment variables (set by runtime-env.js)
  const runtimeKey = (window as any).env?.VITE_OPENAI_API_KEY;
  
  // Fall back to build-time environment variables if runtime not available
  const buildTimeKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  
  // Return the first available key
  return runtimeKey || buildTimeKey;
}

/**
 * Check if a valid OpenAI API key is configured
 */
export function isValidApiKey(key: string): boolean {
  return !(!key || 
    key.trim() === '' ||
    key === 'your_openai_api_key' || 
    key === 'your_openai_api_key_here');
}

/**
 * Log API key details (masked for security)
 */
export function logApiKeyDetails(key: string): void {
  if (!key) {
    console.log('[runtimeConfig] No API key available');
    return;
  }
  
  try {
    if (key.length < 8) {
      console.log(`[runtimeConfig] API key appears invalid (length: ${key.length})`);
      return;
    }
    
    const firstFour = key.substring(0, 4);
    const lastFour = key.substring(key.length - 4);
    console.log(`[runtimeConfig] API key: ${firstFour}...${lastFour} (${key.length} chars)`);
  } catch (error) {
    console.log(`[runtimeConfig] Error logging API key details: ${error}`);
  }
}

/**
 * Get authorization header for OpenAI API requests
 */
export function getAuthHeader(): string {
  return `Bearer ${getOpenAIApiKey()}`;
}
