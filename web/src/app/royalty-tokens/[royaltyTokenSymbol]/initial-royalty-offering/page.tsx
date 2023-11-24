import Balancer from 'react-wrap-balancer';
import IroForm from './components/iro-form';
import Stats from './components/stats';
import { INITIAL_ROYALTY_OFFERING_ADDRESS, ROYALTY_TOKEN_ADDRESS } from '@/config/contracts';
import { InitialRoyaltyOfferingsService } from '@/api/requests';

export default async function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  const contractAddress = await InitialRoyaltyOfferingsService.getContractAddress(royaltyTokenSymbol);

  return (
    <div className="mt-8 rounded-md border p-6">
      <div className="space-y-1 p-6">
        <h3 className="text-2xl font-semibold tracking-tight">Initial Royalty Offering</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          <Balancer>IRO is a place where royalty tokens are initially offered.</Balancer>
        </p>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <IroForm initialRoyaltyOfferingAddress={INITIAL_ROYALTY_OFFERING_ADDRESS} />
        </div>
        <Stats
          initialRoyaltyOfferingAddress={INITIAL_ROYALTY_OFFERING_ADDRESS}
          royaltyTokenAddress={ROYALTY_TOKEN_ADDRESS}
        />
      </div>
    </div>
  );
}
