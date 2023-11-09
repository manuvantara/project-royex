import { faker } from '@faker-js/faker';
import Card from '@/components/card';
import CardMetric from '@/components/card-metric';
import Report from '@/components/report';
import RoyaltyTokensSection from './components/royalty-tokens-section';

const fakeStats = Array.from({ length: 4 }, (_) => ({
  title: faker.word.words(3),
  revenue: Number(faker.finance.amount(0, 100000)),
  percentage: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
}));

export default function Page() {
  return (
    <div className="container">
      <div className="grid gap-4 px-4 pb-8 pt-8 md:grid-cols-2 md:pt-12 lg:grid-cols-4">
        {fakeStats.map((stat) => (
          <Card key={stat.title} {...stat} />
        ))}
      </div>
      <div className="grid gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
        <CardMetric />
        <Report />
      </div>
      <RoyaltyTokensSection title="Live Initial Royalty Offerings" data={fakeStats} />
      <RoyaltyTokensSection title="Upcoming Initial Royalty Offerings" data={fakeStats} />
      <RoyaltyTokensSection title="Public Royalty Tokens" data={fakeStats} />
      <RoyaltyTokensSection title="Private Royalty Tokens" data={fakeStats} />
    </div>
  );
}
