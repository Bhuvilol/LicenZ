import { useState, useCallback } from 'react';
import blockchainService from '../services/blockchainService';

export const useWallet = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const handleWalletChange = useCallback((connected, walletData) => {
    setIsWalletConnected(connected);
    setWalletData(walletData);
    
    if (connected && walletData) {
      blockchainService.setWalletData(walletData);
      return {
        success: `Wallet connected successfully! Address: ${walletData.account.slice(0, 6)}...${walletData.account.slice(-4)}`,
        shouldResetTab: true
      };
    } else {
      blockchainService.setWalletData(null);
      return {
        success: 'Wallet disconnected',
        shouldResetTab: false
      };
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsWalletConnected(false);
    setWalletData(null);
  }, []);

  const getCurrentWalletAddress = useCallback(() => {
    if (isWalletConnected && walletData && walletData.account) {
      return walletData.account;
    }
    return null;
  }, [isWalletConnected, walletData]);

  return {
    isWalletConnected,
    walletData,
    handleWalletChange,
    handleDisconnect,
    getCurrentWalletAddress
  };
};
