import { CardContent, CardHeader, Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function StatSkeleton() {
  return (
    <Skeleton>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="h-5 w-24 rounded-xl bg-secondary" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-20 rounded-xl bg-secondary" />
        </CardContent>
      </Card>
    </Skeleton>
  );
}

export function StatWithPercentageSkeleton() {
  return (
    <Skeleton>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="h-5 w-24 rounded-xl bg-secondary" />
        </CardHeader>
        <CardContent className="flex flex-col gap-y-1">
          <div className="h-8 w-20 rounded-xl bg-secondary" />
          <div className="h-3 w-40 rounded-xl bg-secondary" />
        </CardContent>
      </Card>
    </Skeleton>
  );
}

export function ChartSkeleton() {
  return (
    <Skeleton>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="h-4 w-24 rounded-xl bg-secondary" />
        </CardHeader>
        <CardContent className="min-h-[350px] flex-1">
          <div className="h-full w-full rounded-xl bg-secondary" />
        </CardContent>
      </Card>
    </Skeleton>
  );
}

export function StatCardsSkeleton() {
  return (
    <>
      <StatWithPercentageSkeleton />
      <StatWithPercentageSkeleton />
      <StatWithPercentageSkeleton />
      <StatWithPercentageSkeleton />
    </>
  );
}
