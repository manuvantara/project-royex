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
   * @param royaltyTokenSymbol
   * @returns string Successful Response
   * @throws ApiError
   */
  public static getContractAddress(
    royaltyTokenSymbol: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-payment-pools/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Royalty Income
   * @param royaltyTokenSymbol
   * @returns GetRoyaltyIncomeResponse Successful Response
   * @throws ApiError
   */
  public static getRoyaltyIncome(
    royaltyTokenSymbol: string,
  ): CancelablePromise<GetRoyaltyIncomeResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-payment-pools/{royalty_token_symbol}/royalty-income',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Deposits
   * @param royaltyTokenSymbol
   * @returns Deposit Successful Response
   * @throws ApiError
   */
  public static fetchDeposits(
    royaltyTokenSymbol: string,
  ): CancelablePromise<Array<Deposit>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-payment-pools/{royalty_token_symbol}/deposits',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
