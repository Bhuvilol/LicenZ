import React from 'react';

const ContentHeader = ({ contentCount, onRefresh, filteringStatus }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Content Library</h2>
        <p className="text-gray-600">Manage your AI-generated content</p>
        {filteringStatus && (
          <p className="text-sm text-blue-600 mt-1">
            🔍 {filteringStatus}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500">
          {contentCount} item{contentCount !== 1 ? 's' : ''}
        </span>
        <button
          onClick={onRefresh}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ContentHeader;
