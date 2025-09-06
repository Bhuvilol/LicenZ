import React from 'react';
import { SwatchIcon } from '@heroicons/react/24/outline';

/**
 * Empty state component when no content is generated
 */
const DisplayEmptyState = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <SwatchIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-500 mb-2">
            No Content Generated Yet
          </h3>
          <p className="text-gray-400">
            Use the form below to create your first AI-generated artwork
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisplayEmptyState;


