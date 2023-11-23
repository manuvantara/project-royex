import dayjs from 'dayjs';
import type { ValueIndicator } from '@/api/requests';

type ChartData = {
  timestamp: string;
  value: number;
  fixedValue: string;
}[];

export function parseChartData(data: ValueIndicator): ChartData {
  const formatTimestamp = (timestamp: number) => dayjs.unix(timestamp).format('h:mm A');

  const chartData: ChartData = [];

  if (data.recentValuesDataset) {
    chartData.push(
      ...data.recentValuesDataset.map((d) => ({
        value: Number(d.value),
        fixedValue: Number(d.value).toFixed(2),
        timestamp: formatTimestamp(d.timestamp),
      }))
    );
  }

  chartData.push({
    value: Number(data.current.value),
    fixedValue: Number(data.current.value).toFixed(2),
    timestamp: formatTimestamp(data.current.timestamp),
  });

  return chartData;
}
