import { PublicRoyaltyOfferingsService } from '@/api/requests';
import PageLayout from '../components/page-layout';
import IroForm from './components/iro-form';
import Stats from './components/stats';

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const contractAddress = await PublicRoyaltyOfferingsService.getContractAddress(royaltyId);
  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="my-8 rounded-md border p-6">
        <div className="space-y-1.5 p-6 ">
          <h1 className="font-semibold">Initial Royalty Offering</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            IRO is a place where royalty tokens are initially offered.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <IroForm />
          </div>
          <Stats />
        </div>
      </div>
    </PageLayout>
  );
}
