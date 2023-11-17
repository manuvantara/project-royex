import { faker } from '@faker-js/faker';
import Balancer from 'react-wrap-balancer';
import { RoyaltyPaymentPoolsService } from '@/api/requests';
import Card from '@/components/card';
import Report from '@/components/report';
import PageLayout from '../components/page-layout';
import DepositRoyaltiesForm from './components/deposit-royalties-form';
import RoyaltyPaymentsTable from './components/royalty-payments-table';
import WithdrawRoyaltiesForm from './components/withdraw-royalties-form';

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
      <div className="py-8">
        <div className="grid gap-4 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
          {fakeStats.map((stat) => (
            <Card key={stat.title} {...stat} />
          ))}
        </div>
        <div className="grid gap-4 pb-8 pt-4 md:grid-cols-2">
          <Report />
          {/* <RoyaltyPaymentsTable data={royaltyPayments} /> */}
        </div>
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
            <DepositRoyaltiesForm />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
