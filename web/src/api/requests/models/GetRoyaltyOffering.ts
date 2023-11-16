/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ValueIndicator } from './ValueIndicator';

export type GetRoyaltyOffering = {
  offeringDate: number;
  offeringPrice: number;
  royaltyTokenReserve: ValueIndicator;
  stablecoinReserve: ValueIndicator;
};
