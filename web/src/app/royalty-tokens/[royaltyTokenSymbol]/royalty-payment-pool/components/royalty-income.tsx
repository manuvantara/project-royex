import { RoyaltyPaymentPoolsService, type GetRoyaltyIncomeResponse } from '@/api/requests';
import { ReportChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default async function RoyaltyIncome({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const data = await RoyaltyPaymentPoolsService.getRoyaltyIncome(royaltyTokenSymbol);

  const parseData = (data: GetRoyaltyIncomeResponse) => {
    const reported = parseChartData(data.reported);
    const deposited = parseChartData(data.deposited);

    return reported.map((reportedData, i) => ({
      timestamp: reportedData.timestamp,
      reported: reportedData.value,
      deposited: deposited[i].value,
    }));
  };

  const chartData = parseData(data);

  return <ReportChart title="Royalty Income" data={chartData} dataKeys={['reported', 'deposited']} />;
}
