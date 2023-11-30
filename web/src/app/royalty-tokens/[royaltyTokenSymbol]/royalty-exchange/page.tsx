import { Suspense } from 'react';
import { ChartSkeleton } from '@/components/skeletons';
import { Exchanger, Price, TradingVolume } from './components';

export const dynamic = 'force-dynamic';

export default function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
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
