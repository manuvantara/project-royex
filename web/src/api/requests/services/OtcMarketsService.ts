/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Offer } from '../models/Offer';
import type { ValueIndicator } from '../models/ValueIndicator';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OtcMarketsService {
  /**
   * Get Contract Address
   * @param royaltyTokenSymbol
   * @returns string Successful Response
   * @throws ApiError
   */
  public static getContractAddress(royaltyTokenSymbol: string): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_token_symbol}/contract-address',
      path: {
        royalty_token_symbol: royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Floor Price
   * @param royaltyTokenSymbol
   * @returns ValueIndicator Successful Response
   * @throws ApiError
   */
  public static getFloorPrice(royaltyTokenSymbol: string): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_token_symbol}/floor-price',
      path: {
        royalty_token_symbol: royaltyTokenSymbol,
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
  public static getTradingVolume(royaltyTokenSymbol: string): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_token_symbol}/trading-volume',
      path: {
        royalty_token_symbol: royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Offers
   * @param royaltyTokenSymbol
   * @returns Offer Successful Response
   * @throws ApiError
   */
  public static fetchOffers(royaltyTokenSymbol: string): CancelablePromise<Array<Offer>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_token_symbol}/offers',
      path: {
        royalty_token_symbol: royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
