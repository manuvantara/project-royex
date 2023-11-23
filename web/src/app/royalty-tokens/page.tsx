import { Suspense } from 'react';
import { CardsWrapper, RoyaltyIncome, SectionWrapper, TradingVolume } from './components';

export const dynamic = 'force-dynamic';

export default function Page() {
  // TODO: add loading skeletons
  return (
    <div className="container">
      <div className="grid gap-4 px-4 pt-8 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
        <Suspense fallback={<div>Loading cards...</div>}>
          <CardsWrapper />
        </Suspense>
      </div>
      <div className="grid gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
        <Suspense fallback={<div>Loading...</div>}>
          <RoyaltyIncome />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <TradingVolume />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SectionWrapper />
      </Suspense>
    </div>
  );
}
