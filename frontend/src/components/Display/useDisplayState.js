import { useState, useEffect } from 'react';

/**
 * Custom hook for managing Display component state
 * Separates state logic from UI rendering
 */
export const useDisplayState = (isMinting) => {
  // UI state
  const [showFullImage, setShowFullImage] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showFullHash, setShowFullHash] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Progress state
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [mintingProgress, setMintingProgress] = useState(0);
  const [mintingStep, setMintingStep] = useState('preparing');

  // Simulate minting progress
  useEffect(() => {
    if (isMinting) {
      const interval = setInterval(() => {
        setMintingProgress(prev => {
          if (prev >= 100) return 100;
          const increment = Math.random() * 20;
          const newProgress = prev + increment;
          
          // Update step based on progress
          if (newProgress < 25) setMintingStep('preparing');
          else if (newProgress < 50) setMintingStep('uploading');
          else if (newProgress < 75) setMintingStep('minting');
          else setMintingStep('confirming');
          
          return newProgress;
        });
      }, 800);
      
      return () => clearInterval(interval);
    } else {
      setMintingProgress(0);
      setMintingStep('preparing');
    }
  }, [isMinting]);

  // Utility functions
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const resetProgress = () => {
    setDownloadProgress(0);
    setMintingProgress(0);
    setMintingStep('preparing');
  };

  return {
    // State
    showFullImage,
    shareModalOpen,
    showFullHash,
    copied,
    showNotification,
    notificationMessage,
    notificationType,
    downloadProgress,
    mintingProgress,
    mintingStep,
    
    // Setters
    setShowFullImage,
    setShareModalOpen,
    setShowFullHash,
    setDownloadProgress,
    
    // Actions
    copyToClipboard,
    showNotificationMessage,
    resetProgress
  };
};


