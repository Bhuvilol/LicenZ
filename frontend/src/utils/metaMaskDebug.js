// MetaMask Debug Utilities
export const debugMetaMask = () => {
  console.log('=== MetaMask Debug Information ===');
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.log('ERROR: Not in browser environment (SSR)');
    return false;
  }
  
  // Check for Ethereum provider
  if (!window.ethereum) {
    console.log('ERROR: No Ethereum provider found');
    console.log('This usually means:');
    console.log('1. MetaMask is not installed');
    console.log('2. MetaMask is disabled');
    console.log('3. You\'re in a private/incognito window');
    console.log('4. Browser security settings are blocking it');
    return false;
  }
  
  console.log('SUCCESS: Ethereum provider found');
  
  // Check if it's MetaMask
  if (!window.ethereum.isMetaMask) {
    console.log('WARNING: Ethereum provider found but not MetaMask');
    console.log('Provider type:', window.ethereum.constructor.name);
    console.log('Provider:', window.ethereum);
    return false;
  }
  
  console.log('SUCCESS: MetaMask detected');
  
  // Check connection status
  try {
    const isConnected = window.ethereum.isConnected();
    console.log('Connection status:', isConnected ? 'Connected' : 'Not connected');
    
    if (isConnected) {
      console.log('Selected address:', window.ethereum.selectedAddress);
      console.log('Chain ID:', window.ethereum.chainId);
      console.log('Network version:', window.ethereum.networkVersion);
    }
  } catch (error) {
    console.log('ERROR: Error checking connection status:', error);
  }
  
  // Check for common issues
  console.log('\n=== Common Issues Check ===');
  
  // Check if MetaMask is locked
  if (!window.ethereum.selectedAddress) {
    console.log('WARNING: MetaMask appears to be locked (no selected address)');
    console.log('Try unlocking MetaMask and refreshing the page');
  }
  
  // Check if we're in a private window
  if (window.navigator.webdriver) {
    console.log('WARNING: Detected webdriver - might be in private/incognito mode');
  }
  
  // Check for multiple providers
  if (window.ethereum.providers && window.ethereum.providers.length > 1) {
    console.log('WARNING: Multiple Ethereum providers detected');
    console.log('Providers:', window.ethereum.providers);
  }
  
  return true;
};

export const testMetaMaskConnection = async () => {
  console.log('=== Testing MetaMask Connection ===');
  
  try {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }
    
    if (!window.ethereum.isMetaMask) {
      throw new Error('Provider is not MetaMask');
    }
    
    console.log('Requesting accounts...');
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    console.log('SUCCESS: Connection successful!');
    console.log('Accounts:', accounts);
    console.log('Selected address:', accounts[0]);
    
    // Get chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Chain ID:', chainId);
    
    return {
      success: true,
      accounts,
      selectedAddress: accounts[0],
      chainId
    };
    
  } catch (error) {
    console.log('ERROR: Connection test failed:', error);
    
    if (error.code === 4001) {
      console.log('User rejected the connection request');
    } else if (error.code === -32002) {
      console.log('MetaMask is already processing a request');
    } else if (error.code === -32603) {
      console.log('Internal JSON-RPC error - MetaMask might be locked');
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export const checkMetaMaskPermissions = async () => {
  console.log('=== Checking MetaMask Permissions ===');
  
  try {
    if (!window.ethereum) {
      throw new Error('No Ethereum provider found');
    }
    
    // Check if we have permission to access accounts
    const permissions = await window.ethereum.request({
      method: 'wallet_getPermissions'
    });
    
    console.log('Permissions:', permissions);
    
    // Check if we have account access permission
    const hasAccountAccess = permissions.some(permission => 
      permission.parentCapability === 'eth_accounts'
    );
    
    console.log('Has account access:', hasAccountAccess);
    
    return {
      success: true,
      permissions,
      hasAccountAccess
    };
    
  } catch (error) {
    console.log('ERROR: Error checking permissions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-run debug on import (only in browser)
if (typeof window !== 'undefined') {
  // Wait a bit for MetaMask to initialize
  setTimeout(() => {
    console.log('DEBUG: Auto-running MetaMask debug...');
    debugMetaMask();
  }, 1000);
  
  // Add global debug functions for console access
  window.debugMetaMask = debugMetaMask;
  window.testMetaMaskConnection = testMetaMaskConnection;
  window.checkMetaMaskPermissions = checkMetaMaskPermissions;
  
  console.log('DEBUG: Debug functions available:');
  console.log('  debugMetaMask() - Check MetaMask status');
  console.log('  testMetaMaskConnection() - Test connection');
  console.log('  checkMetaMaskPermissions() - Check permissions');
}
