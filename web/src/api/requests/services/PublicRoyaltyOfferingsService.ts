/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetRoyaltyOffering } from '../models/GetRoyaltyOffering';
import type { RoyaltyToken } from '../models/RoyaltyToken';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PublicRoyaltyOfferingsService {

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
      url: '/public-royalty-offerings/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Royalty Offering
   * @param royaltyTokenSymbol
   * @returns GetRoyaltyOffering Successful Response
   * @throws ApiError
   */
  public static getRoyaltyOffering(
    royaltyTokenSymbol: string,
  ): CancelablePromise<GetRoyaltyOffering> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/public-royalty-offerings/{royalty_token_symbol}',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Upcoming
   * @param royaltyTokenSymbol
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchUpcoming(
    royaltyTokenSymbol: string,
  ): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/public-royalty-offerings/{royalty_token_symbol}/live',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
