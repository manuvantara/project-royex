/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ShortenProposal = {
  proposalId: string;
  proposer: string;
  title: string;
  votingDate: number;
  votingDeadline: number;
  votes: Record<string, any>;
  isExecuted: boolean;
};

