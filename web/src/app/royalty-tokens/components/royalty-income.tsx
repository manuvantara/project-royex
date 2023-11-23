import { type GetRoyaltyIncomeResponse, ProtocolService } from '@/api/requests';
import Report from '@/components/report';
import { parseChartData } from '@/lib/helpers/chart';

export default async function RoyaltyIncome() {
  const data = await ProtocolService.getRoyaltyIncomePerProtocol();

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

  return <Report title="Total Royalty Income" data={chartData} dataKeys={['reported', 'deposited']} />;
}
