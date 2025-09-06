import React from 'react';
import { SwatchIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * Prompt input component with character count and preview toggle
 */
const FormPromptInput = ({ 
  prompt, 
  setPrompt, 
  promptLength, 
  showPromptPreview, 
  togglePromptPreview 
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <SwatchIcon className="w-4 h-4 text-purple-600" />
        Describe what you want to create
      </label>
      
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
          placeholder="A beautiful sunset over mountains with dramatic clouds..."
          rows={4}
          maxLength={500}
        />
        
        {/* Character count and preview toggle */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <button
            type="button"
            onClick={togglePromptPreview}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPromptPreview ? (
              <>
                <EyeSlashIcon className="w-3 h-3" />
                Hide preview
              </>
            ) : (
              <>
                <EyeIcon className="w-3 h-3" />
                Show preview
              </>
            )}
          </button>
          
          <span className={`text-xs ${promptLength > 450 ? 'text-red-500' : 'text-gray-400'}`}>
            {promptLength}/500
          </span>
        </div>
      </div>
      
      {/* Prompt preview */}
      {showPromptPreview && prompt && (
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-800 mb-2">Prompt Preview:</h4>
          <p className="text-purple-700 text-sm italic">"{prompt}"</p>
        </div>
      )}
    </div>
  );
};

export default FormPromptInput;



