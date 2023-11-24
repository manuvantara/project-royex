import { RoyaltyExchangesService } from '@/api/requests';
import { PriceChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default async function Price({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const price = await RoyaltyExchangesService.getPrice(royaltyTokenSymbol);
  const chartData = parseChartData(price);

  return <PriceChart title="Price History (24H)" data={chartData} />;
}
