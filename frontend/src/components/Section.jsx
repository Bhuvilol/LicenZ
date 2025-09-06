import React from 'react';
import { 
  SparklesIcon, 
  ShieldCheckIcon, 
  WalletIcon 
} from '@heroicons/react/24/outline';

const Section = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI Generation',
      description: 'Create unique content using Stable Diffusion XL with customizable parameters.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Blockchain Protection',
      description: 'Immutable proof of ownership and licensing terms stored on the blockchain.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: WalletIcon,
      title: 'NFT Monetization',
      description: 'Mint your content as NFTs and earn from licensing and sales.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Features</h2>
        <p className="text-gray-600">Everything you need to create, protect, and monetize AI content</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="group">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
