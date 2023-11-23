import { RoyaltyExchangesService } from '@/api/requests';
import { VolumeChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default async function TradingVolume({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const volume = await RoyaltyExchangesService.getTradingVolume(royaltyTokenSymbol);
  const chartData = parseChartData(volume);

  return <VolumeChart data={chartData} />;
}
