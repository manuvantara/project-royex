/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Votes } from './Votes';

export type ShortenProposal = {
  proposalId: string;
  proposer: string;
  title: string;
  votingDate: number;
  votingDeadline: number;
  votes: Votes;
  isExecuted: boolean;
};

