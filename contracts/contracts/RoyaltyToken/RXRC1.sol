// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20Permit, Nonces} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";

import {ERC20Checkpoint} from "./ERC20Checkpoint.sol";

abstract contract RXRC1 is ERC20, ERC20Permit, ERC20Votes, ERC20Checkpoint, AccessControl {
    bytes32 public constant RXRC2_ROLE = keccak256("RXRC2_ROLE");

    constructor(
        address defaultAdmin,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) ERC20Permit(name) {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    /**
     * @dev WARNING: make sure to grant `RXRC2_ROLE`
     * to the `RXRC2` contract when it is deployed.
     */

    function mint(address to, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(to, amount);
    }

    function checkpoint() external onlyRole(RXRC2_ROLE) returns (uint48 newCheckpointKey) {
        return _checkpoint();
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20, ERC20Votes, ERC20Checkpoint) {
        if (value > type(uint128).max) {
            revert SafeCast.SafeCastOverflowedUintDowncast(128, value);
        }
        ERC20Checkpoint._update(from, to, value);
        ERC20Votes._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
