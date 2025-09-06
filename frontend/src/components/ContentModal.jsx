import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ArrowDownTrayIcon, 
  DocumentDuplicateIcon, 
  CheckCircleIcon, 
  TrashIcon, 
  SparklesIcon, 
  ArrowPathIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const ContentModal = ({ 
  selectedContent, 
  onClose, 
  onDownload, 
  onCopyHash, 
  onMintNFT, 
  onDelete, 
  mintingStatus 
}) => {
  const [copiedField, setCopiedField] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  if (!selectedContent) return null;

  // Copy to clipboard function
  const handleCopyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
         <div className="p-6">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-gray-900">Content Details</h3>
             <button
               onClick={onClose}
               className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
             >
               <XMarkIcon className="w-4 h-4" />
             </button>
           </div>

                     <div className="flex flex-col lg:flex-row gap-4">
             {/* Left Column - Image and Description */}
             <div className="lg:w-[57%]">
               {/* Image Section */}
               <div className="mb-3">
                 {(selectedContent.ImageData || selectedContent.imageUrl) ? (
                   selectedContent.ImageData ? (
                     <img
                       src={`data:image/png;base64,${selectedContent.ImageData}`}
                       alt={selectedContent.prompt}
                       className="w-full max-w-md mx-auto rounded-lg shadow-md"
                     />
                   ) : (
                     <img
                       src={selectedContent.imageUrl}
                       alt={selectedContent.prompt}
                       className="w-full max-w-md mx-auto rounded-lg shadow-md"
                     />
                   )
                 ) : (
                   <div className="w-full max-w-md mx-auto h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                     <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   </div>
                 )}
               </div>

               {/* Description Section - Below Image */}
               <div className="space-y-4">
                 <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
                   <p className="text-gray-800 text-xs bg-gray-50 p-3 rounded-lg border">
                     {selectedContent.prompt}
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white border rounded-lg p-3">
                     <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Style</span>
                     <p className="text-gray-900 mt-1.5 capitalize font-semibold text-xs">{selectedContent.style}</p>
                   </div>

                   <div className="bg-white border rounded-lg p-3">
                     <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Created</span>
                     <p className="text-gray-900 mt-1.5 font-semibold text-xs">
                       {new Date(selectedContent.created_at).toLocaleDateString()}
                     </p>
                   </div>

                   <div className="bg-white border rounded-lg p-3">
                     <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Model</span>
                     <p className="text-gray-900 mt-1.5 font-mono text-xs">{selectedContent.model || 'Stable Diffusion XL'}</p>
                   </div>

                   {selectedContent.width && selectedContent.height && (
                     <div className="bg-white border rounded-lg p-3">
                       <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Dimensions</span>
                       <p className="text-gray-900 mt-1.5 font-mono text-xs">
                         {selectedContent.width} × {selectedContent.height}
                       </p>
                     </div>
                   )}
                 </div>

                 {selectedContent.seed && (
                   <div className="bg-white border rounded-lg p-3">
                     <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Seed</span>
                     <p className="text-gray-900 mt-1.5 font-mono text-xs break-all">{selectedContent.seed}</p>
                   </div>
                 )}
               </div>
             </div>

             {/* Right Column - NFT Licensing Information */}
             <div className="lg:w-[43%] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border">{/* Content Info */}
               <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-4">
                   <SparklesIcon className="w-4 h-4 text-purple-600" />
                   <h4 className="text-base font-bold text-gray-900">Licensing & NFT Info</h4>
                 </div>
                {selectedContent.NFTMinted ? (
                  <div className="space-y-4">
                                         {/* NFT Status */}
                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
                       <div className="flex items-center gap-2 mb-4">
                         <CheckCircleIcon className="w-5 h-5 text-green-600" />
                         <span className="font-bold text-green-800 text-base">NFT Minted</span>
                       </div>
                       
                       {selectedContent.NFTTokenID && (
                         <div className="bg-white rounded-lg p-4 mb-4">
                           <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Token ID</span>
                           <p className="text-xl font-bold text-gray-900 font-mono">#{selectedContent.NFTTokenID}</p>
                         </div>
                       )}
                       
                       {selectedContent.chain && (
                         <div className="bg-white rounded-lg p-4 mb-4">
                           <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Network</span>
                           <p className="text-lg font-bold text-gray-900 capitalize">{selectedContent.chain}</p>
                         </div>
                       )}
                       
                       <div className="grid grid-cols-1 gap-4 text-sm">
                         <div className="flex justify-between bg-white rounded p-4">
                           <span className="text-gray-600 font-medium">Network:</span>
                           <span className="font-semibold text-gray-900 capitalize">{selectedContent.chain || 'Sepolia'}</span>
                         </div>
                         <div className="flex justify-between bg-white rounded p-4">
                           <span className="text-gray-600 font-medium">Standard:</span>
                           <span className="font-semibold text-gray-900">ERC-721</span>
                         </div>
                         {selectedContent.method && (
                           <div className="flex justify-between bg-white rounded p-4">
                             <span className="text-gray-600 font-medium">Method:</span>
                             <span className="font-semibold text-gray-900 capitalize">{selectedContent.method}</span>
                           </div>
                         )}
                         {selectedContent.mintedAt && (
                           <div className="flex justify-between bg-white rounded p-4">
                             <span className="text-gray-600 font-medium">Minted:</span>
                             <span className="font-semibold text-gray-900">{new Date(selectedContent.mintedAt).toLocaleDateString()}</span>
                           </div>
                         )}
                       </div>
                     </div>

                    {/* Contract & Transaction Info */}
                    {(selectedContent.contractAddress || selectedContent.transactionHash) && (
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Blockchain Details
                        </h5>
                        
                        {selectedContent.contractAddress && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Contract Address</span>
                            <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded">
                              <p className="text-sm font-mono text-gray-900 break-all flex-1">{selectedContent.contractAddress}</p>
                              <button
                                onClick={() => handleCopyToClipboard(selectedContent.contractAddress, 'contract')}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                title="Copy Contract Address"
                              >
                                {copiedField === 'contract' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {selectedContent.transactionHash && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Transaction Hash</span>
                            <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded">
                              <p className="text-sm font-mono text-gray-900 break-all flex-1">{selectedContent.transactionHash}</p>
                              <button
                                onClick={() => handleCopyToClipboard(selectedContent.transactionHash, 'transaction')}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                title="Copy Transaction Hash"
                              >
                                {copiedField === 'transaction' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Licensing Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        License Available
                      </h5>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between bg-gray-50 rounded p-3">
                          <span className="text-gray-600 font-medium">Type:</span>
                          <span className="font-semibold text-blue-600">Commercial</span>
                        </div>
                        <div className="flex justify-between bg-gray-50 rounded p-3">
                          <span className="text-gray-600 font-medium">Platform:</span>
                          <span className="font-semibold text-purple-600">LicenZ</span>
                        </div>
                        <div className="flex justify-between bg-gray-50 rounded p-3">
                          <span className="text-gray-600 font-medium">Rights:</span>
                          <span className="font-semibold text-green-600">Full Usage</span>
                        </div>
                        <div className="flex justify-between bg-gray-50 rounded p-3">
                          <span className="text-gray-600 font-medium">Content Type:</span>
                          <span className="font-semibold text-gray-900">AI Generated Art</span>
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Verification */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <h5 className="font-bold text-blue-800 mb-4">Blockchain Verified</h5>
                      <div className="space-y-3 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Ownership verified on blockchain</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Content hash cryptographically secured</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Licensing terms immutably recorded</span>
                        </div>
                      </div>
                      
                      {selectedContent.transactionHash && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <a
                            href={`https://${selectedContent.chain === 'mainnet' ? '' : selectedContent.chain + '.'}etherscan.io/tx/${selectedContent.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View on Etherscan
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Pre-NFT State */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <span className="font-bold text-orange-800 text-lg">Not Yet Minted</span>
                      </div>
                      <p className="text-orange-700 mb-4">
                        Mint this content as an NFT to enable licensing and blockchain verification.
                      </p>
                      <button
                        onClick={() => onMintNFT(selectedContent)}
                        disabled={mintingStatus[selectedContent.id] === 'minting' || mintingStatus[selectedContent.id] === 'uploading'}
                        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                          mintingStatus[selectedContent.id] === 'minting' || mintingStatus[selectedContent.id] === 'uploading'
                            ? 'bg-purple-300 text-purple-600 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-105'
                        }`}
                      >
                        {mintingStatus[selectedContent.id] === 'minting' || mintingStatus[selectedContent.id] === 'uploading' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Minting...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <SparklesIcon className="h-5 w-5" />
                            Mint as NFT
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Future Benefits */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                      <h5 className="font-bold text-gray-800 mb-4">After Minting Benefits</h5>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <span>Commercial licensing available</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span>Blockchain ownership proof</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span>Immutable content verification</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span>Transferable digital asset</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Content Hash */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h5 className="font-bold text-gray-800 mb-3">Content Hash</h5>
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono text-gray-900 break-all flex-1">
                      {selectedContent.content_hash || selectedContent.hash || selectedContent.ContentHash || (
                        <span className="text-gray-500 italic">No hash available - Content may not have been processed yet</span>
                      )}
                    </code>
                    <button
                      onClick={() => onCopyHash(selectedContent.content_hash || selectedContent.hash || selectedContent.ContentHash)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="Copy Hash"
                      disabled={!selectedContent.content_hash && !selectedContent.hash && !selectedContent.ContentHash}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  

                  
                  {/* Hash Generation Info */}
                  {!selectedContent.content_hash && !selectedContent.hash && !selectedContent.ContentHash && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-800">
                        <div className="font-medium mb-1">ℹ️ About Content Hash:</div>
                        <div>• Content hash is generated when AI content is created</div>
                        <div>• It provides cryptographic proof of content authenticity</div>
                        <div>• If empty, the content may be from an older version or still processing</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
                     {/* Action Buttons - Full Width at Bottom */}
           <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6">
             <button
               onClick={async () => {
                 setIsDownloading(true);
                 setDownloadSuccess(false);
                 try {
                   await onDownload(selectedContent);
                   setDownloadSuccess(true);
                   setTimeout(() => setDownloadSuccess(false), 3000);
                 } catch (error) {
                   console.error('Download failed:', error);
                 } finally {
                   setIsDownloading(false);
                 }
               }}
               disabled={isDownloading}
               className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                 isDownloading
                   ? 'bg-blue-300 text-blue-600 cursor-not-allowed'
                   : downloadSuccess
                   ? 'bg-green-500 text-white cursor-default'
                   : 'bg-blue-500 text-white hover:bg-blue-600'
               }`}
             >
               {isDownloading ? (
                 <>
                   <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                   Downloading...
                 </>
               ) : downloadSuccess ? (
                 <>
                   <CheckCircle className="h-4 w-4 inline mr-2" />
                   Downloaded!
                 </>
               ) : (
                 <>
                   <Download className="h-4 w-4 inline mr-2" />
                   Download
                 </>
               )}
             </button>
            
                         {!selectedContent.NFTMinted ? (
               <button
                 onClick={() => onMintNFT(selectedContent)}
                 disabled={mintingStatus[selectedContent.id] === 'minting' || mintingStatus[selectedContent.id] === 'uploading'}
                 className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                   mintingStatus[selectedContent.id] === 'minting' || mintingStatus[selectedContent.id] === 'uploading'
                     ? 'bg-purple-300 text-purple-600 cursor-not-allowed'
                     : 'bg-purple-500 text-white hover:bg-purple-600'
                 }`}
               >
                 {mintingStatus[selectedContent.id] === 'minting' || mintingStatus[selectedContent.id] === 'uploading' ? (
                   <>
                     <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                     Minting...
                   </>
                 ) : (
                   <>
                     <SparklesIcon className="h-4 w-4 inline mr-2" />
                     Mint as NFT
                   </>
                 )}
               </button>
             ) : (
               <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg cursor-default font-semibold text-sm">
                 <CheckCircle className="h-4 w-4 inline mr-2" />
                 NFT Minted
               </button>
             )}
             
             <button
               onClick={() => onDelete(selectedContent.id)}
               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
             >
               <Trash2 className="h-4 w-4 inline mr-2" />
               Delete
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
