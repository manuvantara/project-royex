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

export function PriceChartSkeleton() {
  return (
    <Skeleton>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="h-4 w-24 rounded-xl bg-secondary" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-full w-full rounded-xl bg-secondary" />
        </CardContent>
      </Card>
    </Skeleton>
  );
}

// For now we'll duplicate this skeleton with the above one to keep the naming simple
export function TradingVolumeSkeleton() {
  return (
    <Skeleton>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="h-4 w-24 rounded-xl bg-secondary" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-full w-full rounded-xl bg-secondary" />
        </CardContent>
      </Card>
    </Skeleton>
  );
}
