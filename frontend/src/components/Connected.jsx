import React from 'react';
import { 
  WalletIcon, 
  DocumentDuplicateIcon, 
  CheckCircleIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const WalletConnectedState = ({ 
  walletState, 
  onCopyAddress, 
  onDisconnect, 
  copied 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <WalletIcon className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Wallet Connected
        </h3>
        
        <p className="text-gray-600">
          Your MetaMask wallet is connected and ready for blockchain operations.
        </p>
      </div>

      {/* Wallet Information */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Account Address</span>
            <button
              onClick={() => onCopyAddress(walletState.account)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy address"
            >
              {copied ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm font-mono text-gray-900 break-all">
            {walletState.account}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <span className="text-sm font-medium text-gray-700">Network</span>
          <p className="text-sm text-gray-900 mt-1">
            {walletState.chainId === '0x7A69' ? 'Hardhat Local Network' : `Chain ID: ${walletState.chainId}`}
          </p>
        </div>

        {walletState.balance && (
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-sm font-medium text-gray-700">Balance</span>
            <p className="text-sm text-gray-900 mt-1">
              {parseFloat(walletState.balance).toFixed(4)} ETH
            </p>
          </div>
        )}
      </div>

      {/* Disconnect Button */}
      <div className="text-center">
        <button
          onClick={onDisconnect}
          className="px-6 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletConnectedState;
