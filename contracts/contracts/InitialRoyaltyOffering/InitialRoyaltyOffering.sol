// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {RXRC5} from "./RXRC5.sol";

contract InitialRoyaltyOffering is RXRC5 {
    constructor(
        address initialOwner,
        IERC20 royaltyToken,
        IERC20 stablecoin,
        uint48 offeringDate,
        uint128 offeringPrice
    ) RXRC5(initialOwner, royaltyToken, stablecoin, offeringDate, offeringPrice) {}
}
