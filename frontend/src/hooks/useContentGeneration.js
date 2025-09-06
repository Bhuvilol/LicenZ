import { useState, useCallback } from 'react';
import { generateAIImage, validateGenerationParams } from '../services/aiService';

export const useContentGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('photographic');
  const [generationOptions, setGenerationOptions] = useState({
    cfg_scale: 7,
    steps: 30,
    height: 1024,
    width: 1024
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleGenerate = useCallback(async (e, walletAddress) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const validation = validateGenerationParams(generationOptions);
    if (!validation.isValid) {
      return {
        error: `Invalid parameters: ${validation.errors.join(', ')}`
      };
    }

    setIsGenerating(true);
    
    try {
      const result = await generateAIImage(prompt, {
        style_preset: selectedStyle,
        ...generationOptions
      }, walletAddress);
      
      const contentWithWallet = {
        ...result,
        wallet_address: walletAddress,
        user_id: walletAddress,
        UserID: walletAddress,
        created_at: new Date().toISOString()
      };
      
      setGeneratedContent(contentWithWallet);
      
      if (result.backendId) {
        return {
          success: 'AI image generated and saved to backend successfully!',
          content: contentWithWallet
        };
      } else {
        return {
          success: 'AI image generated successfully! (Backend save failed)',
          content: contentWithWallet
        };
      }
    } catch (error) {
      return {
        error: error.message
      };
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, generationOptions]);

  const resetGeneration = useCallback(() => {
    setGeneratedContent(null);
    setPrompt('');
  }, []);

  return {
    prompt,
    setPrompt,
    isGenerating,
    generatedContent,
    selectedStyle,
    setSelectedStyle,
    generationOptions,
    setGenerationOptions,
    showAdvancedOptions,
    setShowAdvancedOptions,
    handleGenerate,
    resetGeneration
  };
};
