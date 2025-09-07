import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * Form info section with feature highlights and security information
 */
const FormInfoSection = () => {
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
          <ShieldCheckIcon className="w-5 h-5 text-white" />
        </div>
        
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-2">Your content will be automatically:</p>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Generated using Stable Diffusion XL
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Fingerprinted with unique hashes
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Stored securely on IPFS
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Ready for NFT minting
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Protected with blockchain licensing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormInfoSection;




