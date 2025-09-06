import React from 'react';
import { SwatchIcon } from '@heroicons/react/24/outline';

/**
 * Style selection component with preset options
 */
const FormStyleSelection = ({ 
  selectedStyle, 
  setSelectedStyle, 
  stylePresets 
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <SwatchIcon className="w-4 h-4 text-purple-600" />
        Choose your artistic style
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stylePresets.map((style) => (
          <button
            key={style.value}
            type="button"
            onClick={() => setSelectedStyle(style.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
              selectedStyle === style.value
                ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-25'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                selectedStyle === style.value ? 'bg-purple-500' : 'bg-gray-300'
              }`} />
              <span>{style.label}</span>
            </div>
            {style.description && (
              <p className="text-xs text-gray-500 mt-1 text-left">
                {style.description}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormStyleSelection;



