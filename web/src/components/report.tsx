'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const DATA = [
  {
    name: 'Jan',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Feb',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Mar',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Apr',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'May',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Jun',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Jul',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Aug',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Sep',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Oct',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Nov',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
  {
    name: 'Dec',
    reported: Math.floor(Math.random() * 5000) + 1000,
    deposited: Math.floor(Math.random() * 3500),
  },
];

type Props = {
  title?: string;
  description?: string;
  data?: { name: string; reported: number; deposited: number }[];
};

export default function Report({
  title = 'Exercise Minutes',
  description = 'Your excercise minutes are ahead of where you normally are.',
  data = DATA,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Average</span>
                          <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Today</span>
                          <span className="font-bold">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              }}
            />
            <Bar dataKey="deposited" fill="hsl(221.2 83.2% 53.3%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reported" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
