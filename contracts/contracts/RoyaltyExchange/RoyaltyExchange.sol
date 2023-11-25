// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {RXRC6} from "./RXRC6.sol";

contract RoyaltyExchange is RXRC6 {
    constructor(
        address initialOwner,
        IERC20 royaltyToken,
        IERC20 stablecoin
    ) RXRC6(initialOwner, royaltyToken, stablecoin) {}
}
