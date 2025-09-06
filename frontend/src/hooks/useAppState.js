import { useState, useEffect, useMemo } from 'react';
import { checkApiConfiguration } from '../config/api';

export const useAppState = () => {
  const [apiStatus, setApiStatus] = useState({ isConfigured: false, message: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [contentList, setContentList] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ isConnected: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Check API configuration on component mount
  const apiConfigStatus = useMemo(() => checkApiConfiguration(), []);
  
  useEffect(() => {
    setApiStatus(apiConfigStatus);
    
    if (!apiConfigStatus.isConfigured) {
      setError(apiConfigStatus.message);
    }
  }, [apiConfigStatus]);

  // Check backend connection status
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const { testBackendConnection } = await import('../services/backendService.js');
        const status = await testBackendConnection();
        setBackendStatus(status);
      } catch (error) {
        setBackendStatus({ isConnected: false, message: 'Backend service not available' });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBackendStatus();
  }, []);

  // Auto-hide success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Create message setter object
  const setMessage = {
    error: setError,
    success: setSuccess
  };

  // Clear all messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Handle content updates
  const handleContentUpdate = (content) => {
    setContentList(content);
  };

  // Handle error retry
  const handleErrorRetry = () => {
    setError(null);
  };

  // Handle error dismiss
  const handleErrorDismiss = () => {
    setError(null);
  };

  return {
    apiStatus,
    error,
    success,
    activeTab,
    setActiveTab,
    contentList,
    backendStatus,
    isLoading,
    setMessage,
    clearMessages,
    handleContentUpdate,
    handleErrorRetry,
    handleErrorDismiss
  };
};
