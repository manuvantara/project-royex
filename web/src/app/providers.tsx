'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, midnightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { auroraTestnet } from 'viem/chains';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { siteConfig } from '@/config/site';

const { chains, publicClient } = configureChains([auroraTestnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: siteConfig.name,
  projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const rainbowKitTheme: Theme = {
  ...midnightTheme(),
  colors: {
    ...midnightTheme().colors,
    accentColor: 'hsl(var(--primary))',
    accentColorForeground: 'hsl(var(--foreground))',
    modalBackground: 'hsl(var(--background))',
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
