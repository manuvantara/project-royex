import { PublicRoyaltyOfferingsService, RoyaltyTokensService } from '@/api/requests';
import RoyaltyTokensSection from '@/components/royalty-tokens-section';

export default async function SectionWrapper() {
  const [liveInitialRoyaltyOfferings, upcomingInitialRoyaltyOfferings, publicRoyaltyTokens, privateRoyaltyTokens] =
    await Promise.all([
      PublicRoyaltyOfferingsService.fetchLive(),
      PublicRoyaltyOfferingsService.fetchUpcoming(),
      RoyaltyTokensService.fetchPublic(),
      RoyaltyTokensService.fetchPrivate(),
    ]);

  return (
    <>
      {liveInitialRoyaltyOfferings.length && (
        <RoyaltyTokensSection title="Live Initial Royalty Offerings" data={liveInitialRoyaltyOfferings} />
      )}
      {upcomingInitialRoyaltyOfferings.length && (
        <RoyaltyTokensSection title="Upcoming Initial Royalty Offerings" data={upcomingInitialRoyaltyOfferings} />
      )}
      {publicRoyaltyTokens.length && <RoyaltyTokensSection title="Public Royalty Tokens" data={publicRoyaltyTokens} />}
      {privateRoyaltyTokens.length && (
        <RoyaltyTokensSection title="Private Royalty Tokens" data={privateRoyaltyTokens} />
      )}
    </>
  );
}
