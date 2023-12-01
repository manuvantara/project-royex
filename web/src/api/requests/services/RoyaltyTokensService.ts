/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrivateRoyaltyToken } from '../models/PrivateRoyaltyToken';
import type { PublicRoyaltyToken } from '../models/PublicRoyaltyToken';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RoyaltyTokensService {

  /**
   * Get Contract Address
   * @param symbol
   * @returns string Successful Response
   * @throws ApiError
   */
  public static getContractAddress(
    symbol: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-tokens/{symbol}/contract-address',
      path: {
        'symbol': symbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Public
   * @returns PublicRoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchPublic(): CancelablePromise<Array<PublicRoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-tokens/public',
    });
  }

  /**
   * Fetch Private
   * @returns PrivateRoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchPrivate(): CancelablePromise<Array<PrivateRoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/royalty-tokens/private',
    });
  }

}
