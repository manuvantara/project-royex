import { faker } from '@faker-js/faker';
import { RoyaltyPaymentPoolsService } from '@/api/requests';
import Card from '@/components/card';
import Report from '@/components/report';
import PageLayout from '../components/page-layout';
import DepositRoyaltiesForm from './components/deposit-royalties-form';
import RoyaltyPaymentsTable from './components/royalty-payments-table';

const fakeStats = Array.from({ length: 4 }, (_) => ({
  title: faker.word.words(3),
  revenue: Number(faker.finance.amount(0, 100000)),
  percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
}));

export const revalidate = 60;

export default async function Page({ params }: { params: { id: string } }) {
  // const contractAddress = await RoyaltyPaymentPoolsService.getContractAddress(params.id);
  // const royaltyPayments = await RoyaltyPaymentPoolsService.fetchDeposits(params.id);

  const contractAddress = '0x59CDac4907845357A13F9520899278CD62Db9950';

  return (
    <PageLayout contractAddress={contractAddress}>
      <div>
        <div className="grid gap-4 px-4 pb-8 pt-8 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
          {fakeStats.map((stat) => (
            <Card key={stat.title} {...stat} />
          ))}
        </div>
        <div className="grid gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
          <Report />
          {/* <RoyaltyPaymentsTable data={royaltyPayments} /> */}
        </div>
        <div className="w-[400px]">
          <DepositRoyaltiesForm />
        </div>
      </div>
    </PageLayout>
  );
}
