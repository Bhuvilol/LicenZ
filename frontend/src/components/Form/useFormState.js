import { useState, useEffect } from 'react';

/**
 * Custom hook for managing Form component state and logic
 * Separates form logic from UI rendering
 */
export const useFormState = (prompt, isGenerating) => {
  // Form state
  const [promptLength, setPromptLength] = useState(0);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Update prompt length
  useEffect(() => {
    setPromptLength(prompt.length);
  }, [prompt]);

  // Simulate generation progress
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 15;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setGenerationProgress(0);
    }
  }, [isGenerating]);

  // Utility functions
  const togglePromptPreview = () => {
    setShowPromptPreview(!showPromptPreview);
  };

  const resetProgress = () => {
    setGenerationProgress(0);
  };

  return {
    // State
    promptLength,
    showPromptPreview,
    generationProgress,
    
    // Actions
    togglePromptPreview,
    resetProgress
  };
};




