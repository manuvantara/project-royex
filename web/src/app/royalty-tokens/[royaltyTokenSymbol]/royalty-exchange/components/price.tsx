'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRoyaltyExchangesServiceGetPriceKey } from '@/api/queries';
import { RoyaltyExchangesService } from '@/api/requests';
import { PriceChart } from '@/components/charts';
import { parseChartData } from '@/lib/helpers/chart';

export default function Price({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [useRoyaltyExchangesServiceGetPriceKey],
    queryFn: () => RoyaltyExchangesService.getPrice(royaltyTokenSymbol),
  });
  const chartData = parseChartData(data);

  return <PriceChart title="Price History (24H)" data={chartData} />;
}
