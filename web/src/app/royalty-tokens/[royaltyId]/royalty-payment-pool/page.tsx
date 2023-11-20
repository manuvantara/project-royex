import { faker } from '@faker-js/faker';
import Balancer from 'react-wrap-balancer';
import PageLayout from '../components/page-layout';
import DepositRoyaltiesForm from './components/deposit-royalties-form';
import RoyaltyPaymentsTable from './components/royalty-payments-table';
import { RoyaltyPaymentPoolsService } from '@/api/requests';
import Card from '@/components/card';
import Report from '@/components/report';

const fakeStats = Array.from({ length: 4 }, (_) => ({
  title: faker.word.words(3),
  revenue: Number(faker.finance.amount(0, 100000)),
  percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
}));

export const revalidate = 60;

export default async function Page({ params: { royaltyId } }: { params: { royaltyId: string } }) {
  const contractAddress = await RoyaltyPaymentPoolsService.getContractAddress(royaltyId);
  const royaltyPayments = await RoyaltyPaymentPoolsService.fetchDeposits(royaltyId);

  

  return (
    <PageLayout contractAddress={contractAddress}>
      <div className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-4">
        {fakeStats.map((stat) => (
          <Card key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 py-8 md:grid-cols-2">
        <Report />
        <RoyaltyPaymentsTable data={royaltyPayments} />
      </div>
      <div className="rounded-md border p-6">
        <div className="space-y-1 p-6">
          <h3 className="text-2xl font-semibold tracking-tight">Royalty Payment Pool</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            <Balancer>
              Distributors deposit royalties into a payment pool, creating a checkpoint. Investors can then withdraw
              revenues proportional to their royalty rates at the checkpoint.
            </Balancer>
          </p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <DepositRoyaltiesForm royaltyPaymentPoolAddress={contractAddress} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
