import { Suspense } from 'react';
import Balancer from 'react-wrap-balancer';
import { DepositRoyaltiesForm, RoyaltyPaymentsTable, RoyaltyIncome } from './components';
import { RoyaltyPaymentPoolsService } from '@/api/requests';
import { ChartSkeleton } from '@/components/skeletons';

export const dynamic = 'force-dynamic';

export default async function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  const contractAddress = await RoyaltyPaymentPoolsService.getContractAddress(royaltyTokenSymbol);
  const royaltyPayments = await RoyaltyPaymentPoolsService.fetchDeposits(royaltyTokenSymbol);

  return (
    <>
      <div className="mt-8 rounded-md border p-6">
        <div className="space-y-1 p-6">
          <h3 className="text-2xl font-semibold tracking-tight">Royalty Payment Pool</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            <Balancer>
              Distributors deposit royalties into a payment pool, creating a checkpoint. Investors can then withdraw
              revenues proportional to their royalty rates at the checkpoint.
            </Balancer>
          </p>
        </div>
        <div className="mt-8">
          <div className="grid gap-4 py-8 md:grid-cols-2">
            <Suspense fallback={<ChartSkeleton />}>
              <RoyaltyIncome royaltyTokenSymbol={royaltyTokenSymbol} />
            </Suspense>
            <RoyaltyPaymentsTable data={royaltyPayments} />
          </div>
          <DepositRoyaltiesForm royaltyPaymentPoolAddress={contractAddress} />
        </div>
      </div>
    </>
  );
}
