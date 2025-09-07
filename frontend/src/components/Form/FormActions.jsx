import React from 'react';
import { SparklesIcon, CogIcon } from '@heroicons/react/24/outline';

/**
 * Form actions component with submit button and advanced options toggle
 */
const FormActions = ({ 
  showAdvancedOptions, 
  setShowAdvancedOptions, 
  isGenerating, 
  prompt, 
  apiStatus 
}) => {
  return (
    <div className="space-y-6">
      {/* Advanced Options Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
        >
          <CogIcon className="w-4 h-4" />
          {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>
      
      {/* Generate Button */}
      <button
        type="submit"
        disabled={isGenerating || !prompt.trim() || !apiStatus.isConfigured}
        className="group w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white py-4 px-8 rounded-xl font-bold hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
        Generate AI Content
      </button>
    </div>
  );
};

export default FormActions;




