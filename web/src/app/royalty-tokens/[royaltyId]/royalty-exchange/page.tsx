'use client';

import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from 'recharts';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import { useRoyaltyExchangesServiceRoyaltyExchangesGetPrice } from '@/api/queries';
import Card from '@/components/card';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import roundUpEther from '@/lib/helpers/round-up-ether';
import PageLayout from '../components/page-layout';
import ExchangeForm from './components/exchange-form';

export default function Page({ params }: { params: { royaltyId: string } }) {
  const { data } = useRoyaltyExchangesServiceRoyaltyExchangesGetPrice({ royaltyId: params.royaltyId });

  const priceData = data
    ? [
        ...data.recentValuesDataset.map((d) => ({
          ...d,
          timestamp: new Date(d.timestamp).toLocaleDateString(undefined, {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          }),
        })),
        {
          ...data.current,
          timestamp: new Date(data.current.timestamp).toLocaleDateString(undefined, {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          }),
        },
      ]
    : [];

  const royaltyTokenReserve = useContractRead({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'royaltyTokenReserve',
    watch: true,
  });

  const stablecoinReserve = useContractRead({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'stablecoinReserve',
    watch: true,
  });

  const stats = [
    {
      title: 'Royalty Token Reserve',
      value: royaltyTokenReserve.data ? roundUpEther(formatEther(royaltyTokenReserve.data)) : undefined,
      icon: <div></div>,
    },
    {
      title: 'Stablecoin Reserve',
      value: stablecoinReserve.data ? `$${roundUpEther(formatEther(stablecoinReserve.data))}` : undefined,
      icon: <div></div>,
    },
  ];

  return (
    <PageLayout contractAddress={ROYALTY_EXCHANGE_ADDRESS}>
      <div className="pb-8 pt-8 md:pt-12">
        <UICard>
          <CardHeader>
            <CardTitle>Price history</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={priceData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <XAxis
                  dataKey="timestamp"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="flex rounded-lg border bg-background px-6 py-2 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
                            <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dataKey="value"
                  activeDot={{
                    r: 6,
                    style: { fill: 'hsl(var(--primary))', opacity: 0.25 },
                  }}
                  style={
                    {
                      stroke: 'hsl(var(--primary))',
                    } as React.CSSProperties
                  }
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </UICard>
        <div className="mt-8 grid grid-cols-2 gap-6 px-20">
          <div className="max-w-[800px]">
            <ExchangeForm />
          </div>
          <div className="grid gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
