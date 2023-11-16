import BuyForm from './buy-form';
import SellForm from './sell-form';
import Stats from './stats';

export default function Exchanger() {
  return (
    <div className="rounded-md border p-6">
      <div className="space-y-1.5 p-6 ">
        <h1 className="font-semibold">Royalty Exchange</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Powered by AMM, Royalty Exchange gives you an opportunity to trade royalty tokens at a price determined by the
          market rate.
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
