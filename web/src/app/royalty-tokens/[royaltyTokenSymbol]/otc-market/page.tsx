import { Suspense } from 'react';
import Balancer from 'react-wrap-balancer';
import { FloorPrice, OffersWrapper, TradingVolume } from './components';
import { OtcMarketsService, RoyaltyTokensService } from '@/api/requests';
import { ChartSkeleton } from '@/components/skeletons';

export default async function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  // const [marketAddress, royaltyTokenAddress] = await Promise.all([
  //   OtcMarketsService.getContractAddress(royaltyTokenSymbol),
  //   RoyaltyTokensService.getContractAddress(royaltyTokenSymbol),
  // ]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 py-6">
        <Suspense fallback={<ChartSkeleton />}>
          <FloorPrice royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <TradingVolume royaltyTokenSymbol={royaltyTokenSymbol} />
        </Suspense>
      </div>
      <div className="mt-8 rounded-md border p-6">
        <div className="space-y-1 p-6">
          <h3 className="text-2xl font-semibold tracking-tight">OTC Market</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            <Balancer>
              Over-the-counter Market is a decentralized market in which stakeholders trade p2p with each other.
            </Balancer>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <OffersWrapper royaltyTokenSymbol={royaltyTokenSymbol} />
        </div>
      </div>
    </>
  );
}
