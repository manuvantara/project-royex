import { Suspense } from 'react';
import PageLayout from '../components/page-layout';
import { Exchanger, Price, TradingVolume } from './components';
import { RoyaltyExchangesService } from '@/api/requests';
import { PriceChartSkeleton, TradingVolumeSkeleton } from '@/components/skeletons';

export default async function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  const contractAddress = await RoyaltyExchangesService.getContractAddress(royaltyTokenSymbol);

  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="grid grid-cols-2 gap-4 py-6">
        <Suspense fallback={<PriceChartSkeleton />}>
          <Price royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
        <Suspense fallback={<TradingVolumeSkeleton />}>
          <TradingVolume royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
      </div>
      <Exchanger royaltyTokenSymbol={royaltyTokenSymbol} />
    </PageLayout>
  );
}
