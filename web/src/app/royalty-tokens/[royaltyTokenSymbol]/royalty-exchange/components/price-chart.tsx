'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useRoyaltyExchangesServiceGetPrice } from '@/api/queries';
import { parseChartData } from '@/lib/helpers/chart';

export default function PriceChart({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { data, isLoading } = useRoyaltyExchangesServiceGetPrice({ royaltyTokenSymbol: royaltyTokenSymbol });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={parseChartData(data)}
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
  );
}
