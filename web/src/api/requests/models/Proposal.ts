/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Proposal = {
  proposalId: string;
  proposer: string;
  title: string;
  votingDate: number;
  votingDeadline: number;
  votes: Record<string, any>;
  isExecuted: boolean;
  description: string;
  targets: Array<string>;
  values: Array<number>;
  signatures: Array<string>;
  calldatas: Array<string>;
};

