import React, { useState, useEffect, useCallback, useRef } from 'react';
import { contentAPI } from '../services/backendService.js';
import nftService from '../services/nftService.js';
import ContentHeader from './ContentHeader';
import ContentList from './content/ContentList';
import ContentModal from './ContentModal';
import ContentFilters from './content/ContentFilters';
import MintingProgressModal from './MintingProgressModal';
import { useWallet } from '../hooks/useWallet';

const ContentManager = ({ 
  onContentUpdate, 
  contentFromParent = [], 
  walletAddress,
  walletData 
}) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mintingStatus, setMintingStatus] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [filters, setFilters] = useState({});
  const [showMintingModal, setShowMintingModal] = useState(false);
  const [currentMintingContent, setCurrentMintingContent] = useState(null);
  const [currentMintingStep, setCurrentMintingStep] = useState(null);
  const isFetchingRef = useRef(false);

  const { getCurrentWalletAddress } = useWallet();

  const handleDownload = useCallback((item) => {
    if (!item.ImageData) return;

    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${item.ImageData}`;
      const fileName = item.prompt ? `${item.prompt.replace(/ /g, '_').slice(0, 30)}.png` : `licenz-content-${item.id}.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download image.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Load NFT status from localStorage
  const loadNFTStatus = () => {
    try {
      const saved = localStorage.getItem('licenz-nft-status');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  };

  // Save NFT status to localStorage
  const saveNFTStatus = (nftStatus) => {
    try {
      localStorage.setItem('licenz-nft-status', JSON.stringify(nftStatus));
    } catch (error) {
      // Silently fail
    }
  };

  // Merge content from multiple sources
  const mergeContent = (backendContent, parentContent, nftStatus) => {
    const allContent = [...backendContent, ...parentContent];
    const mergedMap = new Map();
    
    allContent.forEach(item => {
      const key = item.id || item.content_hash;
      if (key) {
        if (mergedMap.has(key)) {
          const existing = mergedMap.get(key);
          const merged = {
            ...existing,
            ...item,
            NFTMinted: existing.NFTMinted || item.NFTMinted || nftStatus[key]?.NFTMinted || false,
            NFTTokenID: existing.NFTTokenID || item.NFTTokenID || nftStatus[key]?.NFTTokenID,
            contractAddress: existing.contractAddress || item.contractAddress || nftStatus[key]?.contractAddress,
            transactionHash: existing.transactionHash || item.transactionHash || nftStatus[key]?.transactionHash,
            chain: existing.chain || item.chain || nftStatus[key]?.chain,
            method: existing.method || item.method || nftStatus[key]?.method,
            mintedAt: existing.mintedAt || item.mintedAt || nftStatus[key]?.mintedAt,
            verbwireData: existing.verbwireData || item.verbwireData || nftStatus[key]?.verbwireData
          };
          mergedMap.set(key, merged);
        } else {
          const itemWithNFT = {
            ...item,
            NFTMinted: item.NFTMinted || nftStatus[key]?.NFTMinted || false,
            NFTTokenID: item.NFTTokenID || item.NFTTokenID || nftStatus[key]?.NFTTokenID,
            contractAddress: item.contractAddress || item.contractAddress || nftStatus[key]?.contractAddress,
            transactionHash: item.transactionHash || item.transactionHash || nftStatus[key]?.transactionHash,
            chain: item.chain || item.chain || nftStatus[key]?.chain,
            method: item.method || item.method || nftStatus[key]?.method,
            mintedAt: item.mintedAt || item.mintedAt || nftStatus[key]?.mintedAt,
            verbwireData: item.verbwireData || item.verbwireData || nftStatus[key]?.verbwireData
          };
          mergedMap.set(key, itemWithNFT);
        }
      }
    });
    
    return Array.from(mergedMap.values());
  };

  // Apply filters to content
  const applyFilters = (contentList, filters) => {
    let filteredContent = contentList;

    if (filters.nftStatus && filters.nftStatus !== 'all') {
      if (filters.nftStatus === 'minted') {
        filteredContent = filteredContent.filter(item => item.NFTMinted);
      } else if (filters.nftStatus === 'not-minted') {
        filteredContent = filteredContent.filter(item => !item.NFTMinted);
      }
    }

    if (filters.contentType && filters.contentType !== 'all') {
      if (filters.contentType === 'ai-generated') {
        filteredContent = filteredContent.filter(item => item.prompt && item.model);
      } else if (filters.contentType === 'uploaded') {
        filteredContent = filteredContent.filter(item => !item.prompt && !item.model);
      }
    }

    return filteredContent;
  };

  // Fetch content from backend
  const fetchContent = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      
      let backendContent = [];
      
      try {
        const response = await contentAPI.getAllContent();
        backendContent = response.data || [];
        
        if (walletAddress && backendContent.length > 0) {
          const walletFilteredContent = backendContent.filter(item => 
            item.wallet_address === walletAddress || 
            item.user_id === walletAddress ||
            item.UserID === walletAddress ||
            !item.wallet_address ||
            !item.user_id ||
            !item.UserID
          );
          
          if (walletFilteredContent.length !== backendContent.length) {
            backendContent = walletFilteredContent;
          }
        }
      } catch (error) {
        backendContent = [];
      }
      
      const nftStatus = loadNFTStatus();
      let mergedContent = mergeContent(backendContent, contentFromParent, nftStatus);
      
      setContent(mergedContent);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [walletAddress, contentFromParent]);

  // Handle content updates
  const handleContentUpdate = useCallback((updatedContent) => {
    setContent(prev => prev.map(item => 
      item.id === updatedContent.id ? updatedContent : item
    ));
    
    if (onContentUpdate) {
      onContentUpdate(content.map(item => 
        item.id === updatedContent.id ? updatedContent : item
      ));
    }
  }, [content, onContentUpdate]);

  const handleMintNFT = useCallback(async (item) => {
    const onProgress = (status) => {
      setMintingStatus(prev => ({ ...prev, [item.id]: status }));
      setCurrentMintingStep(status);
    };

    setError(null);
    setCurrentMintingContent(item);
    setShowMintingModal(true);
    setCurrentMintingStep('uploading_image');

    try {
      nftService.setWalletData(walletData);
      const mintResult = await nftService.mintNFT(item, {}, onProgress);
      
      const updatedContent = {
        ...item,
        NFTMinted: true,
        NFTTokenID: mintResult.tokenId,
        transactionHash: mintResult.transactionHash,
        contractAddress: mintResult.contractAddress,
        chain: mintResult.chain,
        verbwireData: mintResult.verbwireData,
        mintedAt: new Date().toISOString(),
      };

      handleContentUpdate(updatedContent);
      setMintingStatus(prev => ({ ...prev, [item.id]: 'success' }));

      // Save NFT status to localStorage
      const nftStatus = loadNFTStatus();
      nftStatus[item.id] = {
        NFTMinted: true,
        NFTTokenID: mintResult.tokenId,
        transactionHash: mintResult.transactionHash,
        contractAddress: mintResult.contractAddress,
        chain: mintResult.chain,
        mintedAt: updatedContent.mintedAt,
        verbwireData: mintResult.verbwireData,
      };
      saveNFTStatus(nftStatus);

      // Show success state in modal
      setCurrentMintingStep('completed');

    } catch (err) {
      setError(`Failed to mint NFT: ${err.message}`);
      setMintingStatus(prev => ({ ...prev, [item.id]: 'error' }));
      setCurrentMintingStep('error');
    }
  }, [walletData, handleContentUpdate]);

  // Handle content deletion
  const handleContentDelete = useCallback(async (contentId) => {
    setIsDeleting(true);
    setError(null);
    try {
      await contentAPI.deleteContent(contentId);
      setContent(prev => prev.filter(item => item.id !== contentId));
      if (onContentUpdate) {
        onContentUpdate(content.filter(item => item.id !== contentId));
      }
    } catch (err) {
      setError('Failed to delete content.');
    } finally {
      setIsDeleting(false);
    }
  }, [content, onContentUpdate]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Load content on mount and when dependencies change
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Update content when parent content changes
  useEffect(() => {
    if (contentFromParent.length > 0) {
      const nftStatus = loadNFTStatus();
      const mergedContent = mergeContent(content, contentFromParent, nftStatus);
      setContent(mergedContent);
    }
  }, [contentFromParent]);

  // Get filtered content
  const filteredContent = applyFilters(content, filters);

  return (
    <div className="space-y-8">
      <ContentHeader 
        contentCount={filteredContent.length}
        onRefresh={fetchContent}
      />
      
      <ContentFilters
        walletAddress={walletAddress}
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />
      
      <ContentList 
        content={filteredContent}
        loading={loading}
        error={error}
        onRefresh={fetchContent}
        onContentClick={(item) => {
          console.log('Content clicked:', item.id);
          setSelectedContent(item);
        }}
        onShowModal={() => {
          console.log('Show modal called');
          setShowModal(true);
        }}
        onMintNFT={handleMintNFT}
        onDelete={handleContentDelete}
        onDownload={handleDownload}
        mintingStatus={mintingStatus}
        isDeleting={isDeleting}
        isDownloading={isDownloading}
      />
      
      {showModal && selectedContent && (
        <ContentModal
          selectedContent={selectedContent}
          onClose={() => {
            console.log('Modal closing');
            setShowModal(false);
            setSelectedContent(null);
          }}
          onMintNFT={handleMintNFT}
          onDelete={handleContentDelete}
          onDownload={handleDownload}
          onCopyHash={(hash) => {
            navigator.clipboard.writeText(hash);
          }}
          mintingStatus={mintingStatus}
          isDeleting={isDeleting}
          isDownloading={isDownloading}
        />
      )}

      {showMintingModal && currentMintingContent && (
        <MintingProgressModal
          isOpen={showMintingModal}
          onClose={() => {
            setShowMintingModal(false);
            setCurrentMintingContent(null);
            setCurrentMintingStep(null);
          }}
          mintingStatus={currentMintingStep}
          contentData={currentMintingContent}
          onSuccess={() => {
            setShowMintingModal(false);
            setCurrentMintingContent(null);
            setCurrentMintingStep(null);
            // Optionally show the content modal with the newly minted NFT
            setSelectedContent(currentMintingContent);
            setShowModal(true);
          }}
          onError={() => {
            setShowMintingModal(false);
            setCurrentMintingContent(null);
            setCurrentMintingStep(null);
          }}
        />
      )}
      {console.log('ContentManager render - showModal:', showModal, 'selectedContent:', selectedContent?.id)}
    </div>
  );
};

export default ContentManager;