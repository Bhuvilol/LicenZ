import { ethers } from 'ethers';
import verbwireService from './verbwireService.js';
import { safeExecute } from '../utils/errorHandler.js';

class LicenseService {
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

  async createLicense(contentHash, price, terms) {
    return safeExecute(async () => {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await this.createLicenseWithVerbwire(contentHash, price, terms);
    }, {
      function: 'createLicense',
      contentHash,
      price,
      terms
    }, null);
  }

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

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      walletConnected: this.isWalletConnected()
    };
  }
}

export default new LicenseService();
