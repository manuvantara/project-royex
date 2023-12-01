'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useOtcMarketsServiceGetTradingVolumeKey } from '@/api/queries';
import { OtcMarketsService } from '@/api/requests';
import { VolumeChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default function TradingVolume({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [useOtcMarketsServiceGetTradingVolumeKey],
    queryFn: () => OtcMarketsService.getTradingVolume(royaltyTokenSymbol),
  });
  const chartData = parseChartData(data);

  return <VolumeChart title="Trading Volume (24H)" data={chartData} />;
}
