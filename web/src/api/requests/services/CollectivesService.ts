/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Proposal } from '../models/Proposal';
import type { ShortenProposal } from '../models/ShortenProposal';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CollectivesService {

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
      url: '/collectives/{royalty_token_symbol}/contract-address',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Fetch Proposals
   * @param royaltyTokenSymbol
   * @returns ShortenProposal Successful Response
   * @throws ApiError
   */
  public static fetchProposals(
    royaltyTokenSymbol: string,
  ): CancelablePromise<Array<ShortenProposal>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/collectives/{royalty_token_symbol}/proposals',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Proposal
   * @param royaltyTokenSymbol
   * @returns Proposal Successful Response
   * @throws ApiError
   */
  public static getProposal(
    royaltyTokenSymbol: string,
  ): CancelablePromise<Array<Proposal>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/collectives/{royalty_token_symbol}/proposals/{proposal_id}',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
