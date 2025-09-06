import React from 'react';
import { 
  WalletIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  SignalIcon, 
  BeakerIcon 
} from '@heroicons/react/24/outline';

const WalletDisconnectedState = ({ 
  onConnect, 
  isConnecting, 
  networkStatus, 
  networkTestResult 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <WalletIcon className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connect Your Wallet
        </h3>
        
        <p className="text-gray-600">
          Connect your MetaMask wallet to access LicenZ features.
        </p>
      </div>

      {/* Connect Button */}
      <div className="text-center mb-6">
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto ${
            isConnecting
              ? 'bg-purple-300 text-purple-600 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Connecting...
            </>
          ) : (
            <>
              <WalletIcon className="w-4 h-4" />
              Connect MetaMask
            </>
          )}
        </button>
      </div>

      {/* Prerequisites */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <ExclamationCircleIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm text-blue-800 font-medium">Prerequisites:</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• MetaMask installed & unlocked</li>
              <li>• Local blockchain running (npx hardhat node)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-green-50 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm text-green-800 font-medium">Features:</p>
            <p className="text-xs text-green-700 mt-1">
              AI content generation, NFT minting, and blockchain licensing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDisconnectedState;
