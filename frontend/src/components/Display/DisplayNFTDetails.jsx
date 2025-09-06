import React from 'react';
import { 
  CheckCircleIcon, 
  DocumentDuplicateIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';

/**
 * NFT Details component for minted content
 */
const DisplayNFTDetails = ({ 
  generatedContent, 
  copyToClipboard, 
  copied 
}) => {
  if (!generatedContent.NFTMinted) {
    return null;
  }

  return (
    <div className="mt-8">
      {/* Success Message */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-lg font-medium rounded-full border border-green-200">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <span>Content successfully minted as NFT! 🎉</span>
        </div>
      </div>
      
      {/* NFT Details */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <h4 className="text-xl font-bold text-green-800 mb-4 text-center">
            NFT Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Token ID:</span>
                <span className="font-medium text-green-700">#{generatedContent.NFTTokenID || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Chain:</span>
                <span className="font-medium text-green-700 capitalize">
                  {generatedContent.chain || 'Sepolia'}
                </span>
              </div>
              
              {generatedContent.contractAddress && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract:</span>
                  <span className="font-medium text-green-700 font-mono text-xs">
                    {generatedContent.contractAddress.slice(0, 8)}...
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {generatedContent.method && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium text-green-700 capitalize">
                    {generatedContent.method}
                  </span>
                </div>
              )}
              
              {generatedContent.mintedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Minted:</span>
                  <span className="font-medium text-green-700">
                    {new Date(generatedContent.mintedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {generatedContent.transactionHash && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                      {generatedContent.transactionHash.slice(0, 12)}...
                    </span>
                    <button 
                      onClick={() => copyToClipboard(generatedContent.transactionHash)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy transaction hash"
                    >
                      {copied ? 
                        <CheckCircleIcon className="w-3 h-3 text-green-500" /> : 
                        <DocumentDuplicateIcon className="w-3 h-3" />
                      }
                    </button>
                    <a
                      href={`https://${generatedContent.chain === 'mainnet' ? '' : generatedContent.chain + '.'}etherscan.io/tx/${generatedContent.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-500 hover:text-blue-700"
                      title="View on Etherscan"
                    >
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayNFTDetails;


