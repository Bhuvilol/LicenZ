import { ethers } from 'ethers';
import ipfsService from './ipfsService.js';
import verbwireService from './verbwireService.js';
import { getContractAddresses } from '../config/blockchain.js';
import { safeExecute, getUserFriendlyMessage } from '../utils/errorHandler.js';

// Basic NFT Contract ABI (simplified for now)
const NFT_CONTRACT_ABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Basic Licensing Contract ABI
const LICENSING_CONTRACT_ABI = [
  "function createLicense(string memory contentHash, uint256 price, string memory terms) public returns (uint256)",
  "function purchaseLicense(uint256 licenseId) public payable",
  "function getLicense(uint256 licenseId) public view returns (string memory, uint256, string memory, address, bool)",
  "function isLicenseValid(uint256 licenseId) public view returns (bool)"
];

class BlockchainService {
  constructor() {
    this.nftContract = null;
    this.licensingContract = null;
    this.isInitialized = false;
    this.useVerbwire = true;
    this.verbwireInitialized = false;
    this.walletData = null;
  }

  // Set wallet data from the new wallet system
  setWalletData(walletData) {
    this.walletData = walletData;
  }

  // Check if wallet is connected
  isWalletConnected() {
    return this.walletData && this.walletData.account && this.walletData.account.length > 0;
  }

  // Initialize blockchain service
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
      
      this.useVerbwire = true;
      this.verbwireInitialized = true;
      this.isInitialized = true;
      return true;
    } catch (error) {
      throw new Error(`Verbwire initialization failed: ${error.message}`);
    }
  }

  // Mint NFT from AI-generated content
  async mintNFT(contentData, metadata) {
    return safeExecute(async () => {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Check if we have image data or need to fetch from imageUrl
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

      // Upload metadata to IPFS
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

      if (this.useVerbwire && this.verbwireInitialized) {
        return await this.mintNFTWithVerbwire(nftMetadata, ipfsResult.url, contentData, metadataResult, ipfsResult);
      } else {
        throw new Error('Verbwire is required for NFT minting');
      }
    }, {
      function: 'mintNFT',
      contentData: contentData?.prompt || 'unknown',
      metadata: metadata || {}
    }, null);
  }

  // Mint NFT using Verbwire
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

  // Create a license for content
  async createLicense(contentHash, price, terms) {
    return safeExecute(async () => {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.useVerbwire && this.verbwireInitialized) {
        return await this.createLicenseWithVerbwire(contentHash, price, terms);
      } else {
        throw new Error('Verbwire is required for license creation');
      }
    }, {
      function: 'createLicense',
      contentHash,
      price,
      terms
    }, null);
  }

  // Create license using Verbwire
  async createLicenseWithVerbwire(contentHash, price, terms) {
    const walletState = this.walletData;
    const licenseOptions = {
      creator: walletState.account,
      chain: 'goerli',
      contentHash: contentHash,
      price: price,
      terms: terms
    };

    const verbwireResult = await verbwireService.createLicense(contentHash, price, terms, licenseOptions);
    
    return {
      licenseId: verbwireResult.licenseId,
      contentHash: contentHash,
      price: ethers.parseEther(price.toString()),
      terms: terms,
      creator: walletState.account,
      isActive: true,
      createdAt: new Date().toISOString(),
      status: 'CREATED_VIA_VERBWIRE',
      verbwireData: verbwireResult,
      transactionHash: verbwireResult.transactionHash,
      contractAddress: verbwireResult.contractAddress,
      chain: verbwireResult.chain
    };
  }

  // Purchase a license
  async purchaseLicense(licenseId, price) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const purchaseData = {
      licenseId: licenseId,
      purchaser: this.walletData.account,
      price: ethers.parseEther(price.toString()),
      purchasedAt: new Date().toISOString(),
      status: 'PURCHASED_LOCAL',
      note: 'Local blockchain contracts not deployed yet'
    };

    return purchaseData;
  }

  // Get license information
  async getLicense(licenseId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return {
      licenseId: licenseId,
      contentHash: 'mock-hash',
      price: ethers.parseEther('0.01'),
      terms: 'Standard license terms',
      creator: '0x123...',
      isActive: true
    };
  }

  // Convert base64 to blob
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

  // Test Verbwire connection
  async testVerbwireConnection() {
    try {
      if (!this.verbwireInitialized) {
        await this.initialize();
      }
      
      const connectionTest = await verbwireService.testConnection();
      const status = verbwireService.getStatus();
      
      return {
        status,
        connectionTest,
        isWorking: connectionTest === true
      };
    } catch (error) {
      return {
        status: { error: error.message },
        connectionTest: false,
        isWorking: false
      };
    }
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      useVerbwire: this.useVerbwire,
      verbwireInitialized: this.verbwireInitialized,
      verbwireStatus: this.verbwireInitialized ? verbwireService.getStatus() : null,
      provider: this.useVerbwire ? 'Verbwire' : 'Local Blockchain',
      walletConnected: this.isWalletConnected()
    };
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;
