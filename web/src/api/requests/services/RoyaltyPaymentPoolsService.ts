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
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getContractAddress(
    royaltyId: string,
  ): CancelablePromise<any> {
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
  public static getRoyaltyIncome(
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
  public static fetchDeposits(
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