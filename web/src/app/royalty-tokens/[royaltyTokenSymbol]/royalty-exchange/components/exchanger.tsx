import Balancer from 'react-wrap-balancer';
import BuyForm from './buy-form';
import SellForm from './sell-form';
import Stats from './stats';
import { RoyaltyExchangesService } from '@/api/requests';

export default async function Exchanger({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const contractAddress = await RoyaltyExchangesService.getContractAddress(royaltyTokenSymbol);

  return (
    <div className="rounded-md border p-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">Royalty Exchange</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          <Balancer>
            Powered by AMM, Royalty Exchange gives you an opportunity to trade royalty tokens at a price determined by
            the market rate.
          </Balancer>
        </p>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <BuyForm />
          <SellForm />
        </div>
        <Stats royaltyExchangeAddress={contractAddress} />
      </div>
    </div>
  );
}
