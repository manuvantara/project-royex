import { PublicRoyaltyOfferingsService } from '@/api/requests';
import PageLayout from '../components/page-layout';
import IroForm from './components/iro-form';
import Stats from './components/stats';

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const contractAddress = await PublicRoyaltyOfferingsService.getContractAddress(royaltyId);

  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="flex items-start justify-center gap-4">
        <div className="w-[400px]">
          <IroForm />
        </div>
        <Stats />
      </div>
    </PageLayout>
  );
}
