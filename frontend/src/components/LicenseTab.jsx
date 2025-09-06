import React from 'react';
import { 
  DocumentTextIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ArrowDownTrayIcon, 
  ArrowTopRightOnSquareIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

const LicenseTab = ({ 
  content, 
  walletConnected, 
  licenseForm, 
  setLicenseForm, 
  onCreateLicense, 
  isProcessing, 
  licenseResult,
  copied,
  onCopyToClipboard,
  onDownloadMetadata
}) => {
  if (!content) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Content Preview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content for Licensing</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
                    {content.ImageData ? (
          <img
            src={`data:image/png;base64,${content.ImageData}`}
                alt={content.prompt}
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                <DocumentTextIcon className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Prompt:</span>
              <p className="text-gray-900 mt-1">{content.prompt}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Hash:</span>
              <p className="text-sm text-gray-500 font-mono break-all mt-1">
                {content.content_hash}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* License Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">License Terms</h3>
        
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Terms
            </label>
            <textarea
              value={licenseForm.terms}
              onChange={(e) => setLicenseForm(prev => ({ ...prev, terms: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Standard license for commercial use"
            />
          
          </div>
        </div>
      </div>

      {/* Create License Button */}
      <div className="text-center">
        <button
          onClick={onCreateLicense}
          disabled={!walletConnected || isProcessing}
          className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto ${
            !walletConnected
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isProcessing
              ? 'bg-blue-300 text-blue-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Creating License...
            </>
          ) : !walletConnected ? (
            <>
              <ExclamationCircleIcon className="w-5 h-5" />
              Connect Wallet First
            </>
          ) : (
            <>
              <DocumentTextIcon className="w-5 h-5" />
              Create License
            </>
          )}
        </button>
        
        {!walletConnected && (
        )}
      </div>

      {/* License Result */}
      {licenseResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">License Created Successfully!</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-700">License ID:</span>
              <span className="ml-2 text-green-600 font-mono">
                {licenseResult.licenseId?.slice(0, 12)}...{licenseResult.licenseId?.slice(-8)}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-green-700">Price:</span>
              <span className="ml-2 text-green-600">{licenseResult.price} ETH</span>
            </div>
            
            <div>
              <span className="font-medium text-green-700">Terms:</span>
              <p className="ml-2 text-green-600 mt-1">{licenseResult.terms}</p>
            </div>
            
            {licenseResult.transactionHash && (
              <div>
                <span className="font-medium text-green-700">Transaction:</span>
                <span className="ml-2 text-green-600 font-mono">
                  {licenseResult.transactionHash.slice(0, 12)}...{licenseResult.transactionHash.slice(-8)}
                </span>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex space-x-3 mt-4 pt-4 border-t border-green-200">
            <button
              onClick={() => onDownloadMetadata(licenseResult, 'license-metadata.json')}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download Metadata
            </button>
            
            <button
              onClick={() => onCopyToClipboard(JSON.stringify(licenseResult, null, 2))}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-2"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseTab;
