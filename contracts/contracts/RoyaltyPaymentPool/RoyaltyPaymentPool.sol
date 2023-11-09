// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {RXRC2} from "./RXRC2.sol";
import {RXRC1} from "../RoyaltyToken/RXRC1.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RoyaltyPaymentPool is RXRC2 {
    constructor(
        address _initialOwner,
        RXRC1 _royaltyToken,
        IERC20 _stablecoin
    ) RXRC2(_initialOwner, _royaltyToken, _stablecoin) {}
}
