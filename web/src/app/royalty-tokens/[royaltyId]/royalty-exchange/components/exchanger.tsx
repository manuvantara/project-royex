import Balancer from 'react-wrap-balancer';
import BuyForm from './buy-form';
import SellForm from './sell-form';
import Stats from './stats';

export default function Exchanger() {
  return (
    <div className="rounded-md border p-6">
      <div className="space-y-1 p-6">
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
        <Stats />
      </div>
    </div>
  );
}
