import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import OffersTable from './offers-table';
import { useOtcMarketsServiceFetchOffersKey } from '@/api/queries';
import { OtcMarketsService } from '@/api/requests';

// TODO: Globally change royaltyId to royaltyTokenSymbol

export default async function OffersWrapper({ royaltyId }: { royaltyId: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [useOtcMarketsServiceFetchOffersKey],
    queryFn: () => OtcMarketsService.fetchOffers(royaltyId)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OffersTable royaltyTokenSymbol={royaltyId} />
    </HydrationBoundary>
  );
}
