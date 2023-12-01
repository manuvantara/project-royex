import { Suspense } from 'react';
import { ChartSkeleton, StatCardsSkeleton, TokensSectionSkeleton } from '@/components/skeletons';
import { CardsWrapper, RoyaltyIncome, SectionWrapper, TradingVolume } from './components';

export const runtime = 'edge';

export const revalidate = 300;

export default function Page() {
  return (
    <div className="container">
      <div className="grid gap-4 px-4 pt-8 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
        <Suspense fallback={<StatCardsSkeleton />}>
          <CardsWrapper />
        </Suspense>
      </div>
      <div className="grid gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <RoyaltyIncome />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TradingVolume />
        </Suspense>
      </div>
      <Suspense fallback={<TokensSectionSkeleton />}>
        <SectionWrapper />
      </Suspense>
    </div>
  );
}
