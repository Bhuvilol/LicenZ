import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WagmiProvider, QueryClientProvider, queryClient, config } from './config/wagmi.js'

// Remove any HMR indicators or blinking bubbles
const removeHMRIndicators = () => {
  // Remove any elements positioned at top left that might be HMR indicators
  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed' && 
        (style.top === '0px' || style.top === '0') && 
        (style.left === '0px' || style.left === '0')) {
      if (el.id?.includes('vite') || el.className?.includes('vite') || 
          el.id?.includes('hmr') || el.className?.includes('hmr')) {
        el.remove();
      }
    }
  });
  
  // Remove any elements with HMR-related attributes
  const hmrElements = document.querySelectorAll('[id*="vite"], [class*="vite"], [id*="hmr"], [class*="hmr"]');
  hmrElements.forEach(el => {
    if (el.style.position === 'fixed') {
      el.remove();
    }
  });
};

// Run immediately and also set up a periodic check
removeHMRIndicators();
setInterval(removeHMRIndicators, 1000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
