import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia, linea, lineaSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

// Create a client
const queryClient = new QueryClient();

// Configure chains & providers
const config = createConfig({
  ssr: false, // Disable SSR for client-side only
  chains: [mainnet, sepolia, linea, lineaSepolia],
  connectors: [
    metaMask({
      // Use environment variable for API key
      infuraAPIKey: import.meta.env.VITE_INFURA_API_KEY || '727cce12a9184adc88b59b9ae69ef7f7',
      // Add debugging
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || '727cce12a9184adc88b59b9ae69ef7f7'}`),
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || '727cce12a9184adc88b59b9ae69ef7f7'}`),
    [linea.id]: http(`https://linea-mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || '727cce12a9184adc88b59b9ae69ef7f7'}`),
    [lineaSepolia.id]: http(`https://linea-sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || '727cce12a9184adc88b59b9ae69ef7f7'}`),
  },
});

export { config, queryClient, QueryClientProvider, WagmiProvider };
