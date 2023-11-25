import { CardContent, CardHeader, CardTitle, Card as UICard } from './ui/card';

const defaultIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className="h-4 w-4 text-muted-foreground"
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

type Props = {
  title: string;
  value: string;
  icon?: React.ReactNode | null;
  percentage?: string;
};

export default function Card({ title, value, icon = defaultIcon, percentage }: Props) {
  return (
    <UICard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentage && <p className="text-xs text-muted-foreground">{percentage} since last 24 hours</p>}
      </CardContent>
    </UICard>
  );
}
