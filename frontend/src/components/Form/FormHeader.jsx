import React from 'react';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Form header component with title, description, and success indicators
 */
const FormHeader = ({ hasGeneratedContent }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
        <SparklesIcon className="w-8 h-8 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
        Generate AI Content
      </h2>
      
      <p className="text-gray-600">
        Create stunning artwork with AI and blockchain protection
      </p>
      
      {/* Success Indicator */}
      {hasGeneratedContent && (
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium rounded-full border border-green-200 animate-fade-in">
          <CheckCircleIcon className="w-4 h-4" />
          <span>Content generated successfully! View above.</span>
        </div>
      )}
      
      {/* Scroll to Top Hint */}
      {hasGeneratedContent && (
        <div className="mt-3 text-xs text-gray-400">
          ↑ Generated content appears above ↑
        </div>
      )}
    </div>
  );
};

export default FormHeader;



