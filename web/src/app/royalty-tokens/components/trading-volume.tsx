import { type GetTradingVolume, ProtocolService } from '@/api/requests';
import { ReportChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default async function TradingVolume() {
  const data = await ProtocolService.getTradingVolume();

  const parseData = (data: GetTradingVolume) => {
    const otc = parseChartData(data.otcMarket);
    const exchange = parseChartData(data.royaltyExchange);

    return otc.map((reportedData, i) => ({
      timestamp: reportedData.timestamp,
      otc: reportedData.value,
      exchange: exchange[i].value,
    }));
  };

  const chartData = parseData(data);

  return <ReportChart title="Total Trading Volume" data={chartData} dataKeys={['otc', 'exchange']} />;
}
