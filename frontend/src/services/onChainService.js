import { ethers } from 'ethers';
import ipfsService from './ipfsService.js';
import { LICENZ_CONTENT_ABI, DEFAULT_CONTENT_PARAMS } from './constants/contractABI.js';
import { 
  formatBlockchainContent, 
  formatTransactionResult, 
  extractTokenIdFromReceipt,
  validateServiceInitialization 
} from './utils/blockchainUtils.js';

/**
 * On-Chain Content Storage Service
 * Interacts directly with LicenZContentSimple smart contract
 * Eliminates need for backend database
 */
class OnChainContentService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
    this.contractAddress = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the on-chain service
   * @param {Object} walletData - Wallet connection data
   * @param {string} contractAddress - Smart contract address
   */
  async initialize(walletData, contractAddress) {
    try {
      console.log('Initializing on-chain content service...');
      
      if (!walletData?.provider) {
        throw new Error('Wallet provider not available');
      }

      this.provider = walletData.provider;
      this.signer = walletData.provider.getSigner();
      this.contractAddress = contractAddress;

      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        LICENZ_CONTENT_ABI,
        this.signer
      );

      this.isInitialized = true;
      console.log('On-chain content service initialized');
      console.log('Contract address:', this.contractAddress);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize on-chain service:', error);
      throw error;
    }
  }

  /**
   * Create content directly on blockchain
   * @param {Object} contentData - Content data
   * @returns {Object} - Transaction result with token ID
   */
  async createContent(contentData) {
    try {
      validateServiceInitialization(this.isInitialized, this.contract);
      console.log('Creating content on blockchain...', contentData);

      // Upload content to IPFS first
      const ipfsHash = await ipfsService.uploadContent(contentData.ImageData);
      console.log('Content uploaded to IPFS:', ipfsHash);

      // Create content on blockchain with default values
      const tx = await this.contract.createContent(
        contentData.prompt,
        ipfsHash,
        contentData.style || DEFAULT_CONTENT_PARAMS.style,
        contentData.cfg_scale || DEFAULT_CONTENT_PARAMS.cfgScale,
        contentData.steps || DEFAULT_CONTENT_PARAMS.steps,
        contentData.height || DEFAULT_CONTENT_PARAMS.height,
        contentData.width || DEFAULT_CONTENT_PARAMS.width,
        contentData.model || DEFAULT_CONTENT_PARAMS.model
      );

      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);

      // Get the token ID from the transaction receipt
      const tokenId = await extractTokenIdFromReceipt(receipt, this.contract);
      
      return {
        success: true,
        tokenId,
        ipfsHash,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        message: 'Content created successfully on blockchain'
      };

    } catch (error) {
      console.error('Failed to create content on blockchain:', error);
      throw error;
    }
  }

  /**
   * Get content by token ID
   * @param {number} tokenId - The token ID
   * @returns {Object} - Content data
   */
  async getContent(tokenId) {
    try {
      validateServiceInitialization(this.isInitialized, this.contract);
      console.log('Fetching content from blockchain, token ID:', tokenId);
      
      const content = await this.contract.getContent(tokenId);
      const formattedContent = formatBlockchainContent(content);

      console.log('Content retrieved from blockchain:', formattedContent);
      return formattedContent;

    } catch (error) {
      console.error('Failed to get content from blockchain:', error);
      throw error;
    }
  }

  /**
   * Get all content for a creator address
   * @param {string} creatorAddress - Creator's wallet address
   * @returns {Array} - Array of content items
   */
  async getCreatorContent(creatorAddress) {
    try {
      validateServiceInitialization(this.isInitialized, this.contract);
      console.log('Fetching content for creator:', creatorAddress);
      
      const tokenIds = await this.contract.getCreatorContent(creatorAddress);
      console.log('Found token IDs:', tokenIds);

      // Fetch content for each token ID
      const contentItems = [];
      for (const tokenId of tokenIds) {
        try {
          const content = await this.getContent(tokenId);
          contentItems.push(content);
        } catch (error) {
          console.warn(`Failed to fetch content for token ${tokenId}:`, error);
        }
      }

      console.log(`Retrieved ${contentItems.length} content items for creator`);
      return contentItems;

    } catch (error) {
      console.error('Failed to get creator content:', error);
      throw error;
    }
  }

  /**
   * Get total content count
   * @returns {number} - Total number of content items
   */
  async getTotalContentCount() {
    try {
      validateServiceInitialization(this.isInitialized, this.contract);
      const count = await this.contract.getTotalContentCount();
      return Number(count);
    } catch (error) {
      console.error('Failed to get total content count:', error);
      throw error;
    }
  }

  /**
   * Set license for content
   * @param {number} tokenId - The token ID
   * @param {number} price - License price in wei
   * @param {string} terms - License terms
   * @returns {Object} - Transaction result
   */
  async setLicense(tokenId, price, terms) {
    try {
      validateServiceInitialization(this.isInitialized, this.contract);
      console.log('Setting license for token:', tokenId, 'Price:', price, 'Terms:', terms);
      
      const tx = await this.contract.setLicense(tokenId, price, terms);
      const receipt = await tx.wait();

      return formatTransactionResult(tx, receipt, 'License set successfully');

    } catch (error) {
      console.error('Failed to set license:', error);
      throw error;
    }
  }

  /**
   * Purchase license for content
   * @param {number} tokenId - The token ID
   * @param {number} price - License price in wei
   * @returns {Object} - Transaction result
   */
  async purchaseLicense(tokenId, price) {
    try {
      validateServiceInitialization(this.isInitialized, this.contract);
      console.log('Purchasing license for token:', tokenId, 'Price:', price);
      
      const tx = await this.contract.purchaseLicense(tokenId, { value: price });
      const receipt = await tx.wait();

      return formatTransactionResult(tx, receipt, 'License purchased successfully');

    } catch (error) {
      console.error('Failed to purchase license:', error);
      throw error;
    }
  }

  /**
   * Check if service is initialized
   * @returns {boolean} - Initialization status
   */
  isReady() {
    return this.isInitialized && this.contract !== null;
  }

  /**
   * Get contract address
   * @returns {string} - Contract address
   */
  getContractAddress() {
    return this.contractAddress;
  }
}

// Export singleton instance
const onChainService = new OnChainContentService();
export default onChainService;
