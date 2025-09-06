import React from 'react';
import { 
  SparklesIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const NFTTab = ({ content, walletConnected, onMintNFT, isProcessing, nftResult }) => {
  if (!content) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Content Preview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content to Mint</h3>
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
                <SparklesIcon className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Prompt:</span>
              <p className="text-gray-900 mt-1">{content.prompt}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Style:</span>
              <p className="text-gray-900 mt-1 capitalize">{content.style}</p>
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

      {/* Mint Button */}
      <div className="text-center">
        <button
          onClick={onMintNFT}
          disabled={!walletConnected || isProcessing}
          className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mx-auto ${
            !walletConnected
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isProcessing
              ? 'bg-purple-300 text-purple-600 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isProcessing ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Minting NFT...
            </>
          ) : !walletConnected ? (
            <>
              <ExclamationCircleIcon className="w-5 h-5" />
              Connect Wallet First
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Mint as NFT
            </>
          )}
        </button>
        
        {!walletConnected && (
          <p className="text-sm text-gray-500 mt-2">
            Please connect your MetaMask wallet to mint NFTs
          </p>
        )}
      </div>

      {/* NFT Result */}
      {nftResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">NFT Minted Successfully!</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-green-700">Status:</span>
              <span className="ml-2 text-green-600">{nftResult.status}</span>
            </div>
            
            {nftResult.chain && (
              <div>
                <span className="font-medium text-green-700">Chain:</span>
                <span className="ml-2 text-green-600">{nftResult.chain}</span>
              </div>
            )}
            
            {nftResult.transactionHash && (
              <div>
                <span className="font-medium text-green-700">Transaction:</span>
                <span className="ml-2 text-green-600 font-mono">
                  {nftResult.transactionHash.slice(0, 12)}...{nftResult.transactionHash.slice(-8)}
                </span>
              </div>
            )}
            
            {nftResult.contractAddress && (
              <div>
                <span className="font-medium text-green-700">Contract:</span>
                <span className="ml-2 text-green-600 font-mono">
                  {nftResult.contractAddress.slice(0, 12)}...{nftResult.contractAddress.slice(-8)}
                </span>
              </div>
            )}
            
            {nftResult.ipfs?.image?.cid && (
              <div>
                <span className="font-medium text-green-700">IPFS Image:</span>
                <span className="ml-2 text-green-600 font-mono">
                  {nftResult.ipfs.image.cid.slice(0, 12)}...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTTab;
