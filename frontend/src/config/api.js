// API Configuration for LicenZ
// Get your free API keys from the links below

export const API_CONFIG = {
  // Stability AI (Stable Diffusion) - FREE TIER AVAILABLE
  // Get your key: https://platform.stability.ai/
  STABILITY_API_KEY: import.meta.env.VITE_STABILITY_API_KEY || 'YOUR_STABILITY_API_KEY_HERE',
  
  // Verbwire (NFT Minting & Licensing) - FREE TIER AVAILABLE
  // Get your key: https://www.verbwire.com/
  VERBWIRE_API_KEY: import.meta.env.VITE_VERBWIRE_API_KEY || 'YOUR_VERBWIRE_API_KEY_HERE',
  
  // Alternative AI services (optional)
  // OpenAI (DALL-E) - https://platform.openai.com/
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE',
  
  // Replicate (various AI models) - https://replicate.com/
  REPLICATE_API_KEY: import.meta.env.VITE_REPLICATE_API_KEY || 'YOUR_REPLICATE_API_KEY_HERE',
  
  // Backend API URL
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
};

// API Endpoints
export const API_ENDPOINTS = {
  STABILITY: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
  OPENAI: 'https://api.openai.com/v1/images/generations',
  REPLICATE: 'https://api.replicate.com/v1/predictions',
  BACKEND: {
    HEALTH: `${API_CONFIG.BACKEND_URL}/health`,
    GENERATE: `${API_CONFIG.BACKEND_URL}/api/generate`,
    LICENSE: `${API_CONFIG.BACKEND_URL}/api/license`,
    NFT: `${API_CONFIG.BACKEND_URL}/api/nft`,
  }
};

// Free tier limits
export const FREE_TIER_LIMITS = {
  STABILITY: '25 free generations per month',
  OPENAI: 'Free tier available with credits',
  REPLICATE: 'Free tier available with credits',
};

// Check if API keys are properly configured
export const checkApiConfiguration = () => {
  const missingKeys = [];
  
  if (!API_CONFIG.STABILITY_API_KEY || API_CONFIG.STABILITY_API_KEY === 'YOUR_STABILITY_API_KEY_HERE') {
    missingKeys.push('STABILITY_API_KEY');
  }
  
  // Verbwire is optional but recommended for NFT minting
  if (!API_CONFIG.VERBWIRE_API_KEY || API_CONFIG.VERBWIRE_API_KEY === 'YOUR_VERBWIRE_API_KEY_HERE') {
    missingKeys.push('VERBWIRE_API_KEY (optional but recommended)');
  }
  
  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
    message: missingKeys.length > 0 
      ? `Missing API keys: ${missingKeys.join(', ')}. Please configure them in your .env file.`
      : 'All required API keys are configured.'
  };
};
