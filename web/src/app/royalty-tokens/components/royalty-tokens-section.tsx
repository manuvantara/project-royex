import CardChart from '@/components/card-chart';

type Props = {
  title: string;
  data: any[]; // TODO: define type
};

export default function RoyaltyTokensSection({ title, data }: Props) {
  return (
    <section className="px-4 pb-8 pt-4">
      <h3 className="mb-6 text-3xl font-bold capitalize tracking-tight">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {data.map((item, index) => (
          <CardChart key={index} />
        ))}
      </div>
    </section>
  );
}
