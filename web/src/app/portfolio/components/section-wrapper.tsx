'use client';

import { useAccount } from 'wagmi';
import {
  usePortfoliosServiceFetchPrivateRoyaltyTokens,
  usePortfoliosServiceFetchPublicRoyaltyTokens,
} from '@/api/queries';
import RoyaltyTokensSection from '@/components/royalty-tokens-section';

export default function SectionWrapper() {
  const { address, isConnected } = useAccount();

  const { data: privateRoyaltyTokens, isLoading: isLoadingPrivate } = usePortfoliosServiceFetchPrivateRoyaltyTokens(
    { stakeholderAddress: address! },
    undefined,
    {
      enabled: isConnected,
    }
  );
  const { data: publicRoyaltyTokens, isLoading: isLoadingPublic } = usePortfoliosServiceFetchPublicRoyaltyTokens(
    { stakeholderAddress: address! },
    undefined,
    {
      enabled: isConnected,
    }
  );

  if (isLoadingPrivate || isLoadingPublic) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RoyaltyTokensSection title="Private Royalty Tokens" data={privateRoyaltyTokens} />
      <RoyaltyTokensSection title="Public Royalty Tokens" data={publicRoyaltyTokens} />
    </>
  );
}
