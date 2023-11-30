import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/ui/page-header';

export default function NotFound() {
  return (
    <div className="container relative">
      <PageHeader className="gap-0">
        <p className="font-semibold leading-8 text-primary">404</p>
        <PageHeaderHeading className="mt-4">Royalty Token Not Found</PageHeaderHeading>
        <PageHeaderDescription className="mt-4">
          Sorry, but the royalty token you are looking for does not exist or has been removed.
        </PageHeaderDescription>

        <div className="mt-10">
          <Link href="/royalty-tokens" className="flex items-center gap-1.5 text-sm font-semibold leading-7 text-primary">
            <ArrowLeftIcon className="overflow-visible" />
            Back to royalty tokens
          </Link>
        </div>
      </PageHeader>
    </div>
  );
}
