import React from 'react';
import { 
  SparklesIcon, 
  FolderIcon, 
  BoltIcon 
} from '@heroicons/react/24/outline';

const Nav = ({ activeTab, onTabChange, contentCount }) => {
  const tabs = [
    {
      id: 'generate',
      label: 'Generate AI Content',
      icon: SparklesIcon,
      count: null
    },
    
  ];

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Nav;
