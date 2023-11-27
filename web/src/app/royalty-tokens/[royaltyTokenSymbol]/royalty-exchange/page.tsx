import { Suspense } from 'react';
import { Exchanger, Price, TradingVolume } from './components';
import { ChartSkeleton } from '@/components/skeletons';

export const dynamic = 'force-dynamic';

export default function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 py-6">
        <Suspense fallback={<ChartSkeleton />}>
          <Price royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TradingVolume royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
      </div>
      <Exchanger royaltyTokenSymbol={royaltyTokenSymbol} />
    </>
  );
}
