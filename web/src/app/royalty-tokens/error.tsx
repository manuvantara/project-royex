'use client';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { PageHeaderDescription, PageHeader, PageHeaderHeading } from '@/components/ui/page-header';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>Oh no!</PageHeaderHeading>
        <PageHeaderDescription>
          There was an issue with our server. This could be a temporary issue, please try your action again.
        </PageHeaderDescription>
        <div className="flex items-center gap-2 text-destructive">
          <ExclamationTriangleIcon />
          <code className="relative rounded border bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">
            {error.message}
          </code>
        </div>
        <Button className="mt-2" size="lg" onClick={() => reset()}>
          Try Again
        </Button>
      </PageHeader>
    </div>
  );
}
