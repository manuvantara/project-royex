/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProposalVotes } from './ProposalVotes';

export type ProposalInfo = {
  proposalId: string;
  proposer: string;
  title: string;
  votingDate: number;
  votingDeadline: number;
  votes: ProposalVotes;
  isExecuted: boolean;
};
