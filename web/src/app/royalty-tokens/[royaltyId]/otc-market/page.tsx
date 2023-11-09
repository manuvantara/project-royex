import PageLayout from '../components/page-layout';
import CreateOfferForm from './components/create-offer-form';

export default function Page() {
  return (
    <PageLayout contractAddress="0x">
      <div className="flex items-start justify-center gap-4">
        <div className="w-[400px]">
          <CreateOfferForm />
        </div>
      </div>
    </PageLayout>
  );
}
