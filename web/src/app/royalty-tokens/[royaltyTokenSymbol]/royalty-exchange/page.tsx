import PageLayout from '../components/page-layout';
import Exchanger from './components/exchanger';
import PriceChart from './components/price-chart';
import { RoyaltyExchangesService } from '@/api/requests';
import { CardContent, CardHeader, CardTitle, Card as UICard } from '@/components/ui/card';

export default async function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  const contractAddress = await RoyaltyExchangesService.getContractAddress(royaltyTokenSymbol);

  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="pb-8 pt-8 md:pt-12">
        <UICard>
          <CardHeader>
            <CardTitle>Price history</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PriceChart royaltyTokenSymbol={royaltyTokenSymbol} />
          </CardContent>
        </UICard>
      </div>
      <Exchanger />
    </PageLayout>
  );
}
