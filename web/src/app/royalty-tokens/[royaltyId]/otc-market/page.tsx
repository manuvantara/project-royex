import { OtcMarketsService } from '@/api/requests';
import PageLayout from '../components/page-layout';
import CreateOfferForm from './components/create-offer-form';

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const contractAddress = await OtcMarketsService.getContractAddress(royaltyId);

  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="my-8 rounded-md border p-6">
        <div className="space-y-1.5 p-6 ">
          <h1 className="font-semibold">Royalty Exchange</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Over-the-counter Market is a decentralized market in which stakeholders trade p2p with each other.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <div className="w-[400px]">
              <CreateOfferForm />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
