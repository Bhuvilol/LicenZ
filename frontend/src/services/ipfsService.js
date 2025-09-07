/**
 * IPFS Service for handling file uploads to IPFS
 * Provides methods for uploading images and metadata to IPFS
 */

class IPFSService {
  constructor() {
    this.ipfsGateway = 'https://ipfs.io/ipfs/';
    this.isInitialized = false;
  }

  // Initialize the IPFS service
  async initialize() {
    try {
      console.log('Initializing IPFS service...');
      this.isInitialized = true;
      console.log('IPFS service initialized');
      return true;
    } catch (error) {
      console.error('IPFS service initialization failed:', error);
      throw error;
    }
  }

  // Upload image blob to IPFS
  async uploadImage(imageBlob, options = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Uploading image to IPFS...', { size: imageBlob.size, type: imageBlob.type });

      // For now, we'll simulate IPFS upload since we don't have actual IPFS infrastructure
      // In a real implementation, this would use IPFS HTTP client or similar
      const mockCid = this.generateMockCID();
      const mockUrl = `${this.ipfsGateway}${mockCid}`;

      console.log('Image uploaded to IPFS:', mockCid);

      return {
        success: true,
        cid: mockCid,
        url: mockUrl,
        size: imageBlob.size,
        type: imageBlob.type,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('IPFS image upload failed:', error);
      throw new Error(`Failed to upload image to IPFS: ${error.message}`);
    }
  }

  // Upload metadata to IPFS
  async uploadMetadata(metadata) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Uploading metadata to IPFS...', metadata);

      // Convert metadata to JSON string
      const metadataString = JSON.stringify(metadata, null, 2);
      
      // For now, we'll simulate IPFS upload
      const mockCid = this.generateMockCID();
      const mockUrl = `${this.ipfsGateway}${mockCid}`;

      console.log('Metadata uploaded to IPFS:', mockCid);

      return {
        success: true,
        cid: mockCid,
        url: mockUrl,
        size: metadataString.length,
        type: 'application/json',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('IPFS metadata upload failed:', error);
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  // Upload content to IPFS (alias for uploadImage for backward compatibility)
  async uploadContent(contentData) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Uploading content to IPFS...', contentData);

      // If contentData is a blob, treat it as an image
      if (contentData instanceof Blob) {
        return await this.uploadImage(contentData);
      }

      // If contentData is a string or object, treat it as metadata
      if (typeof contentData === 'string' || typeof contentData === 'object') {
        return await this.uploadMetadata(contentData);
      }

      throw new Error('Invalid content data type. Expected Blob, string, or object.');
    } catch (error) {
      console.error('IPFS content upload failed:', error);
      throw new Error(`Failed to upload content to IPFS: ${error.message}`);
    }
  }

  // Generate a mock CID for development purposes
  generateMockCID() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'Qm';
    for (let i = 0; i < 42; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get IPFS gateway URL for a CID
  getGatewayUrl(cid) {
    return `${this.ipfsGateway}${cid}`;
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      gateway: this.ipfsGateway,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
const ipfsService = new IPFSService();
export default ipfsService;

