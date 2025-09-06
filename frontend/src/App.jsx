import React, { useState, useMemo } from 'react';
import { getStylePresets, getGenerationOptions } from './services/aiService';
import ContentManager from './components/ContentManager';
import SimpleWalletGate from './components/SimpleWalletGate';
import Navigation from './components/Navigation';
import Nav from './components/Nav';
import Messages from './components/Messages';
import { Form } from './components/Form';
import { Display } from './components/Display';
import Section from './components/Section';
import Tab from './components/Tab';
import nftService from './services/nftService';
import { LoadingState } from './components/LoadingState';
import { useWallet } from './hooks/useWallet';
import { useContentGeneration } from './hooks/useContentGeneration';
import { useAppState } from './hooks/useAppState';
import MetaMaskDebugger from './components/MetaMaskDebugger';
import './utils/metaMaskDebug.js';

function App() {
  // Check for debug mode
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';
  
  const {
    isWalletConnected,
    walletData,
    handleWalletChange,
    handleDisconnect,
    getCurrentWalletAddress
  } = useWallet();

  const {
    prompt,
    setPrompt,
    isGenerating,
    generatedContent,
    selectedStyle,
    setSelectedStyle,
    generationOptions,
    setGenerationOptions,
    showAdvancedOptions,
    setShowAdvancedOptions,
    handleGenerate,
    resetGeneration
  } = useContentGeneration();

  const {
    apiStatus,
    error,
    success,
    activeTab,
    setActiveTab,
    contentList,
    backendStatus,
    isLoading,
    setMessage,
    handleContentUpdate,
    handleErrorRetry,
    handleErrorDismiss
  } = useAppState();

  const [isMinting, setIsMinting] = useState(false);

  const handleGenerateWithWallet = async (e) => {
    const walletAddress = getCurrentWalletAddress();
    const result = await handleGenerate(e, walletAddress);
    
    if (result.error) {
      setMessage.error(result.error);
    } else if (result.success) {
      setMessage.success(result.success);
      if (result.content) {
        handleContentUpdate([...contentList, result.content]);
      }
    }
  };

  const handleMintNFT = async () => {
    if (!generatedContent) return;
    
    try {
      setIsMinting(true);
      setMessage.error(null);
      setMessage.success(null);
      
      const contentForMinting = {
        ...generatedContent,
        id: generatedContent.id || generatedContent.content_hash || `content-${Date.now()}`,
        ImageData: generatedContent.ImageData || generatedContent.imageData,
        ImageURL: generatedContent.ImageURL || generatedContent.imageUrl,
        content_hash: generatedContent.content_hash || generatedContent.hash || `content-${Date.now()}`,
        style: generatedContent.style || selectedStyle,
        model: generatedContent.model || 'stable-diffusion-xl-1024-v1-0',
        seed: generatedContent.seed || 0,
        cfg_scale: generatedContent.cfg_scale || generatedContent.CFGScale || 7,
        steps: generatedContent.steps || generatedContent.Steps || 30,
        UserID: getCurrentWalletAddress() || 'AI Generated',
        created_at: generatedContent.created_at || new Date().toISOString()
      };
      
      if (walletData) {
        nftService.setWalletData(walletData);
      } else {
        throw new Error('Wallet data not available. Please reconnect your wallet.');
      }
      
      const nftData = await nftService.mintNFT(contentForMinting, {
        creator: contentForMinting.UserID || 'AI Generated',
        timestamp: contentForMinting.created_at || new Date().toISOString()
      });

      setMessage.success('NFT minted successfully! Redirecting to Content Gallery...');
      setActiveTab('content');
      
    } catch (error) {
      setMessage.error('NFT minting failed. Please try again from the Content Gallery tab.');
    } finally {
      setIsMinting(false);
    }
  };

  const handleWalletChangeWithSuccess = (connected, walletData) => {
    const result = handleWalletChange(connected, walletData);
    if (result.success) {
      setMessage.success(result.success);
      if (result.shouldResetTab) {
        setActiveTab('generate');
      }
    }
  };

  // Memoize style presets and generation options
  const stylePresets = useMemo(() => getStylePresets(), []);
  const availableOptions = useMemo(() => getGenerationOptions(), []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingState 
          type="blockchain" 
          message="Initializing LicenZ..." 
          size="xl"
        />
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <SimpleWalletGate onWalletChange={handleWalletChangeWithSuccess} />
    );
  }

  // Debug mode - show MetaMask debugger
  if (isDebugMode) {
    return <MetaMaskDebugger />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation 
        backendStatus={backendStatus} 
        onDisconnect={handleDisconnect} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-4">
            Generate, License & Monetize AI Content
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Create stunning AI-generated art with built-in blockchain licensing and NFT capabilities. 
            Protect your creativity and unlock new monetization opportunities.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full border border-purple-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">AI Generation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full border border-blue-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Blockchain Protection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 rounded-full border border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">NFT Monetization</span>
            </div>
          </div>
        </div>

        <Nav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          contentCount={contentList.length}
        />

        <Messages 
          apiStatus={apiStatus}
          success={success}
          error={error}
          onErrorDismiss={handleErrorDismiss}
          onErrorRetry={handleErrorRetry}
          showRetry={activeTab === 'generate' && prompt.trim()}
        />

        {activeTab === 'generate' && (
          <div className="space-y-8">
            {generatedContent && (
              <>
                <Display
                  generatedContent={generatedContent}
                  selectedStyle={selectedStyle}
                  onMintNFT={handleMintNFT}
                  isMinting={isMinting}
                  onViewContentLibrary={() => setActiveTab('content')}
                />
                
                <div className="flex items-center justify-center">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="mx-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
              </>
            )}

            <Form
              prompt={prompt}
              setPrompt={setPrompt}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              generationOptions={generationOptions}
              setGenerationOptions={setGenerationOptions}
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
              stylePresets={stylePresets}
              availableOptions={availableOptions}
              apiStatus={apiStatus}
              isGenerating={isGenerating}
              onSubmit={handleGenerateWithWallet}
              hasGeneratedContent={!!generatedContent}
            />

            <Section />
          </div>
        )}

        {activeTab === 'content' && (
          <ContentManager 
            onContentUpdate={handleContentUpdate} 
            contentFromParent={contentList}
            walletAddress={getCurrentWalletAddress()}
            walletData={walletData}
          />
        )}

        {activeTab === 'blockchain' && (
          <Tab
            generatedContent={generatedContent}
            walletConnected={isWalletConnected}
            onDisconnect={() => setIsWalletConnected(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
