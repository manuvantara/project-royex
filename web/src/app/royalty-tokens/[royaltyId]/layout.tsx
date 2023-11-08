import Navbar from './components/navbar';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/ui/page-header';
export default function RoyaltyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative">
      <PageHeader className="relative pb-4 md:pb-8 lg:pb-12">
        <PageHeaderHeading>Be part of the Collective.</PageHeaderHeading>
        <PageHeaderDescription>Manage your Royalty Tokens with Collective.</PageHeaderDescription>
      </PageHeader>
      <Navbar />
      <section>{children}</section>
    </div>
  );
}
