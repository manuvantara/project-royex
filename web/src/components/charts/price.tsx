'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

type Props = {
  data: any[];
};

export default function Price({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price history</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
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
              domain={['dateMin', 'auto']}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="flex min-w-[100px] flex-col rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
                        <span className="font-bold text-muted-foreground">{payload[0].payload.fixedValue}</span>
                      </div>
                      <Separator className="my-2" />
                      <span className="text-sm text-muted-foreground">{payload[0].payload.timestamp}</span>
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
    </Card>
  );
}
