import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/ui/page-header';
import Navbar from './navbar';

export default function PageLayout({
  children,
  contractAddress,
}: {
  children: React.ReactNode;
  contractAddress: string;
}) {
  return (
    <div className="container relative">
      <PageHeader className="relative pb-4 md:pb-8 lg:pb-12">
        <PageHeaderHeading>Be part of the Collective.</PageHeaderHeading>
        <PageHeaderDescription>Manage your Royalty Tokens with Collective.</PageHeaderDescription>
      </PageHeader>
      <Navbar contractAddress={contractAddress} />
      <section>{children}</section>
    </div>
  );
}
