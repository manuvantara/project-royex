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
   * @param royaltyTokenSymbol
   * @returns string Successful Response
   * @throws ApiError
   */
  public static getContractAddress(
    royaltyTokenSymbol: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-exchanges/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Price
   * @param royaltyTokenSymbol
   * @returns ValueIndicator Successful Response
   * @throws ApiError
   */
  public static getPrice(
    royaltyTokenSymbol: string,
  ): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-exchanges/{royalty_token_symbol}/price',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Trading Volume
   * @param royaltyTokenSymbol
   * @returns ValueIndicator Successful Response
   * @throws ApiError
   */
  public static getTradingVolume(
    royaltyTokenSymbol: string,
  ): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-exchanges/{royalty_token_symbol}/trading-volume',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
