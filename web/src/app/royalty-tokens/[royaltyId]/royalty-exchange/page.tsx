'use client';

import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from 'recharts';
import { useRoyaltyExchangesServiceRoyaltyExchangesGetPrice } from '@/api/queries';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import PageLayout from '../components/page-layout';
import Exchanger from './components/exchanger';

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
      </div>
      <Exchanger />
    </PageLayout>
  );
}
