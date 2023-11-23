'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

type Props = {
  title: string;
  data: any[];
};

export default function Volume({ title, data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="timestamp" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              allowDataOverflow={true}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="flex min-w-[100px] flex-col rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].dataKey}</span>
                        <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                      </div>
                      <Separator className="my-2" />
                      <span className="text-sm text-muted-foreground">{payload[0].payload.timestamp}</span>
                    </div>
                  );
                }

                return null;
              }}
            />
            <Bar dataKey="value" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
