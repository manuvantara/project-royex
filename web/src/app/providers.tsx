'use client';

import { connectorsForWallets, cssStringFromTheme, midnightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { injectedWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLayoutEffect, useState } from 'react';
import { auroraTestnet } from 'viem/chains';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains([auroraTestnet], [publicProvider()]);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      walletConnectWallet({ projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const rainbowKitTheme = {
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

  useLayoutEffect(() => {
    const theme = cssStringFromTheme(rainbowKitTheme);

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-rk-theme', 'midnight');
    styleElement.textContent = `:root { ${theme} }`;

    if (!document.head.hasAttribute('data-rk-theme')) {
      document.head.appendChild(styleElement);
    }
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={null}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
