import { InitialRoyaltyOfferingsService, RoyaltyTokensService } from '@/api/requests';
import { PrivateTokenCard, PublicTokenCard } from '@/components/cards';
import RoyaltyTokensSection from '@/components/royalty-tokens-section';

export default async function SectionWrapper() {
  const [liveInitialRoyaltyOfferings, upcomingInitialRoyaltyOfferings, publicRoyaltyTokens, privateRoyaltyTokens] =
    await Promise.all([
      InitialRoyaltyOfferingsService.fetchLive(),
      InitialRoyaltyOfferingsService.fetchUpcoming(),
      RoyaltyTokensService.fetchPublic(),
      RoyaltyTokensService.fetchPrivate(),
    ]);

  return (
    <>
      {liveInitialRoyaltyOfferings.length > 0 && (
        <RoyaltyTokensSection
          title="Live Initial Royalty Offerings"
          data={liveInitialRoyaltyOfferings}
          Card={PrivateTokenCard}
        />
      )}
      {upcomingInitialRoyaltyOfferings.length > 0 && (
        <RoyaltyTokensSection
          title="Upcoming Initial Royalty Offerings"
          data={upcomingInitialRoyaltyOfferings}
          Card={PrivateTokenCard}
        />
      )}
      {publicRoyaltyTokens.length > 0 && (
        <RoyaltyTokensSection title="Public Royalty Tokens" data={publicRoyaltyTokens} Card={PublicTokenCard} />
      )}
      {privateRoyaltyTokens.length > 0 && (
        <RoyaltyTokensSection title="Private Royalty Tokens" data={privateRoyaltyTokens} Card={PrivateTokenCard} />
      )}
    </>
  );
}
