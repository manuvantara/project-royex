// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {Checkpoints} from "./Checkpoints.sol";

abstract contract ERC20Checkpoint is ERC20 {
    using Checkpoints for Checkpoints.Trace208;

    /**
     * @dev Emitted by {_checkpoint} when a checkpoint identified by `key` is created.
     */
    event Checkpoint(uint48 key);

    /**
     * @dev Zero was provided as a checkpoint key.
     */
    error InvalidCheckpoint();

    /**
     * @dev The requested checkpoint was not created yet.
     */
    error NonexistentCheckpoint(
        uint48 checkpointKey,
        uint48 currentCheckpointKey
    );

    mapping(address account => Checkpoints.Trace208)
        private _accountBalanceCheckpoints;
    Checkpoints.Trace208 private _totalSupplyCheckpoints;

    // Checkpoint keys increase monotonically, with the first being 1. An id of 0 is invalid.
    uint48 private _checkpointKey;

    function getCurrentCheckpointKey() public view virtual returns (uint48) {
        return _checkpointKey;
    }

    /**
     * @dev Creates a new checkpoint and returns its checkpoint key.
     *
     * Emits a {Checkpoint} event that contains the key.
     *
     * {_checkpoint} is `internal` and you have to decide how to expose it externally. Its usage may be restricted to a
     * set of accounts, for example using {AccessControl}, or it may be open to the public.
     */
    function _checkpoint() internal virtual returns (uint48 newCheckpointKey) {
        newCheckpointKey = ++_checkpointKey;
        emit Checkpoint(newCheckpointKey);
    }

    /**
     * @dev Retrieves the total supply at the time `checkpointKey` was created.
     */
    function totalSupplyAt(
        uint48 checkpointKey
    ) public view virtual returns (uint256) {
        (bool checkpointed, uint256 value) = _valueAt(
            checkpointKey,
            _totalSupplyCheckpoints
        );

        return checkpointed ? value : totalSupply();
    }

    /**
     * @dev Retrieves the balance of `account` at the time `checkpointKey` was created.
     */
    function balanceOfAt(
        address account,
        uint48 checkpointKey
    ) public view virtual returns (uint256) {
        (bool checkpointed, uint256 value) = _valueAt(
            checkpointKey,
            _accountBalanceCheckpoints[account]
        );

        return checkpointed ? value : balanceOf(account);
    }

    function _valueAt(
        uint48 checkpointKey,
        Checkpoints.Trace208 storage checkpoints
    ) private view returns (bool checkpointed, uint256 value) {
        if (checkpointKey == 0) revert InvalidCheckpoint();
        uint48 currentCheckpointKey = getCurrentCheckpointKey();
        if (checkpointKey > currentCheckpointKey)
            revert NonexistentCheckpoint(checkpointKey, currentCheckpointKey);
        // When a valid snapshot is queried, there are three possibilities:
        //  a) The queried value was not modified after the snapshot was taken. Therefore, a snapshot entry was never
        //  created for this id, and all stored snapshot ids are smaller than the requested one. The value that corresponds
        //  to this id is the current one.
        //  b) The queried value was modified after the snapshot was taken. Therefore, there will be an entry with the
        //  requested id, and its value is the one to return.
        //  c) More snapshots were created after the requested one, and the queried value was later modified. There will be
        //  no entry for the requested id: the value that corresponds to it is that of the smallest snapshot id that is
        //  larger than the requested one.
        //
        // In summary, we need to find an element in an array, returning the index of the smallest value that is larger if
        // it is not found, unless said value doesn't exist (e.g. when all values are smaller). Checkpoints.lowerLookup does
        // exactly this.

        return checkpoints.lowerLookup(checkpointKey);
    }

    // Update balance and/or total supply chekpoints before the values are modified. This is implemented
    // in the _update function, which is executed for _mint, _burn, and _transfer operations.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (value > type(uint208).max) {
            revert SafeCast.SafeCastOverflowedUintDowncast(208, value);
        }

        if (from == address(0)) {
            // mint
            _updateAccountCheckpoint(to);
            _updateTotalSupplyCheckpoint();
        } else if (to == address(0)) {
            // burn
            _updateAccountCheckpoint(from);
            _updateTotalSupplyCheckpoint();
        } else {
            // transfer
            _updateAccountCheckpoint(from);
            _updateAccountCheckpoint(to);
        }

        // super._update(from, to, value);
        /**
         * @dev Commented for compatibility with ERC20Votes
         * You will need to override _update in your contract to
         * ERC20Checkpoint._update(from, to, value);
         * ERC20._update(from, to, value);
         * if used alone.
         */
    }

    function _updateAccountCheckpoint(address account) private {
        _updateCheckpoint(
            _accountBalanceCheckpoints[account],
            balanceOf(account)
        );
    }

    function _updateTotalSupplyCheckpoint() private {
        _updateCheckpoint(_totalSupplyCheckpoints, totalSupply());
    }

    function _updateCheckpoint(
        Checkpoints.Trace208 storage checkpoints,
        uint256 currentValue
    ) private {
        uint48 currentCheckpointKey = getCurrentCheckpointKey();

        (, uint48 lastCheckpointKey, ) = checkpoints.latestCheckpoint();
        if (lastCheckpointKey < currentCheckpointKey)
            checkpoints.push(
                currentCheckpointKey,
                SafeCast.toUint208(currentValue)
            );
    }
}
