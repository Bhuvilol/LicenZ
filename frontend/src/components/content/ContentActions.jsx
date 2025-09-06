import React from 'react';
import nftService from '../../services/nftService';
import { contentAPI } from '../../services/backendService';

const ContentActions = ({ 
  contentItem, 
  onUpdate, 
  onDelete, 
  onDownload,
  mintingStatus,
  isDeleting,
  isDownloading 
}) => {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      await contentAPI.deleteContent(contentItem.id);
      onDelete(contentItem.id);
    } catch (error) {
      alert(`Failed to delete content: ${error.message}`);
    }
  };

  const handleDownload = async () => {
    try {
      let blob;
      if (contentItem.ImageData) {
        const byteCharacters = atob(contentItem.ImageData);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'image/png' });
      } else if (contentItem.ImageURL) {
        const response = await fetch(contentItem.ImageURL);
        blob = await response.blob();
      } else {
        throw new Error('No image data available for download');
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `licenz-${contentItem.id || contentItem.content_hash || Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      alert(`Failed to download content: ${error.message}`);
    }
  };

  const handleMintNFT = async () => {
    if (contentItem.NFTMinted) {
      alert('This content has already been minted as an NFT!');
      return;
    }

    try {
      const nftData = await nftService.mintNFT(contentItem, {
        creator: contentItem.UserID || 'Unknown',
        timestamp: contentItem.created_at || new Date().toISOString()
      });

      const updatedContent = {
        ...contentItem,
        NFTMinted: true,
        NFTTokenID: nftData.tokenId,
        contractAddress: nftData.contractAddress,
        transactionHash: nftData.transactionHash,
        chain: nftData.chain,
        method: 'verbwire',
        mintedAt: new Date().toISOString(),
        verbwireData: nftData.verbwireData
      };

      onUpdate(updatedContent);
      alert('NFT minted successfully!');
      
    } catch (error) {
      alert(`NFT minting failed: ${error.message}`);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleMintNFT}
        disabled={contentItem.NFTMinted || mintingStatus[contentItem.id] === 'minting'}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {contentItem.NFTMinted ? 'Minted' : 'Mint NFT'}
      </button>
      
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Download
      </button>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
};

export default ContentActions;
