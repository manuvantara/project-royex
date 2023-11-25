// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

import {RXRC3} from "./RXRC3.sol";

contract StakeholderCollective is RXRC3 {
    constructor(IVotes royaltyToken, string memory name) RXRC3(royaltyToken, name) {}
}
