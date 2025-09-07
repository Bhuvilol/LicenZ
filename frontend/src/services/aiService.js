import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, checkApiConfiguration } from '../config/api.js';
import { contentAPI, generationAPI } from './backendService.js';

// Generate AI image using Stability AI
export const generateAIImage = async (prompt, options = {}, walletAddress = null) => {
  console.log('Generating AI image with prompt:', prompt);
  
  // Check API configuration first
  const configCheck = checkApiConfiguration();
  if (!configCheck.isConfigured) {
    throw new Error(configCheck.message);
  }
  
  // Default generation parameters
  const generationParams = {
    text_prompts: [
      {
        text: prompt,
        weight: 1
      }
    ],
    cfg_scale: options.cfg_scale || 7,
    height: options.height || 1024,
    width: options.width || 1024,
    samples: 1,
    steps: options.steps || 30,
    style_preset: options.style_preset || "photographic",
  };

  console.log('Making API request to Stability AI...');
  
  // Make API request to Stability AI
  const response = await axios.post(API_ENDPOINTS.STABILITY, generationParams, {
    headers: {
      'Authorization': `Bearer ${API_CONFIG.STABILITY_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 60000,
  });

  if (response.data && response.data.artifacts && response.data.artifacts.length > 0) {
    const imageData = response.data.artifacts[0];
    
    console.log('Converting image data...');
    
    // Convert base64 image data to blob URL
    const imageBlob = base64ToBlob(imageData.base64, 'image/png');
    const imageUrl = URL.createObjectURL(imageBlob);
    
    // Generate content hash
    const contentHash = await generateContentHash(imageBlob);
    
    // Track generation in backend
    try {
      await generationAPI.trackGeneration({
        prompt: prompt,
        style: options.style_preset || 'photographic',
        cfg_scale: options.cfg_scale || 7,
        steps: options.steps || 30,
        height: options.height || 1024,
        width: options.width || 1024,
        wallet_address: walletAddress,
        user_id: walletAddress
      });
    } catch (error) {
      console.warn('Failed to track generation in backend:', error.message);
    }
    
    // Save content to backend
    try {
      const contentData = {
        prompt: prompt,
        style: options.style_preset || 'photographic',
        ImageData: imageData.base64,
        ContentHash: contentHash,
        seed: imageData.seed || 0,
        CFGScale: options.cfg_scale || 7,
        steps: options.steps || 30,
        height: options.height || 1024,
        width: options.width || 1024,
        model: 'stable-diffusion-xl-1024-v1-0',
        UserID: walletAddress
      };
      
      const savedContent = await contentAPI.createContent(contentData);
      console.log('Content saved to backend:', savedContent.data.id);
      
      return {
        id: savedContent.data.id,
        prompt: prompt,
        imageUrl: imageUrl,
        hash: contentHash,
        timestamp: new Date().toISOString(),
        status: 'generated',
        generationParams: generationParams,
        apiProvider: 'Stability AI',
        model: 'stable-diffusion-xl-1024-v1-0',
        seed: imageData.seed || null,
        finishReason: imageData.finishReason || 'SUCCESS',
        backendId: savedContent.data.id
      };
    } catch (error) {
      console.warn('Failed to save content to backend:', error.message);
      
      return {
        id: Date.now(),
        prompt: prompt,
        imageUrl: imageUrl,
        hash: contentHash,
        timestamp: new Date().toISOString(),
        status: 'generated',
        generationParams: generationParams,
        apiProvider: 'Stability AI',
        model: 'stable-diffusion-xl-1024-v1-0',
        seed: imageData.seed || null,
        finishReason: imageData.finishReason || 'SUCCESS',
        backendId: null
      };
    }
  } else {
    throw new Error('No image data received from API');
  }
};

// Convert base64 to blob
const base64ToBlob = (base64, mimeType) => {
  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    throw new Error('Failed to process image data');
  }
};

// Generate content hash using Web Crypto API
const generateContentHash = async (imageBlob) => {
  try {
    const arrayBuffer = await imageBlob.arrayBuffer();
    
    if (window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `0x${hashHex}`;
    } else {
      // Fallback for older browsers
      let hash = 0;
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < uint8Array.length; i++) {
        hash = ((hash << 5) - hash + uint8Array[i]) & 0xffffffff;
      }
      return `0x${hash.toString(16).padStart(64, '0')}`;
    }
  } catch (error) {
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }
};

// Get available style presets
export const getStylePresets = () => {
  return [
    { value: 'photographic', label: 'Photographic', description: 'Realistic photographic style' },
    { value: 'digital-art', label: 'Digital Art', description: 'Digital art and illustration' },
    { value: 'cinematic', label: 'Cinematic', description: 'Movie-like dramatic style' },
    { value: 'anime', label: 'Anime', description: 'Japanese anime style' },
    { value: 'fantasy-art', label: 'Fantasy Art', description: 'Fantasy and magical style' },
    { value: 'neon-punk', label: 'Neon Punk', description: 'Cyberpunk neon aesthetic' },
    { value: 'origami', label: 'Origami', description: 'Paper folding art style' },
    { value: 'modeling', label: '3D Modeling', description: '3D rendered style' }
  ];
};

// Get generation options
export const getGenerationOptions = () => {
  return {
    cfg_scale: {
      min: 1,
      max: 20,
      default: 7,
      description: 'How closely to follow the prompt'
    },
    steps: {
      min: 10,
      max: 50,
      default: 30,
      description: 'Quality vs speed trade-off'
    },
    height: [512, 768, 1024, 1152, 1344, 1536],
    width: [512, 768, 1024, 1152, 1344, 1536]
  };
};

// Validate generation parameters
export const validateGenerationParams = (options) => {
  const errors = [];
  const validOptions = getGenerationOptions();
  
  if (options.cfg_scale && (options.cfg_scale < validOptions.cfg_scale.min || options.cfg_scale > validOptions.cfg_scale.max)) {
    errors.push(`CFG Scale must be between ${validOptions.cfg_scale.min} and ${validOptions.cfg_scale.max}`);
  }
  
  if (options.steps && (options.steps < validOptions.steps.min || options.steps > validOptions.steps.max)) {
    errors.push(`Steps must be between ${validOptions.steps.min} and ${validOptions.steps.max}`);
  }
  
  if (options.height && !validOptions.height.includes(options.height)) {
    errors.push(`Height must be one of: ${validOptions.height.join(', ')}`);
  }
  
  if (options.width && !validOptions.width.includes(options.width)) {
    errors.push(`Width must be one of: ${validOptions.width.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
