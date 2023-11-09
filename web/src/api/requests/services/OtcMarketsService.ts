/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
  public static otcMarketsGetContractAddress(
    royaltyTokenSymbol: string,
  ): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/otc-markets/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
