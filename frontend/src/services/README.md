# Services Directory

This directory contains all the service modules for the LicenZ application, organized for better maintainability and readability.

## Structure

```
services/
├── constants/           # Shared constants and configurations
│   └── contractABI.js  # Smart contract ABI definitions
├── utils/              # Utility functions
│   └── blockchainUtils.js  # Blockchain operation utilities
├── index.js            # Main service exports
├── onChainService.js   # Refactored blockchain service
├── aiService.js        # AI generation service
├── backendService.js   # Backend API service
├── blockchainService.js # Legacy blockchain service
├── ipfsService.js      # IPFS file service
├── licenseService.js   # License management service
├── nftService.js       # NFT minting service
├── verbwireService.js  # Verbwire integration service
└── walletService.js    # Wallet connection service
```

## Refactoring Benefits

### Before Refactoring
- **onChainService.js**: 334 lines
- Mixed concerns (ABI, utilities, business logic)
- Code duplication
- Hard to maintain and test

### After Refactoring
- **onChainService.js**: ~180 lines (47% reduction)
- **contractABI.js**: 25 lines (ABI definitions)
- **blockchainUtils.js**: 85 lines (utility functions)
- Clear separation of concerns
- Reusable utilities
- Easier to maintain and test

## Key Improvements

### 1. Constants Extraction (`contractABI.js`)
- Centralized ABI definitions
- Default content parameters
- Easy to update contract interfaces

### 2. Utility Functions (`blockchainUtils.js`)
- `formatBlockchainContent()` - Format blockchain data
- `formatTransactionResult()` - Standardize transaction responses
- `extractTokenIdFromReceipt()` - Extract token IDs from receipts
- `validateServiceInitialization()` - Service validation

### 3. Cleaner Main Service
- Focused on business logic
- Uses utility functions for common operations
- Better error handling
- Consistent validation patterns

## Usage Examples

### Importing Services
```javascript
import { onChainService, formatBlockchainContent } from '../services';
```

### Using Utilities
```javascript
import { validateServiceInitialization } from '../services/utils/blockchainUtils';

// Validate before operations
validateServiceInitialization(this.isInitialized, this.contract);
```

### Using Constants
```javascript
import { DEFAULT_CONTENT_PARAMS } from '../services/constants/contractABI';

const style = contentData.style || DEFAULT_CONTENT_PARAMS.style;
```

## Best Practices

1. **Keep services focused** - Each service should have a single responsibility
2. **Use utilities** - Extract common operations into reusable functions
3. **Centralize constants** - Keep configurations in dedicated files
4. **Consistent validation** - Use shared validation functions
5. **Clear naming** - Use descriptive function and variable names

## Future Improvements

- Add TypeScript for better type safety
- Implement service interfaces
- Add comprehensive error handling
- Create service tests
- Add service monitoring and logging


