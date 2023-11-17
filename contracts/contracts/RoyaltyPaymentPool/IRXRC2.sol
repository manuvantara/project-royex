// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface of the RXRC2 i.e. Royex request for comment 2 or Royalty Pool.
 */
interface IRXRC2 {
    /**
     * @dev Royalty rate must be greater than zero to withdraw royalties.
     */
    error InsufficientRoyaltyRate();

    /**
     * @dev Amount to withdraw must be less than or equal to the amount available to
     * withdraw at the checkpoint.
     */
    error ExcessiveWithdrawalAmount(
        uint256 amountRequested,
        uint256 amountAvailable
    );

    /**
     * @dev Zero was provided as a withdrawal amount or deposit amount.
     */
    error InvalidAmount();

    /**
     * @dev Emitted by {depositRoyalties} when royalties are deposited
     * from the distributor.
     */
    event RoyaltiesDeposited(
        address indexed from,
        uint256 indexed deposit,
        uint48 indexed checkpointKey
    );

    /**
     * @dev Emitted by {withdrawRoyalties} when royalties are claimed.
     */
    event RoyaltiesWithdrawn(
        uint48 indexed checkpointKey,
        address indexed investor,
        uint256 amount
    );

    /**
     * @dev Used to tranfer royalty payments approved by distributor into the pool.
     *
     * WARNING: In the current implementation everyone is eligible to initiate it.
     * Be very mindful that someone in theory could approve a large amount of stable coin
     * and loop `depositRoyalties` function which will cause an overflow of the
     * `checkpoint` uint48 value for the RXRC1 contract.
     * However, considering that stablecoin represent real fiat value it will be
     * very costly to the attacker and the consequences is just forever freezed
     * `depositRoyalties` function.
     * If you want to achieve a different behavior feel free to override it.
     *
     * NOTE: deposit shall not exceed uint208 max value i.e `2**208 - 1`
     * and will revert otherwise. That's due to the nature of
     * the OpenZeppelin Checkpoints util and the developed
     * ERC20Checkpoint extension respectively.
     */
    function depositRoyalties(address from, uint256 deposit) external;

    /**
     * @dev Investors can withdraw their royalties at the checkpoint
     * in respect to their royalty rate.
     */
    function withdrawRoyalties(uint48 checkpointKey, uint256 amount) external;

    /**
     * @dev Investors can get the royalty payment details at the checkpoint.
     * In particular the total amount of the royalties deposited from the distributor,
     * their royalty balance and total supply at a time checkpoint was taken,
     * and the amount withdrawn.
     */
    function getRoyaltyPaymentDetails(
        uint48 checkpointKey,
        address account
    )
        external
        returns (
            uint256 royaltyDeposit,
            uint256 royaltyBalance,
            uint256 royaltyTotalSupply,
            uint256 amountWithdrawn
        );
}
