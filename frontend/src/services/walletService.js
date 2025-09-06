import verbwireService from './verbwireService.js';

class WalletService {
  constructor() {
    this.walletData = null;
  }

  setWalletData(walletData) {
    this.walletData = walletData;
  }

  isWalletConnected() {
    return this.walletData && this.walletData.account && this.walletData.account.length > 0;
  }

  getWalletAddress() {
    return this.walletData?.account || null;
  }

  getWalletData() {
    return this.walletData;
  }

  async testVerbwireConnection() {
    try {
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

  getStatus() {
    return {
      walletConnected: this.isWalletConnected(),
      walletAddress: this.getWalletAddress(),
      verbwireStatus: verbwireService.getStatus()
    };
  }
}

export default new WalletService();
