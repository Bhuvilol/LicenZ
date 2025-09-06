// Simplified error handling utilities

/**
 * Safely execute an async function with basic error handling
 */
export const safeExecute = async (fn, context = 'Unknown') => {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error in ${context}:`, error.message);
    throw error;
  }
};

/**
 * Get user-friendly error messages
 */
export const getUserFriendlyMessage = (error) => {
  const message = error.message || 'An error occurred';
  
  if (message.includes('User rejected')) return 'Operation cancelled';
  if (message.includes('insufficient funds')) return 'Insufficient funds';
  if (message.includes('network')) return 'Network connection issue';
  if (message.includes('wallet')) return 'Wallet connection issue';
  if (message.includes('contract')) return 'Smart contract issue';
  if (message.includes('IPFS')) return 'Storage issue';
  
  return message;
};
