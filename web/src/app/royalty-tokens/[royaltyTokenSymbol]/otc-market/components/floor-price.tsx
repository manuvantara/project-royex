'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useOtcMarketsServiceGetFloorPriceKey } from '@/api/queries';
import { OtcMarketsService } from '@/api/requests';
import { PriceChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default function FloorPrice({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [useOtcMarketsServiceGetFloorPriceKey],
    queryFn: () => OtcMarketsService.getFloorPrice(royaltyTokenSymbol),
  });
  const chartData = parseChartData(data);

  return <PriceChart title="Floor Price History (24H)" data={chartData} />;
}
