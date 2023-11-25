// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Checkpoints} from "../RoyaltyToken/Checkpoints.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";

import {IRXRC2} from "./IRXRC2.sol";
import {RXRC1} from "../RoyaltyToken/RXRC1.sol";

abstract contract RXRC2 is IRXRC2, Ownable {
    using Checkpoints for Checkpoints.Trace208;

    /**
     * @dev See IRXRC2
     */
    IERC20 public immutable stablecoin;
    RXRC1 public immutable royaltyToken;

    /**
     * @dev Sets the royalty token and the stablecoin used for royalty payments
     */
    constructor(
        address _initialOwner,
        RXRC1 _royaltyToken,
        IERC20 _stablecoin
    ) Ownable(_initialOwner) {
        royaltyToken = _royaltyToken;
        stablecoin = _stablecoin;
    }

    Checkpoints.Trace208 private _royaltyDepositCheckpoints;
    mapping(uint48 checkpointKey => mapping(address account => uint256 amountWithdrawn))
        private _royaltyPayments;

    /**
     * @dev See IRXRC2
     */
    function depositRoyalties(
        address from,
        uint256 deposit
    ) external virtual override {
        if (deposit > type(uint128).max) {
            revert SafeCast.SafeCastOverflowedUintDowncast(128, deposit);
        }
        if (deposit == 0) revert InvalidAmount();

        uint48 newCheckpointKey = royaltyToken.checkpoint();
        emit RoyaltiesDeposited(from, deposit, newCheckpointKey);

        stablecoin.transferFrom(from, address(this), deposit);
        _royaltyDepositCheckpoints.push(
            newCheckpointKey,
            SafeCast.toUint208(deposit)
        );
    }

    /**
     * @dev See IRXRC2
     */
    function withdrawRoyalties(
        uint48 checkpointKey,
        uint256 amount
    ) external virtual override {
        if (amount == 0) revert InvalidAmount();

        address to = msg.sender;

        (
            uint256 royaltyDeposit,
            uint256 royaltyBalance,
            uint256 royaltyTotalSupply,
            uint256 amountWithdrawn
        ) = getRoyaltyPaymentDetails(checkpointKey, to);
        if (royaltyBalance == 0) revert InsufficientRoyaltyRate();

        uint256 dividend = (royaltyBalance * royaltyDeposit) /
            royaltyTotalSupply;

        uint256 amountAvailable = dividend - amountWithdrawn;
        if (amount > amountAvailable)
            revert ExcessiveWithdrawalAmount(amount, amountAvailable);

        _royaltyPayments[checkpointKey][to] += amount;
        emit RoyaltiesWithdrawn(checkpointKey, to, amount);

        stablecoin.transfer(to, amount);
    }

    /**
     * @dev See IRXRC2
     */
    function getRoyaltyPaymentDetails(
        uint48 checkpointKey,
        address account
    )
        public
        view
        virtual
        override
        returns (
            uint256 royaltyDeposit,
            uint256 royaltyBalance,
            uint256 royaltyTotalSupply,
            uint256 amountWithdrawn
        )
    {
        royaltyDeposit = _royaltyDepositCheckpoints.upperLookup(checkpointKey); // will always give the exact value
        royaltyBalance = royaltyToken.balanceOfAt(account, checkpointKey);
        royaltyTotalSupply = royaltyToken.totalSupplyAt(checkpointKey);
        amountWithdrawn = _royaltyPayments[checkpointKey][account];
    }
}
