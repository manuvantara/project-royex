// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IRXRC6} from "./IRXRC6.sol";

abstract contract RXRC6 is IRXRC6, Ownable {
    IERC20 public immutable royaltyToken;
    IERC20 public immutable stablecoin;

    uint256 public royaltyTokenReserve; // royalty token reserve
    uint256 public stablecoinReserve; // stablecoin reserve
    uint256 public tradingFeeRevenue; // accumulated trading fee collected by Royex

    constructor(
        address _initialOwner,
        IERC20 _royaltyToken,
        IERC20 _stablecoin
    ) Ownable(_initialOwner) {
        royaltyToken = _royaltyToken;
        stablecoin = _stablecoin;
    }

    function provideInitialLiquidity(
        uint256 initialRoyaltyTokenReserve,
        uint256 initialStablecoinReserve
    ) external virtual override onlyOwner {
        if (initialRoyaltyTokenReserve == 0 || initialStablecoinReserve == 0) {
            revert InvalidAmount();
        }

        address exchange = address(this);
        address provider = msg.sender;

        if (stablecoin.balanceOf(exchange) != 0 && royaltyToken.balanceOf(exchange) != 0) {
            revert InitialLiquidityAlreadyProvided();
        }

        royaltyTokenReserve += initialRoyaltyTokenReserve;
        stablecoinReserve += initialStablecoinReserve;
        emit InitialLiquidityProvided(initialRoyaltyTokenReserve, initialStablecoinReserve);

        royaltyToken.transferFrom(provider, exchange, initialRoyaltyTokenReserve);
        stablecoin.transferFrom(provider, exchange, initialStablecoinReserve);
    }

    modifier checkAmount(uint256 amount) {
        if (amount == 0) {
            revert InvalidAmount();
        }
        _;
    }

    function buy(
        uint256 royaltyTokenAmount,
        uint256 desiredStablecoinAmount,
        uint16 priceSlippage
    ) external virtual override checkAmount(royaltyTokenAmount) {
        address trader = msg.sender;

        uint256 requiredStablecoinAmount = calculateStablecoinAmount(true, royaltyTokenAmount);
        uint256 stablecoinReserveDelta = (royaltyTokenAmount * stablecoinReserve) /
            (royaltyTokenReserve - royaltyTokenAmount);

        if (1000 * requiredStablecoinAmount > (1000 + priceSlippage) * desiredStablecoinAmount) {
            revert PriceSlipped(requiredStablecoinAmount, desiredStablecoinAmount, priceSlippage);
        }

        royaltyTokenReserve -= royaltyTokenAmount;
        stablecoinReserve += stablecoinReserveDelta;
        emit RoyaltyTokenBought(
            trader,
            royaltyTokenAmount,
            requiredStablecoinAmount,
            royaltyTokenReserve,
            stablecoinReserve
        );
        tradingFeeRevenue += requiredStablecoinAmount - stablecoinReserveDelta;

        stablecoin.transferFrom(trader, address(this), requiredStablecoinAmount);
        royaltyToken.transfer(trader, royaltyTokenAmount);
    }

    function sell(
        uint256 royaltyTokenAmount,
        uint256 desiredStablecoinAmount,
        uint16 priceSlippage
    ) external virtual override checkAmount(royaltyTokenAmount) {
        address trader = msg.sender;

        uint256 givenStablecoinAmount = calculateStablecoinAmount(false, royaltyTokenAmount);
        uint256 stablecoinReserveDelta = (royaltyTokenAmount * stablecoinReserve) /
            (royaltyTokenReserve + royaltyTokenAmount);

        if (1000 * givenStablecoinAmount < (1000 - priceSlippage) * desiredStablecoinAmount) {
            revert PriceSlipped(givenStablecoinAmount, desiredStablecoinAmount, priceSlippage);
        }

        royaltyTokenReserve += royaltyTokenAmount;
        stablecoinReserve -= stablecoinReserveDelta;
        emit RoyaltyTokenSold(
            trader,
            royaltyTokenAmount,
            givenStablecoinAmount,
            royaltyTokenReserve,
            stablecoinReserve
        );
        tradingFeeRevenue += stablecoinReserveDelta - givenStablecoinAmount;

        royaltyToken.transferFrom(trader, address(this), royaltyTokenAmount);
        stablecoin.transfer(trader, givenStablecoinAmount);
    }

    function calculateStablecoinAmount(
        bool buyOrSell,
        uint256 royaltyTokenAmount
    )
        public
        view
        virtual
        override
        checkAmount(royaltyTokenAmount)
        returns (uint256 stablecoinAmount)
    {
        if (buyOrSell) {
            // buy
            if (royaltyTokenAmount >= royaltyTokenReserve) {
                revert ReserveExceeded(royaltyTokenAmount, royaltyTokenReserve);
            }
            stablecoinAmount =
                (1003 * royaltyTokenAmount * stablecoinReserve) /
                (1000 * royaltyTokenReserve - 1003 * royaltyTokenAmount);
        } else {
            // sell
            stablecoinAmount =
                (997 * royaltyTokenAmount * stablecoinReserve) /
                (1000 * royaltyTokenReserve + 997 * royaltyTokenAmount);
            if (stablecoinAmount >= stablecoinReserve) {
                revert ReserveExceeded(stablecoinAmount, stablecoinReserve);
            } // redundant
        }
    }

    function collectTradingFeeRevenue(
        uint256 amount,
        address to
    ) external virtual override checkAmount(amount) onlyOwner {
        if (amount > tradingFeeRevenue) {
            revert ReserveExceeded(amount, tradingFeeRevenue);
        }

        tradingFeeRevenue -= amount;
        stablecoin.transfer(to, amount);
    }
}
