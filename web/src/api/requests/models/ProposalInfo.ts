/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProposalVotes } from './ProposalVotes';

export type ProposalInfo = {
  proposalId: string;
  proposer: string;
  title: string;
  votes: ProposalVotes;
  isExecuted: boolean;
};

