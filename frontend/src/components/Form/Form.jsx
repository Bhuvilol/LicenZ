import React from 'react';
import { AIGenerationLoading } from '../LoadingState';
import { useFormState } from './useFormState';
import FormHeader from './FormHeader';
import FormPromptInput from './FormPromptInput';
import FormStyleSelection from './FormStyleSelection';
import FormAdvancedOptions from './FormAdvancedOptions';
import FormActions from './FormActions';
import FormInfoSection from './FormInfoSection';

/**
 * Main Form component for AI content generation
 * Refactored for better maintainability and readability
 */
const Form = ({
  prompt,
  setPrompt,
  selectedStyle,
  setSelectedStyle,
  generationOptions,
  setGenerationOptions,
  showAdvancedOptions,
  setShowAdvancedOptions,
  stylePresets,
  availableOptions,
  apiStatus,
  isGenerating,
  onSubmit,
  hasGeneratedContent
}) => {
  // Use custom hook for form state management
  const formState = useFormState(prompt, isGenerating);

  // Show AI generation loading when generating
  if (isGenerating) {
    return <AIGenerationLoading progress={formState.generationProgress} />;
  }

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
        {/* Form Header */}
        <FormHeader hasGeneratedContent={hasGeneratedContent} />
        
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Prompt Input */}
          <FormPromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            promptLength={formState.promptLength}
            showPromptPreview={formState.showPromptPreview}
            togglePromptPreview={formState.togglePromptPreview}
          />

          {/* Style Selection */}
          <FormStyleSelection
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            stylePresets={stylePresets}
          />

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <FormAdvancedOptions
              generationOptions={generationOptions}
              setGenerationOptions={setGenerationOptions}
              availableOptions={availableOptions}
              apiStatus={apiStatus}
            />
          )}

          {/* Form Actions */}
          <FormActions
            showAdvancedOptions={showAdvancedOptions}
            setShowAdvancedOptions={setShowAdvancedOptions}
            isGenerating={isGenerating}
            prompt={prompt}
            apiStatus={apiStatus}
          />
        </form>

        {/* Info Section */}
        <FormInfoSection />
      </div>
    </div>
  );
};

export default Form;



