// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRXRC6 {
    /**
     * @dev Amount is 0.
     */
    error InvalidAmount();

    /**
     * @dev Required amount to initiate trade requires exceeds available reserves.
     */
    error ReserveExceeded(uint256 requiredAmount, uint256 availableAmount);

    /**
     * @dev Initial liquidity already provided.
     */
    error InitialLiquidityAlreadyProvided();

    /**
     * @dev The required or given amount is unsatisfactory considering price slippage and desired amount.
     */
    error PriceSlipped(
        uint256 stablecoinAmount,
        uint256 desiredStablecoinAmount,
        uint16 priceSlippage
    );

    /**
     * @dev Emmited when initial liquidity is provided
     */
    event InitialLiquidityProvided(
        uint256 initialRoyaltyTokenReserve,
        uint256 initialStablecoinReserve
    );

    /**
     * @dev Emmited by {buy} when a trader buys `royaltyTokenAmount` for `stablecoinAmount`.
     */
    event RoyaltyTokenBought(
        address indexed trader,
        uint256 royaltyTokenAmount,
        uint256 stablecoinAmount,
        uint256 updatedRoyaltyTokenReserve,
        uint256 updatedStablecoinReserve
    );

    /**
     * @dev Emmited by {sell} when a trader sells `royaltyTokenAmount` for `stablecoinAmount`.
     */
    event RoyaltyTokenSold(
        address indexed trader,
        uint256 royaltyTokenAmount,
        uint256 stablecoinAmount,
        uint256 updatedRoyaltyTokenReserve,
        uint256 updatedStablecoinReserve
    );

    /**
     * @dev Provides `initialRoyaltyTokenReserve` and `initialStablecoinReserve`.
     * as initial liquidity to the pool.
     */
    function provideInitialLiquidity(
        uint256 initialRoyaltyTokenReserve,
        uint256 initialStablecoinReserve
    ) external;

    /**
     * @dev Function used to buy `royaltyTokenAmount` for the `desiredStablecoinAmount`.
     *
     * @param priceSlippage price slippage represented in 1/10 of % or 10^-3
     */
    function buy(
        uint256 royaltyTokenAmount,
        uint256 desiredStablecoinAmount,
        uint16 priceSlippage
    ) external;

    /**
     * @dev Function used to sell `royaltyTokenAmount` for the `desiredStablecoinAmount`.
     *
     * @param priceSlippage price slippage represented in 1/10 of % or 10^-3
     */
    function sell(
        uint256 royaltyTokenAmount,
        uint256 desiredStablecoinAmount,
        uint16 priceSlippage
    ) external;

    /**
     * @dev Used to withdraw the trading fee revenue.
     */
    function collectTradingFeeRevenue(uint256 amount, address to) external;

    /**
     * @dev Used to calculate desired stablecoin amount either for buying or selling.
     */
    function calculateStablecoinAmount(
        bool buyOrSell,
        uint256 royaltyTokenAmount
    ) external returns (uint256 stablecoinAmount);
}
