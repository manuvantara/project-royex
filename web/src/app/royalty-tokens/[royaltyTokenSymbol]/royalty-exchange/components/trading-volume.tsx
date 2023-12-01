'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRoyaltyExchangesServiceGetTradingVolumeKey } from '@/api/queries';
import { RoyaltyExchangesService } from '@/api/requests';
import { VolumeChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default function TradingVolume({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [useRoyaltyExchangesServiceGetTradingVolumeKey],
    queryFn: () => RoyaltyExchangesService.getTradingVolume(royaltyTokenSymbol),
  });
  const chartData = parseChartData(data);

  return <VolumeChart title="Trading Volume (24H)" data={chartData} />;
}
