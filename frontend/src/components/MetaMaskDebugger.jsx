import React, { useState, useEffect } from 'react';

const MetaMaskDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const collectDebugInfo = () => {
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ethereum: {
        exists: typeof window !== 'undefined' && !!window.ethereum,
        isMetaMask: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
        selectedAddress: typeof window !== 'undefined' && window.ethereum?.selectedAddress,
        chainId: typeof window !== 'undefined' && window.ethereum?.chainId,
        isConnected: typeof window !== 'undefined' && window.ethereum?.isConnected?.(),
        networkVersion: typeof window !== 'undefined' && window.ethereum?.networkVersion,
        providerState: typeof window !== 'undefined' && window.ethereum?.providerState,
      },
      window: {
        innerWidth: typeof window !== 'undefined' ? window.innerWidth : 'N/A',
        innerHeight: typeof window !== 'undefined' ? window.innerHeight : 'N/A',
        location: typeof window !== 'undefined' ? window.location.href : 'N/A',
      },
      localStorage: {
        available: typeof window !== 'undefined' && !!window.localStorage,
        keys: typeof window !== 'undefined' ? Object.keys(window.localStorage) : [],
      },
      sessionStorage: {
        available: typeof window !== 'undefined' && !!window.sessionStorage,
        keys: typeof window !== 'undefined' ? Object.keys(window.sessionStorage) : [],
      },
    };

    setDebugInfo(info);
    return info;
  };

  const refreshDebugInfo = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      collectDebugInfo();
      setIsRefreshing(false);
    }, 100);
  };

  const testConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        alert(`Connection test successful! Accounts: ${JSON.stringify(accounts)}`);
      } else {
        alert('No Ethereum provider found');
      }
    } catch (error) {
      alert(`Connection test failed: ${error.message}`);
    }
  };

  useEffect(() => {
    collectDebugInfo();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">MetaMask Debug Information</h2>
        <div className="space-x-2">
          <button
            onClick={refreshDebugInfo}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Connection
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Ethereum Provider Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Provider Exists:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${debugInfo.ethereum?.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.ethereum?.exists ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Is MetaMask:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${debugInfo.ethereum?.isMetaMask ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.ethereum?.isMetaMask ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Selected Address:</span>
              <span className="ml-2 font-mono text-xs">
                {debugInfo.ethereum?.selectedAddress || 'None'}
              </span>
            </div>
            <div>
              <span className="font-medium">Chain ID:</span>
              <span className="ml-2 font-mono text-xs">
                {debugInfo.ethereum?.chainId || 'None'}
              </span>
            </div>
            <div>
              <span className="font-medium">Is Connected:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${debugInfo.ethereum?.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.ethereum?.isConnected ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Network Version:</span>
              <span className="ml-2 font-mono text-xs">
                {debugInfo.ethereum?.networkVersion || 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Browser Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">User Agent:</span>
              <span className="ml-2 font-mono text-xs break-all">
                {debugInfo.userAgent}
              </span>
            </div>
            <div>
              <span className="font-medium">Window Size:</span>
              <span className="ml-2">
                {debugInfo.window?.innerWidth} x {debugInfo.window?.innerHeight}
              </span>
            </div>
            <div>
              <span className="font-medium">Current URL:</span>
              <span className="ml-2 font-mono text-xs break-all">
                {debugInfo.window?.location}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Storage Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">LocalStorage:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${debugInfo.localStorage?.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.localStorage?.available ? 'Available' : 'Not Available'}
              </span>
              {debugInfo.localStorage?.available && (
                <div className="mt-1 text-xs text-gray-600">
                  Keys: {debugInfo.localStorage?.keys?.length || 0}
                </div>
              )}
            </div>
            <div>
              <span className="font-medium">SessionStorage:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${debugInfo.sessionStorage?.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.sessionStorage?.available ? 'Available' : 'Not Available'}
              </span>
              {debugInfo.sessionStorage?.available && (
                <div className="mt-1 text-xs text-gray-600">
                  Keys: {debugInfo.sessionStorage?.keys?.length || 0}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Raw Ethereum Object</h3>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
            {JSON.stringify(debugInfo.ethereum, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Timestamp</h3>
          <div className="text-sm text-gray-600">
            Last updated: {debugInfo.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskDebugger;

