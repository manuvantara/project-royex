/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Votes } from './Votes';

export type Proposal = {
  proposalId: string;
  proposer: string;
  title: string;
  votingDate: number;
  votingDeadline: number;
  votes: Votes;
  isExecuted: boolean;
  description: string;
  targets: Array<string>;
  values: Array<number>;
  signatures: Array<string>;
  calldatas: Array<string>;
};

