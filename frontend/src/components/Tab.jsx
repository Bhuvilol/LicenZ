import React from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';

const Tab = ({ generatedContent, walletConnected, onDisconnect }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Wallet Connection Status */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <WalletIcon className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Wallet Connected
            </h3>
            
            <p className="text-gray-600 mb-4">
              Your MetaMask wallet is connected and ready for blockchain operations.
            </p>
            
            {/* Wallet Address Display */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-gray-800 break-all">
                {generatedContent?.walletAddress || '0x742d35Cc6634C0532925a3b8D404d2E5B4C9a8a8'}
              </p>
            </div>
            
            <button
              onClick={onDisconnect}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Tab;
