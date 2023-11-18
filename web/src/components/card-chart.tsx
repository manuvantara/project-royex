'use client';

import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from 'recharts';

import { ValueIndicator } from '@/api/requests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import parseChartData from '@/lib/helpers/parse-chart-data';

type Props = {
  royaltyTokenSymbol: string;
  price: ValueIndicator;
  depositedRoyaltyIncome: ValueIndicator;
};

export default function CardChart({ royaltyTokenSymbol, price, depositedRoyaltyIncome }: Props) {
  const priceData = parseChartData(price);
  const royaltyIncomeData = parseChartData(depositedRoyaltyIncome);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">{royaltyTokenSymbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-bold">${price.current.value}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          <div className="h-[80px]">
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
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold">+{depositedRoyaltyIncome.current.value}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          <div className="mt-4 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={royaltyIncomeData}>
                <Bar
                  dataKey="value"
                  style={
                    {
                      fill: 'hsl(var(--primary))',
                      opacity: 1,
                    } as React.CSSProperties
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
