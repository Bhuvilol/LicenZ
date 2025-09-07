import React from 'react';
import { 
  TrashIcon, 
  EyeIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon, 
  ArrowPathIcon, 
  SparklesIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const ContentCard = ({ item, onView, onShowModal, onDownload, onMintNFT, onDelete, mintingStatus }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-gray-100 relative group">
        {item.ImageData ? (
          <img
            src={`data:image/png;base64,${item.ImageData}`}
            alt={item.prompt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {item.NFTMinted && (
          <div 
            className="absolute top-1.5 left-1.5 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 cursor-help"
            title={`NFT Minted${item.NFTTokenID ? ` - Token ID: #${item.NFTTokenID}` : ''}${item.chain ? ` on ${item.chain}` : ''}${item.mintedAt ? ` on ${new Date(item.mintedAt).toLocaleDateString()}` : ''}`}
          >
            <CheckCircleIcon className="w-2.5 h-2.5" />
            NFT
            {item.chain && (
              <span className="text-xs opacity-90">({item.chain})</span>
            )}
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-1.5">
            <button onClick={() => { 
              console.log('View button clicked for item:', item.id);
              onView(item); 
              onShowModal(); 
            }} className="p-1.5 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors" title="View Details">
              <EyeIcon className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDownload(item)} className="p-1.5 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors" title="Download">
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            </button>
            {!item.NFTMinted ? (
              <button
                onClick={() => onMintNFT(item)}
                disabled={['uploading_image', 'uploading_metadata', 'minting'].includes(mintingStatus[item.id])}
                className={`p-1.5 rounded-full transition-all duration-300 ${
                  ['uploading_image', 'uploading_metadata', 'minting'].includes(mintingStatus[item.id])
                    ? 'bg-purple-300 text-purple-600 cursor-not-allowed animate-pulse'
                    : mintingStatus[item.id] === 'error'
                    ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
                    : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105'
                }`}
                title={
                  mintingStatus[item.id] === 'uploading_image' ? 'Uploading image to IPFS...' :
                  mintingStatus[item.id] === 'uploading_metadata' ? 'Uploading metadata to IPFS...' :
                  mintingStatus[item.id] === 'minting' ? 'Minting NFT on the blockchain...' :
                  'Mint as NFT'
                }
              >
                {['uploading_image', 'uploading_metadata', 'minting'].includes(mintingStatus[item.id]) ? (
                  <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                ) : mintingStatus[item.id] === 'error' ? (
                  <ExclamationCircleIcon className="h-3.5 w-3.5" />
                ) : mintingStatus[item.id] === 'success' ? (
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                ) : (
                  <SparklesIcon className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <button className="p-1.5 bg-green-500 text-white rounded-full cursor-default hover:bg-green-600 transition-colors" title="Already minted as NFT">
                <CheckCircleIcon className="h-3.5 w-3.5" />
              </button>
            )}
            <button onClick={() => onDelete(item.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Delete">
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1.5 line-clamp-2 text-sm">{item.prompt}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="capitalize">{item.style}</span>
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
        
        {item.NFTMinted && (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircleIcon className="w-3 h-3" />
            <span>NFT Minted</span>
            {item.NFTTokenID && (
              <span className="text-xs bg-green-100 px-1.5 py-0.5 rounded">ID: {item.NFTTokenID}</span>
            )}
            {item.chain && (
              <span className="text-xs bg-blue-100 px-1.5 py-0.5 rounded capitalize">{item.chain}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
