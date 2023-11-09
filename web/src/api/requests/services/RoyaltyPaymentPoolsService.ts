/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Deposit } from '../models/Deposit';
import type { GetRoyaltyIncomeResponse } from '../models/GetRoyaltyIncomeResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoyaltyPaymentPoolsService {

  /**
   * Get Contract Address
   * @param royaltyId
   * @returns string Successful Response
   * @throws ApiError
   */
  public static royaltyPaymentPoolsGetContractAddress(
    royaltyId: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-payment-pools/{royalty_id}/contract-address',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Royalty Income
   * @param royaltyId
   * @returns GetRoyaltyIncomeResponse Successful Response
   * @throws ApiError
   */
  public static royaltyPaymentPoolsGetRoyaltyIncome(
    royaltyId: string,
  ): CancelablePromise<GetRoyaltyIncomeResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-payment-pools/{royalty_id}/royalty-income',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Deposits
   * @param royaltyId
   * @returns Deposit Successful Response
   * @throws ApiError
   */
  public static royaltyPaymentPoolsFetchDeposits(
    royaltyId: string,
  ): CancelablePromise<Array<Deposit>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-payment-pools/{royalty_id}/deposits',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
