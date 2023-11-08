/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoyaltyToken } from '../models/RoyaltyToken';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoyaltyTokensService {

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
      url: '/royalty-tokens/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Public
   * @param royaltyTokenSymbol
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchPublic(
    royaltyTokenSymbol: string,
  ): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-tokens/{royalty_token_symbol}/public',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Private
   * @param royaltyTokenSymbol
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchPrivate(
    royaltyTokenSymbol: string,
  ): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-tokens/{royalty_token_symbol}/private',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
