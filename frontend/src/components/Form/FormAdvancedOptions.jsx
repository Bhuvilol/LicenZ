import React from 'react';
import { CogIcon } from '@heroicons/react/24/outline';

/**
 * Advanced options component with CFG Scale and Steps sliders
 */
const FormAdvancedOptions = ({ 
  generationOptions, 
  setGenerationOptions, 
  availableOptions, 
  apiStatus 
}) => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <CogIcon className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Advanced Options</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CFG Scale */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            CFG Scale: <span className="text-purple-600 font-bold">{generationOptions.cfg_scale}</span>
          </label>
          <input
            type="range"
            min={availableOptions.cfg_scale.min}
            max={availableOptions.cfg_scale.max}
            value={generationOptions.cfg_scale}
            onChange={(e) => setGenerationOptions(prev => ({...prev, cfg_scale: parseInt(e.target.value)}))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            disabled={!apiStatus.isConfigured}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{availableOptions.cfg_scale.min}</span>
            <span>{availableOptions.cfg_scale.max}</span>
          </div>
          <p className="text-xs text-gray-600">{availableOptions.cfg_scale.description}</p>
        </div>
        
        {/* Steps */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Steps: <span className="text-purple-600 font-bold">{generationOptions.steps}</span>
          </label>
          <input
            type="range"
            min={availableOptions.steps.min}
            max={availableOptions.steps.max}
            value={generationOptions.steps}
            onChange={(e) => setGenerationOptions(prev => ({...prev, steps: parseInt(e.target.value)}))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            disabled={!apiStatus.isConfigured}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{availableOptions.steps.min}</span>
            <span>{availableOptions.steps.max}</span>
          </div>
          <p className="text-xs text-gray-600">{availableOptions.steps.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FormAdvancedOptions;



