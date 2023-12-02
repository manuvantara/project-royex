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

export function TokenCardSkeleton() {
  return (
    <Skeleton>
      <Card className="h-full">
        <CardHeader className="space-y-0 pb-2">
          <div className="h-5 w-24 rounded-xl bg-secondary" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 h-8 w-20 rounded-xl bg-secondary" />
            <div className="h-3 w-40 rounded-xl bg-secondary" />
            <div className="mt-4 h-20 w-full rounded-xl bg-secondary" />
          </div>
          <div>
            <div className="mb-1 h-8 w-20 rounded-xl bg-secondary" />
            <div className="h-3 w-40 rounded-xl bg-secondary" />
            <div className="mt-4 h-20 w-full rounded-xl bg-secondary" />
          </div>
        </CardContent>
      </Card>
    </Skeleton>
  );
}

export function TokensSectionSkeleton() {
  return (
    <div className="px-4 pb-8 pt-4">
      <Skeleton className="mb-6 w-fit">
        <div className="h-9 w-60 rounded-xl bg-secondary" />
      </Skeleton>
      <div className="grid grid-cols-3 gap-4">
        <TokenCardSkeleton />
        <TokenCardSkeleton />
        <TokenCardSkeleton />
      </div>
    </div>
  );
}

export function ProposalSkeleton() {
  return (
    <>
      <Skeleton className="w-fit">
        <div className="h-8 w-40 rounded-xl bg-secondary" />
      </Skeleton>
      <div className="grid gap-4 py-6 md:grid-cols-[1fr_350px]">
        <Skeleton>
          <Card className="h-full">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-5 w-24 rounded-xl bg-secondary" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 h-8 w-20 rounded-xl bg-secondary" />
                <div className="h-3 w-40 rounded-xl bg-secondary" />
                <div className="mt-4 h-20 w-full rounded-xl bg-secondary" />
              </div>
              <div>
                <div className="mb-1 h-8 w-20 rounded-xl bg-secondary" />
                <div className="h-3 w-40 rounded-xl bg-secondary" />
                <div className="mt-4 h-20 w-full rounded-xl bg-secondary" />
              </div>
            </CardContent>
          </Card>
        </Skeleton>
        <Skeleton>
          <Card className="h-full">
            <CardHeader className="mb-4">
              <div className="h-7 w-24 rounded-xl bg-secondary" />
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                <div className="flex items-center justify-between pb-2">
                  <div className="h-5 w-8 rounded-full bg-secondary" />
                  <div className="h-4 w-4 rounded-full bg-accent" />
                </div>
                <div className="h-7 w-20 rounded-xl bg-secondary" />
              </div>
              <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                <div className="flex items-center justify-between pb-2">
                  <div className="h-5 w-8 rounded-full bg-secondary" />
                  <div className="h-4 w-4 rounded-full bg-accent" />
                </div>
                <div className="h-7 w-20 rounded-xl bg-secondary" />
              </div>
              <div className="rounded-xl border bg-card p-4 text-card-foreground shadow">
                <div className="flex items-center justify-between pb-2">
                  <div className="h-5 w-8 rounded-full bg-secondary" />
                  <div className="h-4 w-4 rounded-full bg-accent" />
                </div>
                <div className="h-7 w-20 rounded-xl bg-secondary" />
              </div>
            </CardContent>
          </Card>
        </Skeleton>
      </div>
    </>
  );
}
