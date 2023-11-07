'use client';

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from './ui/button';

export default function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button variant="default" onClick={openConnectModal} type="button">
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button variant="destructive" onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button variant="secondary" onClick={openAccountModal} type="button">
                  {account.displayName}
                  {account.displayBalance ? ` (${account.displayBalance})` : ''}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
