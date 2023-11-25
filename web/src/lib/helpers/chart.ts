import dayjs from 'dayjs';
// import timezonePlugin from 'dayjs/plugin/timezone';
// import utcPlugin from 'dayjs/plugin/utc';
import type { ValueIndicator } from '@/api/requests';

// dayjs.extend(utcPlugin);
// dayjs.extend(timezonePlugin);

// const timezone = dayjs.tz.guess();

// dayjs.tz.setDefault('Asia/Jakarta');

type ChartData = {
  timestamp: string;
  value: number;
  fixedValue: string;
}[];

export function parseChartData(data: ValueIndicator): ChartData {
  const formatTimestamp = (timestamp: number) => dayjs.unix(timestamp).format('HH:mm');

  const chartData: ChartData =
    data.recentValuesDataset?.map((d) => ({
      value: Number(d.value),
      fixedValue: Number(d.value).toFixed(2),
      timestamp: formatTimestamp(d.timestamp),
    })) || [];

  return chartData;
}
