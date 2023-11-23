import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { useOtcMarketsServiceFetchOffersKey } from '@/api/queries';
import { OtcMarketsService } from '@/api/requests';
import OffersTables from './offers-tables';

export default async function OffersWrapper({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [useOtcMarketsServiceFetchOffersKey],
    queryFn: () => OtcMarketsService.fetchOffers(royaltyTokenSymbol),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OffersTables royaltyTokenSymbol={royaltyTokenSymbol} />
    </HydrationBoundary>
  );
}
