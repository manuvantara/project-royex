/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TimeSeriesDataPoint } from './TimeSeriesDataPoint';

export type BaseValueIndicator = {
  current: TimeSeriesDataPoint;
  recentValuesDataset: Array<TimeSeriesDataPoint>;
};

