/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ValueIndicator } from '../models/ValueIndicator';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoyaltyExchangesService {

  /**
   * Get Contract Address
   * @param royaltyId
   * @returns string Successful Response
   * @throws ApiError
   */
  public static royaltyExchangesGetContractAddress(
    royaltyId: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-exchanges/{royalty_id}/contract-address',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Price
   * @param royaltyId
   * @returns ValueIndicator Successful Response
   * @throws ApiError
   */
  public static royaltyExchangesGetPrice(
    royaltyId: string,
  ): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-exchanges/{royalty_id}/price',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Trading Volume
   * @param royaltyId
   * @returns ValueIndicator Successful Response
   * @throws ApiError
   */
  public static royaltyExchangesGetTradingVolume(
    royaltyId: string,
  ): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-exchanges/{royalty_id}/trading-volume',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
