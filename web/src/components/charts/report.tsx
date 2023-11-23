'use client';

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

type Props = {
  title?: string;
  description?: string;
  data: any; // TODO: Define type
  dataKeys: [string, string];
};

export default function Report({ title = 'Default chart', description, data, dataKeys }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={350}>
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
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                top: 0,
                right: 0,
                left: 'auto',
                bottom: 'auto',
                fontSize: 12,
                textTransform: 'uppercase',
              }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].dataKey}</span>
                          <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[1].dataKey}</span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <span className="text-sm text-muted-foreground">{payload[0].payload.timestamp}</span>
                    </div>
                  );
                }

                return null;
              }}
            />
            <Bar dataKey={dataKeys[0]} fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey={dataKeys[1]} fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
