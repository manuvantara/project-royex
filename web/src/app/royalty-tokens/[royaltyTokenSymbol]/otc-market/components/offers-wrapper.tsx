import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import OffersTable from './offers-table';
import { useOtcMarketsServiceFetchOffersKey } from '@/api/queries';
import { OtcMarketsService } from '@/api/requests';

export default async function OffersWrapper({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [useOtcMarketsServiceFetchOffersKey],
    queryFn: () => OtcMarketsService.fetchOffers(royaltyTokenSymbol),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OffersTable royaltyTokenSymbol={royaltyTokenSymbol} />
    </HydrationBoundary>
  );
}
