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
  public static collectivesGetContractAddress(
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
  public static collectivesFetchProposals(
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
   * @param proposalId
   * @returns Proposal Successful Response
   * @throws ApiError
   */
  public static collectivesGetProposal(
    royaltyTokenSymbol: string,
    proposalId: string,
  ): CancelablePromise<Proposal> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/collectives/{royalty_token_symbol}/proposals/{proposal_id}',
      path: {
        'royalty_token_symbol': royaltyTokenSymbol,
        'proposal_id': proposalId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
