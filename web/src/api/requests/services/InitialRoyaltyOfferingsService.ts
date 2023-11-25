/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoyaltyToken } from '../models/RoyaltyToken';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InitialRoyaltyOfferingsService {

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
      url: '/initial-royalty-offerings/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Live
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchLive(): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/initial-royalty-offerings/live',
    });
  }

  /**
   * Fetch Upcoming
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchUpcoming(): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/initial-royalty-offerings/upcoming',
    });
  }

}
