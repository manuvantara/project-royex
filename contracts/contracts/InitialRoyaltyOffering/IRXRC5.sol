// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the RXRC5 i.e. Royex request for comment 5 or Initial Royalty Offering.
 */
interface IRXRC5 {
    /**
     * @dev Amount is 0.
     */
    error InvalidAmount();

    /**
     * @dev Royalty tokens already were deposited before.
     */
    error RoyaltyTokensAlreadyDeposited();

    /**
     * @dev Cannot buy royalty tokens before offering date.
     */
    error OfferingNotAvailable(uint48 now, uint48 offeringDate);

    /**
     * @dev Cannot buy more royalty tokens than present for IRO.
     */
    error ReserveExceeded(uint256 requestedAmount, uint256 availableAmount);

    /**
     * @dev Emmited when royalty tokens are deposited.
     */
    event RoyaltyTokensDeposited(uint128 amount);

    /**
     * @dev Emmited when some investor buys the amount of royalty tokens.
     */
    event RoyaltyTokensBought(address indexed account, uint128 amount);
}
