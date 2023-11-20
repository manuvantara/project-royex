// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Time} from "@openzeppelin/contracts/utils/types/Time.sol";

import {IRXRC5} from "./IRXRC5.sol";

abstract contract RXRC5 is IRXRC5, Ownable {
    IERC20 public immutable royaltyToken;
    IERC20 public immutable stablecoin;

    uint48 public immutable offeringDate;
    uint128 public immutable offeringPrice;

    constructor(
        address _initialOwner,
        IERC20 _royaltyToken,
        IERC20 _stablecoin,
        uint48 _offeringDate,
        uint128 _offeringPrice
    ) Ownable(_initialOwner) {
        royaltyToken = _royaltyToken;
        stablecoin = _stablecoin;
        offeringDate = _offeringDate;
        offeringPrice = _offeringPrice;
    }

    modifier checkAmount(uint256 amount) {
        if (amount == 0) revert InvalidAmount();
        _;
    }

    function depositRoyaltyTokens(
        uint128 amount
    ) external onlyOwner checkAmount(amount) {
        if (royaltyToken.balanceOf(address(this)) != 0) {
            revert RoyaltyTokensAlreadyDeposited();
        }

        emit RoyaltyTokensDeposited(amount);
        royaltyToken.transferFrom(msg.sender, address(this), amount);
    }

    function buy(uint128 amount) external checkAmount(amount) {
        uint256 royaltyTokenReserve = royaltyToken.balanceOf(address(this));

        if (amount > royaltyTokenReserve) {
            revert ReserveExceeded(amount, royaltyTokenReserve);
        }
        if (Time.timestamp() < offeringDate) {
            revert OfferingNotAvailable(Time.timestamp(), offeringDate);
        }

        address account = msg.sender;

        emit RoyaltyTokensBought(account, amount);
        royaltyToken.transfer(account, amount);
        stablecoin.transferFrom(account, address(this), offeringPrice * amount);
    }
}
