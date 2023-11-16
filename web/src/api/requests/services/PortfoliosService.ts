/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetEstimatedPortfolioValue } from '../models/GetEstimatedPortfolioValue';
import type { GetRoyaltyIncomeResponse } from '../models/GetRoyaltyIncomeResponse';
import type { RoyaltyToken } from '../models/RoyaltyToken';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PortfoliosService {

  /**
   * Get Estimated Portfolio Value
   * @param stakeholderAddress
   * @returns GetEstimatedPortfolioValue Successful Response
   * @throws ApiError
   */
  public static getEstimatedPortfolioValue(
    stakeholderAddress: string,
  ): CancelablePromise<GetEstimatedPortfolioValue> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/portfolios/{stakeholder_address}/estimated-value',
      path: {
        'stakeholder_address': stakeholderAddress,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Calculate Royalty Income
   * @param stakeholderAddress
   * @returns GetRoyaltyIncomeResponse Successful Response
   * @throws ApiError
   */
  public static calculateRoyaltyIncome(
    stakeholderAddress: string,
  ): CancelablePromise<GetRoyaltyIncomeResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/portfolios/{stakeholder_address}/royalty-income',
      path: {
        'stakeholder_address': stakeholderAddress,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Public Royalty Tokens
   * @param stakeholderAddress
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchPublicRoyaltyTokens(
    stakeholderAddress: string,
  ): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/portfolios/{stakeholder_address}/public-royalty-tokens',
      path: {
        'stakeholder_address': stakeholderAddress,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Private Royalty Tokens
   * @param stakeholderAddress
   * @returns RoyaltyToken Successful Response
   * @throws ApiError
   */
  public static fetchPrivateRoyaltyTokens(
    stakeholderAddress: string,
  ): CancelablePromise<Array<RoyaltyToken>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/portfolios/{stakeholder_address}/private-royalty-tokens',
      path: {
        'stakeholder_address': stakeholderAddress,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
