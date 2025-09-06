// On-Chain Content Storage Configuration
// This replaces the backend database with blockchain storage

export const ONCHAIN_CONFIG = {
  // Contract addresses (update these after deployment)
  CONTRACTS: {
    // Sepolia Testnet
    SEPOLIA: {
      LICENZ_CONTENT: '0xF1095Ff6671b70B0122224967Aa229C8744504b8', // LicenZContentSimple deployed!
      NETWORK_ID: 11155111,
      EXPLORER: 'https://sepolia.etherscan.io',
      RPC_URL: 'https://ethereum-sepolia.publicnode.com'
    },
    
    // Ethereum Mainnet
    MAINNET: {
      LICENZ_CONTENT: '0x0000000000000000000000000000000000000000', // Update after deployment
      NETWORK_ID: 1,
      EXPLORER: 'https://etherscan.io',
      RPC_URL: 'https://mainnet.infura.io/v3/727cce12a9184adc88b59b9ae69ef7f7'
    },
    
    // Linea Testnet
    LINEA_SEPOLIA: {
      LICENZ_CONTENT: '0x0000000000000000000000000000000000000000', // Update after deployment
      NETWORK_ID: 59140,
      EXPLORER: 'https://sepolia.lineascan.build',
      RPC_URL: 'https://linea-sepolia.infura.io/v3/727cce12a8827279cffFb92266'
    },
    
    // Localhost (for testing)
    LOCALHOST: {
      LICENZ_CONTENT: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788', // Simplified contract
      NETWORK_ID: 1337,
      EXPLORER: 'http://localhost:8545',
      RPC_URL: 'http://localhost:8545'
    }
  },


  DEFAULT_NETWORK: 'SEPOLIA',

  // IPFS Configuration
  IPFS: {
    GATEWAY: 'https://ipfs.io/ipfs/',
    PINNING_SERVICE: 'https://api.pinata.cloud', // Optional: Pinata for permanent storage
    PINATA_API_KEY: import.meta.env.VITE_PINATA_API_KEY || '',
    PINATA_SECRET: import.meta.env.VITE_PINATA_SECRET || ''
  },

  // Gas settings
  GAS: {
    DEFAULT_LIMIT: 500000, // Gas limit for content creation
    MAX_PRIORITY_FEE: '2', // Max priority fee in gwei
    MAX_FEE: '50' // Max fee in gwei
  },

  // Content settings
  CONTENT: {
    MAX_PROMPT_LENGTH: 1000,
    SUPPORTED_MODELS: [
      'stable-diffusion-xl-1024-v1-0',
      'stable-diffusion-v1-6',
      'stable-diffusion-2-1',
      'midjourney-v5',
      'dall-e-3'
    ],
    SUPPORTED_STYLES: [
      'photographic',
      'digital-art',
      'cinematic',
      'anime',
      'painting',
      'sketch',
      'origami',
      '3d-model'
    ]
  },

  // License settings
  LICENSING: {
    MIN_PRICE: '0.001', // Minimum license price in ETH
    MAX_PRICE: '100',   // Maximum license price in ETH
    DEFAULT_TERMS: 'Standard LicenZ License - Commercial use allowed with attribution',
    ROYALTY_PERCENTAGE: 2.5 // 2.5% royalty on secondary sales
  }
};

// Get current network configuration
export const getCurrentNetworkConfig = () => {
  const network = ONCHAIN_CONFIG.DEFAULT_NETWORK;
  return ONCHAIN_CONFIG.CONTRACTS[network];
};

// Get contract address for current network
export const getContractAddress = () => {
  const config = getCurrentNetworkConfig();
  return config.LICENZ_CONTENT;
};

// Check if contract is deployed
export const isContractDeployed = () => {
  const address = getContractAddress();
  return address !== '0x0000000000000000000000000000000000000000';
};

// Get network explorer URL
export const getExplorerUrl = () => {
  const config = getCurrentNetworkConfig();
  return config.EXPLORER;
};

// Get RPC URL for current network
export const getRpcUrl = () => {
  const config = getCurrentNetworkConfig();
  return config.RPC_URL;
};

// Validate network ID
export const isValidNetwork = (networkId) => {
  const networks = Object.values(ONCHAIN_CONFIG.CONTRACTS);
  return networks.some(network => network.NETWORK_ID === networkId);
};

// Get network name by ID
export const getNetworkName = (networkId) => {
  const networks = Object.entries(ONCHAIN_CONFIG.CONTRACTS);
  const network = networks.find(([_, config]) => config.NETWORK_ID === networkId);
  return network ? network[0] : 'Unknown';
};

// Format gas price
export const formatGasPrice = (gasPrice) => {
  return ethers.utils.formatUnits(gasPrice, 'gwei');
};

// Parse gas price
export const parseGasPrice = (gasPrice) => {
  return ethers.utils.parseUnits(gasPrice, 'gwei');
};

// Get estimated gas for content creation
export const estimateContentCreationGas = async (contract, contentData) => {
  try {
    const gasEstimate = await contract.estimateGas.createContent(
      contentData.prompt,
      contentData.ipfsHash,
      contentData.style || 'photographic',
      contentData.cfg_scale || 7,
      contentData.steps || 30,
      contentData.height || 1024,
      contentData.width || 1024,
      contentData.model || 'stable-diffusion-xl-1024-v1-0'
    );
    
    // Add 20% buffer for safety
    return gasEstimate.mul(120).div(100);
  } catch (error) {
    console.warn('Could not estimate gas, using default:', error);
    return ONCHAIN_CONFIG.GAS.DEFAULT_LIMIT;
  }
};
