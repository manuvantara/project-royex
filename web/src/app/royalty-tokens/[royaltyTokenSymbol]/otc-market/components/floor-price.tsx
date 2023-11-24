import { OtcMarketsService } from '@/api/requests';
import { PriceChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default async function FloorPrice({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const price = await OtcMarketsService.getFloorPrice(royaltyTokenSymbol);
  const chartData = parseChartData(price);

  return <PriceChart title="Floor Price History (24H)" data={chartData} />;
}
