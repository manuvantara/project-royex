import { Suspense } from 'react';
import Balancer from 'react-wrap-balancer';
import PageLayout from '../components/page-layout';
import CreateOfferForm from './components/create-offer-form';
import OffersWrapper from './components/offers-wrapper';
import { OtcMarketsService, RoyaltyTokensService } from '@/api/requests';

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const [marketAddress, royaltyTokenAddress] = await Promise.all([
    OtcMarketsService.getContractAddress(royaltyId),
    RoyaltyTokensService.getContractAddress(royaltyId),
  ]);

  return (
    <PageLayout contractAddress={marketAddress}>
      <div className="mt-8 rounded-md border p-6">
        <div className="space-y-1 p-6">
          <h3 className="text-2xl font-semibold tracking-tight">OTC Market</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            <Balancer>
              Over-the-counter Market is a decentralized market in which stakeholders trade p2p with each other.
            </Balancer>
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <CreateOfferForm royaltyTokenAddress={royaltyTokenAddress} marketAddress={marketAddress} />
          <div className="col-span-2 gap-6">
            {' '}
            {/* TODO: Add proper loading state */}
            <OffersWrapper royaltyId={royaltyId} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
