import { ValueIndicator } from '@/api/requests';

type ChartData = {
  timestamp: string;
  value: number;
}[];

const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export default function parseChartData(data: ValueIndicator): ChartData {
  if (!data.recentValuesDataset) {
    return [
      {
        timestamp: new Date(data.current.timestamp).toLocaleDateString(undefined, dateFormat),
        value: data.current.value,
      },
    ];
  }

  return [
    ...data.recentValuesDataset.map((d) => ({
      ...d,
      timestamp: new Date(d.timestamp).toLocaleDateString(undefined, dateFormat),
    })),
    {
      ...data.current,
      timestamp: new Date(data.current.timestamp).toLocaleDateString(undefined, dateFormat),
    },
  ];
}
