'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, midnightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';
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
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
