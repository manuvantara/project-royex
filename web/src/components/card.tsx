'use client';

import { useEffect, useState } from 'react';
import { Card as UICard, CardHeader, CardTitle, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

type Props = {
  title?: string;
  icon?: React.ReactNode | null;
  value?: string;
  percentage?: number;
};

const defaultIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="h-4 w-4 text-muted-foreground"
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default function Card({ title = '', icon = defaultIcon, value = '0', percentage }: Props) {
  const mounted = useMounted();

  return (
    <UICard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {!mounted ? (
          <Skeleton className="h-[20px] w-[100px] rounded-full" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {percentage && <p className="text-xs text-muted-foreground">+{percentage}% from last month</p>}
      </CardContent>
    </UICard>
  );
}
