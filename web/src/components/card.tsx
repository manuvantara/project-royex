import { Card as UICard, CardHeader, CardTitle, CardContent } from './ui/card';

type Props = {
  title: string;
  icon?: React.ReactNode;
  revenue: number;
  percentage: number;
};

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

export default function Card({ title, icon, revenue, percentage }: Props) {
  return (
    <UICard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">{title}</CardTitle>
        {icon ? icon : defaultIcon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${revenue}</div>
        <p className="text-xs text-muted-foreground">+{percentage}% from last month</p>
      </CardContent>
    </UICard>
  );
}
