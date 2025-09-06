import React from 'react';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  XMarkIcon
} from '@heroicons/react/24/outline';

const ErrorState = ({ 
  error, 
  onRetry, 
  onDismiss, 
  showRetry = true,
  title = 'Something went wrong',
  description = 'We encountered an error while processing your request.'
}) => {
  if (!error) return null;

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-red-800">{title}</h3>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <p className="text-red-700 mb-4">{description}</p>
            
            <div className="bg-white rounded-lg p-4 border border-red-200 mb-4">
              <p className="text-sm text-red-600 font-mono break-words">{error}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Try Again
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
