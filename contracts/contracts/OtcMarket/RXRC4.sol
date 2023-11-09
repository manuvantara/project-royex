// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IRXRC4} from "./IRXRC4.sol";

abstract contract RXRC4 is IRXRC4, Ownable {
    IERC20 public immutable royaltyToken;
    IERC20 public immutable stablecoin;
    uint256 public tradingFeeRevenue;

    constructor(
        address _initialOwner,
        IERC20 _royaltyToken,
        IERC20 _stablecoin
    ) Ownable(_initialOwner) {
        royaltyToken = _royaltyToken;
        stablecoin = _stablecoin;
    }

    mapping(uint256 offerId => Offer) public offers;

    function hashOffer(
        address seller,
        uint128 royaltyTokenAmount,
        uint128 stablecoinAmount
    ) public pure virtual override returns (uint256 offerId) {
        return uint256(keccak256(abi.encodePacked(seller, royaltyTokenAmount, stablecoinAmount)));
    }

    function _validateOfferParams(
        uint128 royaltyTokenAmount,
        uint128 stablecoinAmount
    ) private pure {
        if (royaltyTokenAmount == 0 || stablecoinAmount == 0) {
            revert InvalidAmount();
        }
        if (stablecoinAmount < 1 ether) {
            revert InsufficientStablecoinAmount(stablecoinAmount, 1 ether);
        }
    }

    function createOffer(
        uint128 royaltyTokenAmount,
        uint128 stablecoinAmount
    ) external virtual override returns (uint256 newOfferId) {
        _validateOfferParams(royaltyTokenAmount, stablecoinAmount);

        address seller = msg.sender;

        newOfferId = hashOffer(seller, royaltyTokenAmount, stablecoinAmount);
        if (offers[newOfferId].seller != address(0)) {
            revert OfferAlreadyExists(newOfferId);
        }

        offers[newOfferId] = Offer(seller, royaltyTokenAmount, stablecoinAmount);
        emit OfferCreated(newOfferId, seller, royaltyTokenAmount, stablecoinAmount);

        royaltyToken.transferFrom(seller, address(this), royaltyTokenAmount);
    }

    modifier offerExists(uint256 offerId) {
        if (offers[offerId].seller == address(0)) {
            revert OfferNotFound(offerId);
        }
        _;
    }

    function cancelOffer(uint256 offerId) external virtual override offerExists(offerId) {
        address operator = msg.sender;
        address seller = offers[offerId].seller;

        if (seller != operator) {
            revert UnauthorizedOfferCancellation(operator, seller);
        }

        royaltyToken.transfer(seller, offers[offerId].royaltyTokenAmount);

        delete offers[offerId];
        emit OfferCancelled(offerId);
    }

    function acceptOffer(uint256 offerId) external virtual override offerExists(offerId) {
        address buyer = msg.sender;
        address seller = offers[offerId].seller;

        uint128 stablecoinAmount = offers[offerId].stablecoinAmount;
        uint128 fee = stablecoinAmount > 100 ether ? stablecoinAmount / 100 : 1 ether;
        uint128 stablecoinAmountLessFee = stablecoinAmount - fee;
        uint128 royaltyTokenAmount = offers[offerId].royaltyTokenAmount;

        tradingFeeRevenue += fee;

        delete offers[offerId];
        emit OfferAccepted(offerId, buyer);

        royaltyToken.transfer(buyer, royaltyTokenAmount);
        stablecoin.transferFrom(buyer, address(this), fee);
        stablecoin.transferFrom(buyer, seller, stablecoinAmountLessFee);
    }

    function collectTradingFeeRevenue(
        uint256 amount,
        address to
    ) external virtual override onlyOwner {
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (amount > tradingFeeRevenue) {
            revert InsufficientTradingFeeRevenue(amount, tradingFeeRevenue);
        }

        tradingFeeRevenue -= amount;
        stablecoin.transfer(to, amount);
    }
}
