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
   * @param royaltyId
   * @returns string Successful Response
   * @throws ApiError
   */
  public static getContractAddress(
    royaltyId: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_id}/contract-address',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Floor Price
   * @param royaltyId
   * @returns ValueIndicator Successful Response
   * @throws ApiError
   */
  public static getFloorPrice(
    royaltyId: string,
  ): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_id}/floor-price',
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
  public static getTradingVolume(
    royaltyId: string,
  ): CancelablePromise<ValueIndicator> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_id}/trading-volume',
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
   * @returns Offer Successful Response
   * @throws ApiError
   */
  public static getTradingVolume1(
    royaltyId: string,
  ): CancelablePromise<Array<Offer>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_id}/offers',
      path: {
        'royalty_id': royaltyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
