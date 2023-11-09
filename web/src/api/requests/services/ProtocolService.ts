/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetRoyaltyIncomeResponse } from '../models/GetRoyaltyIncomeResponse';
import type { GetTradingVolume } from '../models/GetTradingVolume';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProtocolService {

  /**
   * Get Trading Volume
   * @returns GetTradingVolume Successful Response
   * @throws ApiError
   */
  public static protocolGetTradingVolume(): CancelablePromise<GetTradingVolume> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/protocol/trading-volume',
    });
  }

  /**
   * Get Royalty Income Per Protocol
   * @returns GetRoyaltyIncomeResponse Successful Response
   * @throws ApiError
   */
  public static protocolGetRoyaltyIncomePerProtocol(): CancelablePromise<GetRoyaltyIncomeResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/protocol/royalty-income',
    });
  }

}
