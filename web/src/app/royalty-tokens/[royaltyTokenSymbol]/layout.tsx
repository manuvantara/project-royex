import {
  CollectivesService,
  InitialRoyaltyOfferingsService,
  OtcMarketsService,
  RoyaltyExchangesService,
  RoyaltyPaymentPoolsService,
} from '@/api/requests';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/ui/page-header';
import Navbar from './components/navbar';

export default async function RoyaltyTokenSymbolLayout({
  children,
  params: { royaltyTokenSymbol },
}: {
  children: React.ReactNode;
  params: { royaltyTokenSymbol: string };
}) {
  const contractAddresses = await Promise.all([
    RoyaltyPaymentPoolsService.getContractAddress(royaltyTokenSymbol),
    CollectivesService.getContractAddress(royaltyTokenSymbol),
    OtcMarketsService.getContractAddress(royaltyTokenSymbol),
    RoyaltyExchangesService.getContractAddress(royaltyTokenSymbol),
    InitialRoyaltyOfferingsService.getContractAddress(royaltyTokenSymbol),
  ]);

  return (
    <div className="container relative">
      <PageHeader className="relative pb-4 md:pb-8 lg:pb-12">
        <PageHeaderHeading>Be part of the Collective.</PageHeaderHeading>
        <PageHeaderDescription>Manage your Royalty Tokens with Collective.</PageHeaderDescription>
      </PageHeader>
      <Navbar contractAddresses={contractAddresses} />
      <section>{children}</section>
    </div>
  );
}
