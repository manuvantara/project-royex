import { Suspense } from 'react';
import { PriceChartSkeleton, TradingVolumeSkeleton } from '@/components/skeletons';
import { Exchanger, Price, TradingVolume } from './components';

export const dynamic = 'force-dynamic';

export default function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 py-6">
        <Suspense fallback={<PriceChartSkeleton />}>
          <Price royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
        <Suspense fallback={<TradingVolumeSkeleton />}>
          <TradingVolume royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
      </div>
      <Exchanger royaltyTokenSymbol={royaltyTokenSymbol} />
    </>
  );
}
