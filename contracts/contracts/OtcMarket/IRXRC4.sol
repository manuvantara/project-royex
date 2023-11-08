// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the RXRC4 i.e. Royex request for comment 4 or OTC market.
 */
interface IRXRC4 {
    /**
     * @dev Offer structure.
     */
    struct Offer {
        address seller;
        uint128 royaltyTokenAmount;
        uint128 stablecoinAmount;
    }

    /**
     * @dev Zero was provided as an amount.
     */
    error InvalidAmount();

    /**
     * @dev The minimum stablecoin amount to create an offer is 1 * 10^18 or 1$.
     */
    error InsufficientStablecoinAmount(uint256 stablecoinAmount, uint256 minStablecoinAmount);

    /**
     * @dev Cannot recreate the same offer.
     */
    error OfferAlreadyExists(uint256 offerId);

    /**
     * @dev The offer of the `offerId` is not active.
     */
    error OfferNotFound(uint256 offerId);

    /**
     * @dev Only the offer seller can cancel the offer.
     */
    error UnauthorizedOfferCancellation(address operator, address seller);

    /**
     * @dev Cannot withdrawn more than the available fee revenue.
     */
    error InsufficientTradingFeeRevenue(uint256 requestedAmount, uint256 availableAmount);

    /**
     * @dev Emmited when an offer is created.
     */
    event OfferCreated(
        uint256 indexed offerId,
        address indexed seller,
        uint128 royaltyTokenAmount,
        uint128 stablecoinAmount
    );

    /**
     * @dev Emmited when the offer is accepted.
     */
    event OfferAccepted(uint256 indexed offerId, address indexed buyer);

    /**
     * @dev Emmited when the offer is canceled.
     */
    event OfferCancelled(uint256 indexed offerId);

    /**
     * @dev Hashing function used to (re)build the offer id from its details.
     */
    function hashOffer(
        address seller,
        uint128 royaltyTokenAmount,
        uint128 stablecoinAmount
    ) external returns (uint256 offerId);

    /**
     * @dev Function to create a new offer.
     *
     * NOTE: seller must approve the `royaltyTokenAmount` needed for trade.
     */
    function createOffer(
        uint128 royaltyTokenAmount,
        uint128 stablecoinAmount
    ) external returns (uint256 offerId);

    /**
     * @dev Function to cancel the offer.
     *
     * NOTE: caller must be the offer seller.
     */
    function cancelOffer(uint256 offerId) external;

    /**
     * @dev Function to accept the offer.
     *
     * NOTE: buyer must approve the `stablecoinAmount` needed for trade.
     */
    function acceptOffer(uint256 offerId) external;

    /**
     * @dev Used to withdraw the trading fee revenue.
     *
     * NOTE: amount must not exceed the available trading fee revenue.
     */
    function collectTradingFeeRevenue(uint256 amount, address to) external;
}
