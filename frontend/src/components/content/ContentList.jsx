import React from 'react';
import ContentGrid from '../ContentGrid';
import EmptyState from '../EmptyState';
import LoadingState from '../LoadingState';
import ErrorState from '../ErrorState';

const ContentList = ({ 
  content, 
  loading, 
  error, 
  onRefresh,
  onContentClick,
  onShowModal,
  onMintNFT,
  onDelete,
  onDownload,
  mintingStatus,
  isDeleting,
  isDownloading
}) => {
  if (loading) {
    return <LoadingState message="Loading content..." />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={onRefresh}
        title="Failed to load content"
        description="We couldn't load your content. Please try again."
      />
    );
  }

  if (content.length === 0) {
    return <EmptyState />;
  }

  return (
    <ContentGrid 
      content={content}
      onView={onContentClick}
      onMintNFT={onMintNFT}
      onDelete={onDelete}
      onDownload={onDownload}
      mintingStatus={mintingStatus}
    />
  );
};

export default ContentList;
