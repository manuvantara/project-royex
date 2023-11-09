// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {RXRC4} from "./RXRC4.sol";

contract OtcMarket is RXRC4 {
    constructor(
        address initialOwner,
        IERC20 royaltyToken,
        IERC20 stablecoin
    ) RXRC4(initialOwner, royaltyToken, stablecoin) {}
}
