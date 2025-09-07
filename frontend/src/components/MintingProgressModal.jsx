import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  LinkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const MintingProgressModal = ({ 
  isOpen, 
  onClose, 
  mintingStatus, 
  contentData,
  onSuccess,
  onError 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepDetails, setStepDetails] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);

  const steps = [
    {
      id: 'uploading_image',
      title: 'Uploading Image',
      description: 'Uploading your AI-generated content to IPFS',
      icon: CloudArrowUpIcon,
      color: 'blue',
      estimatedTime: '30-60 seconds'
    },
    {
      id: 'uploading_metadata',
      title: 'Creating Metadata',
      description: 'Generating NFT metadata and uploading to IPFS',
      icon: DocumentTextIcon,
      color: 'purple',
      estimatedTime: '15-30 seconds'
    },
    {
      id: 'minting',
      title: 'Minting NFT',
      description: 'Creating your NFT on the blockchain',
      icon: SparklesIcon,
      color: 'green',
      estimatedTime: '60-120 seconds'
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      setStepDetails({});
      setIsCompleted(false);
      setHasError(false);
      setShowSuccessAnimation(false);
      setShowErrorAnimation(false);
      return;
    }

    // Simulate progress based on minting status
    const updateProgress = () => {
      const stepIndex = steps.findIndex(step => step.id === mintingStatus);
      
      if (stepIndex >= 0) {
        setCurrentStep(stepIndex);
        setProgress((stepIndex + 1) * 33.33);
        
        // Add step details
        setStepDetails(prev => ({
          ...prev,
          [mintingStatus]: {
            started: true,
            completed: false,
            timestamp: new Date().toISOString()
          }
        }));
      }
    };

    // Handle completion and error states
    if (mintingStatus === 'completed') {
      setIsCompleted(true);
      setProgress(100);
      setShowSuccessAnimation(true);
      // Mark all steps as completed
      setStepDetails(prev => {
        const updated = { ...prev };
        steps.forEach(step => {
          updated[step.id] = { ...updated[step.id], completed: true };
        });
        return updated;
      });
    } else if (mintingStatus === 'error') {
      setHasError(true);
      setShowErrorAnimation(true);
    } else {
      updateProgress();
    }
  }, [mintingStatus, isOpen]);

  const handleClose = () => {
    if (isCompleted || hasError) {
      onClose();
    }
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getStepColor = (step, status) => {
    if (status === 'completed') return 'text-green-600 bg-green-100';
    if (status === 'active') return `text-${step.color}-600 bg-${step.color}-100`;
    return 'text-gray-400 bg-gray-100';
  };

  const getIconColor = (step, status) => {
    if (status === 'completed') return 'text-green-600';
    if (status === 'active') return `text-${step.color}-600`;
    return 'text-gray-400';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all duration-500 ${
                isCompleted ? 'bg-green-100' : 
                hasError ? 'bg-red-100' : 
                'bg-purple-100'
              }`}>
                {isCompleted ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                ) : hasError ? (
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
                ) : (
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-bold transition-colors duration-500 ${
                  isCompleted ? 'text-green-900' : 
                  hasError ? 'text-red-900' : 
                  'text-gray-900'
                }`}>
                  {isCompleted ? 'NFT Minted Successfully!' : 
                   hasError ? 'Minting Failed' : 
                   'Minting Your NFT'}
                </h3>
                <p className={`text-sm transition-colors duration-500 ${
                  isCompleted ? 'text-green-700' : 
                  hasError ? 'text-red-700' : 
                  'text-gray-600'
                }`}>
                  {isCompleted ? 'Your AI-generated content is now a verified NFT' : 
                   hasError ? 'There was an error during the minting process' : 
                   'Creating your AI-generated content as an NFT'}
                </p>
              </div>
            </div>
            {(isCompleted || hasError) && (
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Success Animation */}
          {showSuccessAnimation && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900">🎉 Congratulations!</h4>
                  <p className="text-sm text-green-700">
                    Your NFT has been successfully minted and is now live on the blockchain!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Animation */}
          {showErrorAnimation && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-red-900">⚠️ Minting Failed</h4>
                  <p className="text-sm text-red-700">
                    There was an error during the minting process. Please try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content Preview */}
          {contentData && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                {contentData.ImageData && (
                  <img
                    src={`data:image/png;base64,${contentData.ImageData}`}
                    alt={contentData.prompt}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 line-clamp-2">
                    {contentData.prompt}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {contentData.style} • {contentData.model || 'Stable Diffusion XL'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium transition-colors duration-500 ${
                isCompleted ? 'text-green-700' : 
                hasError ? 'text-red-700' : 
                'text-gray-700'
              }`}>
                Progress
              </span>
              <span className={`text-sm transition-colors duration-500 ${
                isCompleted ? 'text-green-600' : 
                hasError ? 'text-red-600' : 
                'text-gray-500'
              }`}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  hasError ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  'bg-gradient-to-r from-purple-500 to-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const Icon = step.icon;
              const isActive = status === 'active';
              const isCompleted = status === 'completed';

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                    isActive 
                      ? `border-${step.color}-200 bg-${step.color}-50` 
                      : isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`p-3 rounded-full ${getStepColor(step, status)}`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : isActive ? (
                      <ArrowPathIcon className="w-6 h-6 animate-spin" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        isActive ? `text-${step.color}-900` : 
                        isCompleted ? 'text-green-900' : 
                        'text-gray-700'
                      }`}>
                        {step.title}
                      </h4>
                      {isActive && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                    <p className={`text-sm ${
                      isActive ? `text-${step.color}-700` : 
                      isCompleted ? 'text-green-700' : 
                      'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                    
                    {/* Step Details */}
                    {stepDetails[step.id] && (
                      <div className="mt-2 text-xs text-gray-600">
                        {stepDetails[step.id].started && !stepDetails[step.id].completed && (
                          <span className="flex items-center gap-1">
                            <ArrowPathIcon className="w-3 h-3 animate-spin" />
                            In progress...
                          </span>
                        )}
                        {stepDetails[step.id].completed && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircleIcon className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Message */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <LinkIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {mintingStatus === 'uploading_image' && 'Uploading your image to decentralized storage...'}
                  {mintingStatus === 'uploading_metadata' && 'Creating and uploading NFT metadata...'}
                  {mintingStatus === 'minting' && 'Minting your NFT on the blockchain...'}
                  {!mintingStatus && 'Preparing to mint your NFT...'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  This process may take a few minutes. Please keep this window open.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(isCompleted || hasError) && (
            <div className="mt-6 flex gap-3">
              {isCompleted && (
                <button
                  onClick={onSuccess}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  View Your NFT
                </button>
              )}
              {hasError && (
                <button
                  onClick={onError}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintingProgressModal;
