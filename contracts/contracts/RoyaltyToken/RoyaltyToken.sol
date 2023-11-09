// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {RXRC1} from "./RXRC1.sol";

contract RoyaltyToken is RXRC1 {
    constructor(address defaultAdmin) RXRC1(defaultAdmin, "RoyaltyToken", "RX1") {}
}
