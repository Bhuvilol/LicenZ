/**
 * Blockchain utility functions
 * Common operations and data formatting for blockchain interactions
 */

/**
 * Format blockchain content data by converting BigNumber to regular numbers
 * @param {Object} content - Raw blockchain content data
 * @returns {Object} - Formatted content data
 */
export const formatBlockchainContent = (content) => {
  return {
    id: content.id.toString(),
    creator: content.creator,
    prompt: content.prompt,
    ipfsHash: content.ipfsHash,
    style: content.style,
    cfg_scale: content.cfgScale.toString(),
    steps: content.steps.toString(),
    height: content.height.toString(),
    width: content.width.toString(),
    model: content.model,
    createdAt: new Date(Number(content.createdAt) * 1000).toISOString(),
    isLicensed: content.isLicensed,
    licensePrice: content.licensePrice.toString(),
    licenseTerms: content.licenseTerms,
    licensee: content.licensee,
    licensedAt: Number(content.licensedAt) > 0 
      ? new Date(Number(content.licensedAt) * 1000).toISOString() 
      : null
  };
};

/**
 * Format transaction result with common fields
 * @param {Object} tx - Transaction object
 * @param {Object} receipt - Transaction receipt
 * @param {string} message - Success message
 * @returns {Object} - Formatted transaction result
 */
export const formatTransactionResult = (tx, receipt, message) => {
  return {
    success: true,
    transactionHash: tx.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    message
  };
};

/**
 * Extract token ID from transaction receipt
 * @param {Object} receipt - Transaction receipt
 * @param {Object} contract - Contract instance
 * @returns {Promise<number>} - Token ID
 */
export const extractTokenIdFromReceipt = async (receipt, contract) => {
  try {
    // Parse events to find the ContentCreated event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'ContentCreated';
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog(event);
      return Number(parsed.args.tokenId);
    }

    // Fallback: get the latest token ID
    const totalCount = await contract.getTotalContentCount();
    return Number(totalCount);
  } catch (error) {
    console.warn('Could not extract token ID from transaction, using fallback method');
    const totalCount = await contract.getTotalContentCount();
    return Number(totalCount);
  }
};

/**
 * Validate service initialization
 * @param {boolean} isInitialized - Service initialization status
 * @param {Object} contract - Contract instance
 * @throws {Error} - If service is not properly initialized
 */
export const validateServiceInitialization = (isInitialized, contract) => {
  if (!isInitialized) {
    throw new Error('Service not initialized');
  }
  if (!contract) {
    throw new Error('Contract not available');
  }
};


