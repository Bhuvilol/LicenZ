import React from 'react';
import { 
  SignalIcon, 
  BeakerIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const NetworkStatus = ({ 
  networkStatus, 
  networkTestResult, 
  isRefreshingNetwork, 
  isTestingNetwork, 
  onRefreshNetwork, 
  onTestNetwork 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'correct':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'wrong':
        return 'text-red-600 bg-red-100 border-red-300';
      case 'checking':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'wrong':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>;
      default:
        return <SignalIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'correct':
        return 'Network Ready';
      case 'wrong':
        return 'Wrong Network';
      case 'checking':
        return 'Checking Network...';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">Network Status</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefreshNetwork}
            disabled={isRefreshingNetwork}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Refresh network status"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshingNetwork ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onTestNetwork}
            disabled={isTestingNetwork}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Test network connection"
          >
            <BeakerIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(networkStatus)}`}>
        {getStatusIcon(networkStatus)}
        <span>{getStatusText(networkStatus)}</span>
      </div>

      {/* Network Test Result */}
      {networkTestResult && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <BeakerIcon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-800 mb-1">Network Test Result:</p>
              <p className="text-gray-600">{networkTestResult}</p>
            </div>
          </div>
        </div>
      )}

      {/* Network Information */}
      <div className="mt-3 text-xs text-gray-500">
        <p>Expected: Hardhat Local Network (Chain ID: 31337)</p>
        <p>Status: {networkStatus === 'correct' ? '✅ Connected' : networkStatus === 'wrong' ? '❌ Wrong Network' : '⏳ Checking...'}</p>
      </div>
    </div>
  );
};

export default NetworkStatus;
