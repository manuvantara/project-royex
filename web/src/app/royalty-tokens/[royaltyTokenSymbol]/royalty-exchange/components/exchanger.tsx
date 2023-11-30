import Balancer from 'react-wrap-balancer';
import { RoyaltyExchangesService } from '@/api/requests';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuyForm from './buy-form';
import SellForm from './sell-form';
import Stats from './stats';

export default async function Exchanger({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const contractAddress = await RoyaltyExchangesService.getContractAddress(royaltyTokenSymbol);

  return (
    <div className="mt-6 rounded-md border p-6">
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
        <Tabs defaultValue="buy" className="col-span-2 w-[425px]">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <BuyForm royaltyExchangeAddress={contractAddress} />
          </TabsContent>
          <TabsContent value="sell">
            <SellForm royaltyExchangeAddress={contractAddress} />
          </TabsContent>
        </Tabs>
        <div className="col-span-1">
          <Stats royaltyExchangeAddress={contractAddress} />
        </div>
      </div>
    </div>
  );
}
