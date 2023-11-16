/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TimeSeriesDataPoint } from './TimeSeriesDataPoint';

export type ValueIndicator = {
  current: TimeSeriesDataPoint;
  recentValuesDataset?: Array<TimeSeriesDataPoint>;
};

