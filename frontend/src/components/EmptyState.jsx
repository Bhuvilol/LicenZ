import React from 'react';
import { 
  SwatchIcon, 
  SparklesIcon, 
  PlusIcon, 
  ArrowRightIcon, 
  PhotoIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const EmptyState = ({ onGenerateClick, walletAddress }) => {
  return (
    <div className="max-w-4xl mx-auto text-center py-16 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
        {/* Main Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
            <SwatchIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-purple-400 via-blue-500 to-indigo-600 rounded-full animate-ping opacity-20"></div>
        </div>
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Your Content Library is Empty
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Start creating amazing AI-generated content that will be automatically protected with blockchain licensing 
          and ready for NFT minting. Your first masterpiece is just a prompt away!
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <SwatchIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-purple-800 mb-2">AI Generation</h3>
            <p className="text-sm text-purple-600">Create stunning artwork with Stable Diffusion XL</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">Blockchain Protection</h3>
            <p className="text-sm text-blue-600">Automatic fingerprinting and IPFS storage</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <PhotoIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">NFT Ready</h3>
            <p className="text-sm text-green-600">Mint your content as NFTs instantly</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onGenerateClick}
            className="group bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 mx-auto"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Your First AI Content</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <p className="text-sm text-gray-500">
            Connected wallet: <span className="font-mono text-gray-700">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}</span>
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 mt-8">
          <SparklesIcon className="w-5 h-5 text-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <SparklesIcon className="w-5 h-5 text-blue-500 animate-bounce" style={{ animationDelay: '200ms' }} />
          <SparklesIcon className="w-5 h-5 text-purple-500 animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
