import { faker } from '@faker-js/faker';
import RoyaltyPaymentsTable from './components/royalty-payments-table';
import { RoyaltyPaymentPoolsService } from '@/api/requests';
import Card from '@/components/card';
import Report from '@/components/report';

const fakeStats = Array.from({ length: 4 }, (_) => ({
  title: faker.word.words(3),
  revenue: Number(faker.finance.amount(0, 100000)),
  percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
}));

export default async function Page({ params }: { params: { id: string } }) {
  const royaltyPayments = await RoyaltyPaymentPoolsService.fetchDeposits(params.id);

  console.log(royaltyPayments);

  return (
    <div>
      <div className="grid gap-4 px-4 pb-8 pt-8 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
        {fakeStats.map((stat) => (
          <Card key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
        <Report />
        <RoyaltyPaymentsTable data={royaltyPayments} />
      </div>
    </div>
  );
}
