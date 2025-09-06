/**
 * Blockchain Configuration
 * Provides contract addresses and network configuration for blockchain operations
 */

// Network configurations
const NETWORKS = {
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH'
  },
  mainnet: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io',
    currency: 'ETH'
  },
  polygon: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    currency: 'MATIC'
  }
};

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  sepolia: {
    nftContract: '0xF1095Ff6671b70B0122224967Aa229C8744504b8', // LicenZContentSimple deployed
    licensingContract: '0xF1095Ff6671b70B0122224967Aa229C8744504b8', // Same contract handles licensing
    marketplaceContract: '0xF1095Ff6671b70B0122224967Aa229C8744504b8' // Same contract handles marketplace
  },
  mainnet: {
    nftContract: '0x0000000000000000000000000000000000000000', // Not deployed yet
    licensingContract: '0x0000000000000000000000000000000000000000', // Not deployed yet
    marketplaceContract: '0x0000000000000000000000000000000000000000' // Not deployed yet
  },
  polygon: {
    nftContract: '0x0000000000000000000000000000000000000000', // Not deployed yet
    licensingContract: '0x0000000000000000000000000000000000000000', // Not deployed yet
    marketplaceContract: '0x0000000000000000000000000000000000000000' // Not deployed yet
  }
};

// Default network
const DEFAULT_NETWORK = 'sepolia';

/**
 * Get contract addresses for a specific network
 * @param {string} network - Network name (sepolia, mainnet, polygon)
 * @returns {Object} Contract addresses for the network
 */
export function getContractAddresses(network = DEFAULT_NETWORK) {
  const addresses = CONTRACT_ADDRESSES[network];
  if (!addresses) {
    throw new Error(`Network '${network}' not supported`);
  }
  
  return {
    ...addresses,
    network,
    networkInfo: NETWORKS[network]
  };
}

/**
 * Get network configuration
 * @param {string} network - Network name
 * @returns {Object} Network configuration
 */
export function getNetworkConfig(network = DEFAULT_NETWORK) {
  const config = NETWORKS[network];
  if (!config) {
    throw new Error(`Network '${network}' not supported`);
  }
  
  return config;
}

/**
 * Get all supported networks
 * @returns {Object} All network configurations
 */
export function getSupportedNetworks() {
  return NETWORKS;
}

/**
 * Check if a network is supported
 * @param {string} network - Network name
 * @returns {boolean} True if network is supported
 */
export function isNetworkSupported(network) {
  return NETWORKS.hasOwnProperty(network);
}

/**
 * Get default network
 * @returns {string} Default network name
 */
export function getDefaultNetwork() {
  return DEFAULT_NETWORK;
}

/**
 * Validate network name
 * @param {string} network - Network name to validate
 * @returns {boolean} True if valid
 */
export function validateNetwork(network) {
  return isNetworkSupported(network);
}

// Export constants for direct use
export { NETWORKS, CONTRACT_ADDRESSES, DEFAULT_NETWORK };

