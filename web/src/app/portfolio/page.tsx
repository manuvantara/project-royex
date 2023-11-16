'use client';

import { faker } from '@faker-js/faker';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAccount } from 'wagmi';
import {
  usePortfoliosServicePortfoliosFetchPrivateRoyaltyTokens,
  usePortfoliosServicePortfoliosFetchPublicRoyaltyTokens,
} from '@/api/queries';

import { ValueIndicator } from '@/api/requests';
import Card from '@/components/card';
import CardMetric from '@/components/card-metric';
import Report from '@/components/report';
import { CardContent, CardHeader, CardTitle, Card as UICard } from '@/components/ui/card';

function formatChartData(data: ValueIndicator) {
  return [
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
  ];
}

const fakeStats = Array.from({ length: 4 }, (_) => ({
  title: faker.word.words(3),
  revenue: Number(faker.finance.amount(0, 100000)),
  percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
}));

export default function Page() {
  const { address } = useAccount();

  const { data: privateRoyaltyTokens, isLoading: isLoadingPrivate } =
    usePortfoliosServicePortfoliosFetchPrivateRoyaltyTokens({ stakeholderAddress: address! }, undefined, {
      enabled: !!address,
    });
  const { data: publicRoyaltyTokens, isLoading: isLoadingPublic } =
    usePortfoliosServicePortfoliosFetchPublicRoyaltyTokens({ stakeholderAddress: address! }, undefined, {
      enabled: !!address,
    });

  return (
    <div className="container">
      <div className="grid gap-4 px-4 pb-8 pt-8 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
        {fakeStats.map((stat) => (
          <Card key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
        <CardMetric />
        <Report />
      </div>
      {!isLoadingPublic && publicRoyaltyTokens && (
        <section className="px-4 pb-8 pt-4">
          <h3 className="mb-6 text-3xl font-bold capitalize tracking-tight">Public Royalty Tokens</h3>
          <div className="grid grid-cols-3 gap-4">
            {publicRoyaltyTokens.map((item) => (
              <UICard key={item.royaltyTokenSymbol}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-normal">{item.royaltyTokenSymbol}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">${item.price?.current.value}</div>
                    <p className="text-xs text-muted-foreground">+48.4% from last month</p>
                    <div className="h-[80px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={item.price ? formatChartData(item.price) : []}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                          }}
                        >
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
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">+{item.depositedRoyaltyIncome.current.value}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    <div className="mt-4 h-[80px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={item.depositedRoyaltyIncome ? formatChartData(item.depositedRoyaltyIncome) : []}
                        >
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
              </UICard>
            ))}
          </div>
        </section>
      )}
      {!isLoadingPrivate && privateRoyaltyTokens && (
        <section className="px-4 pb-8 pt-4">
          <h3 className="mb-6 text-3xl font-bold capitalize tracking-tight">Private Royalty Tokens</h3>
          <div className="grid grid-cols-3 gap-4">
            {privateRoyaltyTokens.map((item) => (
              <UICard key={item.royaltyTokenSymbol}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-normal">{item.royaltyTokenSymbol}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold">+{item.depositedRoyaltyIncome.current.value}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    <div className="mt-4 h-[80px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={item.depositedRoyaltyIncome ? formatChartData(item.depositedRoyaltyIncome) : []}
                        >
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
              </UICard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
