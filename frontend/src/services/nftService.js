import { ethers } from 'ethers';
import ipfsService from './ipfsService.js';
import verbwireService from './verbwireService.js';
import { safeExecute } from '../utils/errorHandler.js';

class NFTService {
  constructor() {
    this.isInitialized = false;
    this.walletData = null;
  }

  setWalletData(walletData) {
    this.walletData = walletData;
  }

  isWalletConnected() {
    return this.walletData && this.walletData.account && this.walletData.account.length > 0;
  }

  async initialize() {
    if (!this.isWalletConnected()) {
      throw new Error('Wallet not connected. Please connect your MetaMask wallet first.');
    }

    try {
      await verbwireService.initialize();
      const connectionTest = await verbwireService.testConnection();
      if (!connectionTest) {
        throw new Error('Verbwire connection test failed. Please check your API key and network connection.');
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      throw new Error(`Verbwire initialization failed: ${error.message}`);
    }
  }

  async mintNFT(contentData, metadata, onProgress) {
    return safeExecute(async () => {
      if (!this.isInitialized) {
        await this.initialize();
      }

      onProgress('uploading_image');
      let imageBlob;
      if (contentData.ImageData) {
        imageBlob = await this.base64ToBlob(contentData.ImageData);
      } else if (contentData.ImageURL) {
        const response = await fetch(contentData.ImageURL);
        imageBlob = await response.blob();
      } else {
        throw new Error('No image data available for NFT minting');
      }
      
      const ipfsResult = await ipfsService.uploadImage(imageBlob, {
        prompt: contentData.prompt,
        style: contentData.style,
        model: contentData.model,
        ...metadata
      });

      if (!ipfsResult || !ipfsResult.url || !ipfsResult.cid) {
        throw new Error('IPFS upload failed: Invalid result structure');
      }

      onProgress('uploading_metadata');
      const nftMetadata = {
        name: `AI Generated: ${contentData.prompt}`,
        description: `AI-generated image created with ${contentData.model}`,
        image: ipfsResult.url,
        attributes: [
          { trait_type: 'Prompt', value: contentData.prompt },
          { trait_type: 'Style', value: contentData.style },
          { trait_type: 'Model', value: contentData.model },
          { trait_type: 'Seed', value: contentData.seed },
          { trait_type: 'CFG Scale', value: contentData.cfg_scale },
          { trait_type: 'Steps', value: contentData.steps },
          { trait_type: 'Content Hash', value: contentData.content_hash }
        ],
        external_url: `https://licenz.app/content/${contentData.content_hash}`,
        ipfs_hash: ipfsResult.cid
      };

      const metadataResult = await ipfsService.uploadMetadata(nftMetadata);

      if (!metadataResult || !metadataResult.url || !metadataResult.cid) {
        throw new Error('Metadata upload to IPFS failed: Invalid result structure');
      }

      onProgress('minting');
      return await this.mintNFTWithVerbwire(nftMetadata, ipfsResult.url, contentData, metadataResult, ipfsResult);
    }, {
      function: 'mintNFT',
      contentData: contentData?.prompt || 'unknown',
      metadata: metadata || {}
    }, null);
  }

  async mintNFTWithVerbwire(nftMetadata, imageUrl, contentData, metadataResult, ipfsResult) {
    const walletState = this.walletData;
    
    const mintOptions = {
      recipientAddress: walletState.account || '0x742d35Cc6634C0532925a3b8D404d2E5B4C9a8a8',
      chain: 'sepolia',
    };

    const licenseMetadata = {
      name: nftMetadata.name,
      description: nftMetadata.description,
      attributes: [
        ...nftMetadata.attributes,
        { trait_type: 'Platform', value: 'LicenZ' },
        { trait_type: 'License Available', value: 'Yes' },
        { trait_type: 'Content Hash', value: contentData.content_hash }
      ]
    };

    const verbwireResult = await verbwireService.mintNFT(licenseMetadata, imageUrl, mintOptions);
    
    return {
      tokenId: verbwireResult.tokenId,
      tokenURI: metadataResult.url,
      ipfs: {
        image: ipfsResult,
        metadata: metadataResult
      },
      metadata: nftMetadata,
      status: 'MINTED_VIA_VERBWIRE',
      verbwireData: verbwireResult,
      transactionHash: verbwireResult.transactionHash,
      contractAddress: verbwireResult.contractAddress,
      chain: verbwireResult.chain
    };
  }

  async base64ToBlob(base64Data) {
    const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/png' });
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      walletConnected: this.isWalletConnected()
    };
  }
}

export default new NFTService();