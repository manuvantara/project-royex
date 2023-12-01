'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRoyaltyPaymentPoolsServiceGetRoyaltyIncomeKey } from '@/api/queries';
import { RoyaltyPaymentPoolsService, type GetRoyaltyIncomeResponse } from '@/api/requests';
import { ReportChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default function RoyaltyIncome({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [useRoyaltyPaymentPoolsServiceGetRoyaltyIncomeKey],
    queryFn: () => RoyaltyPaymentPoolsService.getRoyaltyIncome(royaltyTokenSymbol),
  });

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
