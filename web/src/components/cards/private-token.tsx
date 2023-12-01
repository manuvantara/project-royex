'use client';

import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';

import type { PrivateRoyaltyToken } from '@/api/requests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseChartData } from '@/lib/helpers/chart';

export default function PrivateTokenCard({ symbol, depositedRoyaltyIncome }: PrivateRoyaltyToken) {
  const chartData = parseChartData(depositedRoyaltyIncome);

  return (
    <Link href={`/royalty-tokens/${symbol}/initial-royalty-offering`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-normal">{symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{depositedRoyaltyIncome.current.value}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          <div className="mt-4 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
        </CardContent>
      </Card>
    </Link>
  );
}
