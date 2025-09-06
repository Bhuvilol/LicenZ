import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowTopRightOnSquareIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';

const SimpleWalletGate = ({ onWalletChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [selectedChain, setSelectedChain] = useState(11155111); // Sepolia by default
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Check MetaMask status and provide detailed feedback
  const checkMetaMaskStatus = () => {
    if (typeof window === 'undefined') {
      return { installed: false, message: 'Running in SSR environment' };
    }
    
    if (!window.ethereum) {
      return { installed: false, message: 'No Ethereum provider detected' };
    }
    
    if (!window.ethereum.isMetaMask) {
      return { installed: false, message: 'Ethereum provider found but not MetaMask' };
    }
    
    if (window.ethereum.selectedAddress === null) {
      return { installed: true, message: 'MetaMask is locked - please unlock to continue' };
    }
    
    return { installed: true, message: 'MetaMask is ready' };
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    if (typeof window === 'undefined') return false;
    
    // Check for MetaMask specifically
    if (window.ethereum && window.ethereum.isMetaMask) {
      return true;
    }
    
    // Check for other wallet providers that might be present
    if (window.ethereum) {
      console.log('Ethereum provider found but not MetaMask:', window.ethereum);
    }
    
    return false;
  };

  // Connect wallet
  const connectWallet = async () => {
    console.log('Attempting to connect wallet...');
    console.log('Window ethereum object:', window.ethereum);
    console.log('MetaMask installed:', isMetaMaskInstalled());
    
    // Clear any previous errors
    setConnectionError('');
    
    if (!isMetaMaskInstalled()) {
      console.error('MetaMask not detected');
      alert('MetaMask is not installed! Please install MetaMask extension.');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Check if MetaMask is locked
      if (window.ethereum.selectedAddress === null) {
        console.log('MetaMask is locked, requesting unlock...');
      }
      
      // Request account access
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainIdInt = parseInt(currentChainId, 16);
        
        setIsConnected(true);
        setAddress(accounts[0]);
        setChainId(currentChainIdInt);
        
        // Try to switch to selected network if different
        if (currentChainIdInt !== selectedChain) {
          try {
            await switchNetwork(selectedChain);
          } catch (switchError) {
            console.warn('Could not auto-switch network:', switchError);
            // Show user-friendly message
            alert(`Connected to ${getNetworkName(currentChainIdInt)}. Please manually switch to ${getNetworkName(selectedChain)} in MetaMask to see your balance.`);
          }
        }
        
        // Notify parent component
        if (onWalletChange) {
          onWalletChange(true, {
            account: accounts[0],
            chainId: currentChainIdInt,
            provider: window.ethereum,
            signer: null
          });
        }
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionError(error.message);
      
      if (error.code === 4001) {
        alert('Connection was rejected by user.');
      } else {
        alert('Failed to connect wallet: ' + error.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet - PERMANENT DISCONNECT
  const disconnectWallet = () => {
    console.log('Starting permanent disconnect...');
    
    try {
      // 1. Clear all local storage
      localStorage.clear();
      console.log('LocalStorage cleared');
      
      // 2. Clear all session storage
      sessionStorage.clear();
      console.log('SessionStorage cleared');
      
      // 3. Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      console.log('Cookies cleared');
      
      // 4. Clear local state
      setIsConnected(false);
      setAddress('');
      setChainId('');
      
      // 5. Notify parent component
      if (onWalletChange) {
        onWalletChange(false, null);
      }
      
      // 6. Clear any MetaMask state
      if (window.ethereum) {
        try {
          // Remove all listeners
          if (window.ethereum.removeAllListeners) {
            window.ethereum.removeAllListeners();
          }
          console.log('MetaMask listeners cleared');
        } catch (e) {
          console.warn('Could not clear MetaMask listeners:', e);
        }
      }
      
      // 7. Force disconnect from MetaMask
      if (window.ethereum && window.ethereum.disconnect) {
        try {
          window.ethereum.disconnect();
          console.log('MetaMask disconnect called');
        } catch (e) {
          console.warn('Could not call MetaMask disconnect:', e);
        }
      }
      
      // 8. Clear any remaining state
      console.log('Clearing remaining state...');
      
      // 9. Force page refresh to clear everything
      console.log('Force refreshing page...');
      setTimeout(() => {
        window.location.href = window.location.href.split('?')[0];
      }, 100);
      
    } catch (error) {
      console.error('Disconnect failed:', error);
      // Force refresh anyway
      console.log('Force refreshing page due to error...');
      window.location.reload();
    }
  };

  // Switch network
  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
      
      // Update local state
      setChainId(targetChainId);
      
      // Notify parent component
      if (onWalletChange && isConnected) {
        onWalletChange(true, {
          account: address,
          chainId: targetChainId,
          provider: window.ethereum,
          signer: null
        });
      }
      
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, try to add it
        try {
          await addNetwork(targetChainId);
        } catch (addError) {
          throw new Error(`Failed to add network: ${addError.message}`);
        }
      } else {
        throw error;
      }
    }
  };

  // Add network to MetaMask
  const addNetwork = async (chainId) => {
    const networkConfig = getNetworkConfig(chainId);
    if (!networkConfig) {
      throw new Error('Unsupported network');
    }
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig]
    });
  };

  // Get network configuration
  const getNetworkConfig = (chainId) => {
    switch (chainId) {
      case 11155111: // Sepolia
        return {
          chainId: '0xaa36a7',
          chainName: 'Sepolia Testnet',
          nativeCurrency: {
            name: 'Sepolia Ether',
            symbol: 'SEP',
            decimals: 18
          },
          rpcUrls: ['https://sepolia.infura.io/v3/727cce12a9184adc88b59b9ae69ef7f7'],
          blockExplorerUrls: ['https://sepolia.etherscan.io']
        };
      case 1: // Mainnet
        return {
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.infura.io/v3/727cce12a9184adc88b59b9ae69ef7f7'],
          blockExplorerUrls: ['https://etherscan.io']
        };
      default:
        return null;
    }
  };

  // Get network name
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon';
      case 8453: return 'Base';
      default: return `Chain ${chainId}`;
    }
  };

  // Get network icon
  const getNetworkIcon = (chainId) => {
    switch (chainId) {
      case 1: return '🔵';
      case 11155111: return '🟢';
      case 137: return '🟣';
      case 8453: return '🔵';
      default: return '⚫';
    }
  };

  // Connected state
  if (isConnected && address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center">
            {/* Success Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-xl">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Wallet Connected! 🎉
            </h2>
            <p className="text-gray-600 mb-8 text-lg">Your MetaMask wallet is successfully connected.</p>
            
            {/* Address */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 mb-6 border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-3">Connected Address:</div>
              <div className="font-mono text-sm bg-white p-3 rounded-xl border-2 border-gray-200 shadow-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            </div>
            
            {/* Current Network */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-200">
              <div className="text-sm font-semibold text-blue-800 mb-3">Current Network:</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{getNetworkIcon(chainId)}</span>
                <span className="font-semibold text-blue-700">{getNetworkName(chainId)}</span>
              </div>
            </div>
            
            {/* Network Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5 mb-8">
              <div className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" />
                Network Status
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <div className="flex justify-between">
                  <span><strong>Current:</strong></span>
                  <span>{getNetworkName(chainId)} (ID: {chainId})</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Selected:</strong></span>
                  <span>{getNetworkName(selectedChain)} (ID: {selectedChain})</span>
                </div>
                {chainId !== selectedChain && (
                  <div className="text-orange-600 mt-3 font-medium p-3 bg-orange-50 rounded-xl border border-orange-200">
                    ⚠️ You need to switch networks to see your Sepolia balance
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-4">
              {/* Network Switch */}
              <button
                onClick={() => switchNetwork(selectedChain)}
                disabled={chainId === selectedChain}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none"
              >
                {chainId === selectedChain 
                  ? `✅ Connected to ${getNetworkName(selectedChain)}`
                  : `🔄 Switch to ${getNetworkName(selectedChain)}`
                }
              </button>
              
              {/* Disconnect */}
              <button
                onClick={disconnectWallet}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔌 Disconnect Wallet (Permanent)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not connected state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center">
          {/* Main Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto flex items-center justify-center shadow-xl">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Welcome to LicenZ
          </h1>
          <p className="text-gray-600 mb-6 text-lg">Connect your MetaMask wallet to start creating, licensing, and monetizing AI content.</p>
          
          {/* Instructions */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5 mb-8">
            <div className="text-sm text-yellow-800">
              <div className="font-semibold mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Important Information
              </div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Select <strong>Sepolia Testnet</strong> for free testing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Make sure MetaMask is on the same network
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Get free Sepolia ETH from <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">Sepolia Faucet</a>
                </li>
              </ul>
            </div>
          </div>

          {/* MetaMask Status Display */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 mb-8">
            <div className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4" />
              MetaMask Status
            </div>
            <div className="text-sm text-blue-700">
              {(() => {
                const status = checkMetaMaskStatus();
                return (
                  <div className={`flex items-center space-x-2 ${status.installed ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${status.installed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{status.message}</span>
                  </div>
                );
              })()}
            </div>
            {connectionError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-700 font-medium">Connection Error:</div>
                <div className="text-xs text-red-600 mt-1">{connectionError}</div>
              </div>
            )}
          </div>
          
          {/* Network Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Network
            </label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(Number(e.target.value))}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-lg"
            >
              <option value={11155111}>🟢 Sepolia Testnet (Recommended)</option>
              <option value={1}>🔵 Ethereum Mainnet</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              {selectedChain === 11155111 ? 'Free testnet for development and testing' : 'Real network with actual costs'}
            </p>
          </div>
          
          {/* Connect Button */}
          <button
            onClick={connectWallet}
            disabled={isConnecting || !isMetaMaskInstalled()}
            className="group w-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 hover:from-purple-600 hover:via-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:transform-none"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Connecting...</span>
              </div>
            ) : !isMetaMaskInstalled() ? (
              <div className="flex items-center justify-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6" />
                <span className="text-lg">MetaMask Not Installed</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <BoltIcon className="w-6 h-6 group-hover:animate-pulse" />
                <span className="text-lg">Connect MetaMask Wallet</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            )}
          </button>
          
          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Don't have MetaMask? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600 font-medium hover:underline">Download here</a>
            </p>
            <p className="flex items-center justify-center gap-2">
              <BoltIcon className="w-4 h-4" />
              Need testnet ETH? <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-medium hover:underline">Get free Sepolia ETH</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleWalletGate;
