import React from 'react';
import { 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  XMarkIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const Messages = ({ 
  apiStatus, 
  success, 
  error, 
  onErrorDismiss, 
  onErrorRetry, 
  showRetry = false 
}) => {
  return (
    <>
      {/* API Status Alert */}
      {!apiStatus.isConfigured && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">API Configuration Required</p>
                <p className="mt-1">{apiStatus.message}</p>
                <p className="mt-2">
                  <a 
                    href="https://platform.stability.ai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-red-900"
                  >
                    Get your free API key here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {success && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-800 font-medium">{success}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-red-800">
                    Generation Error
                  </h3>
                  {onErrorDismiss && (
                    <button
                      onClick={onErrorDismiss}
                      className="ml-auto -mr-1.5 -mt-1.5 rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
                {showRetry && onErrorRetry && (
                  <div className="mt-3">
                    <button
                      onClick={onErrorRetry}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
