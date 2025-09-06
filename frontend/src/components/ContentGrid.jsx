import React from 'react';
import ContentCard from './ContentCard';

const ContentGrid = ({ content, onView, onDownload, onMintNFT, onDelete, mintingStatus }) => {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {content.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onView={onView}
            onDownload={onDownload}
            onMintNFT={onMintNFT}
            onDelete={onDelete}
            mintingStatus={mintingStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentGrid;
