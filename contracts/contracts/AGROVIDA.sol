// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AGROVIDA Token (AGRO)
 * @notice ERC-20 utility token for the AGROVIDA health & wellness super-ecosystem.
 *         Total supply: 1,000,000,000 AGRO (1B).
 *         Deflationary: 2% of every transfer is permanently burned.
 *         Exempt addresses (owner, staking contract) skip the burn to avoid
 *         circular deflation on internal protocol flows.
 */
contract AGROVIDA is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    // ─── Constants ────────────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion AGRO
    uint16  public constant BURN_BPS   = 200;                       // 2 % in basis points
    uint16  private constant BPS_BASE  = 10_000;

    // ─── State ────────────────────────────────────────────────────────────────
    /// @notice Addresses that are not subject to the deflation burn (e.g. staking contract).
    mapping(address => bool) public burnExempt;

    uint256 public totalBurned;

    // ─── Events ───────────────────────────────────────────────────────────────
    event BurnExemptSet(address indexed account, bool exempt);
    event DeflationBurn(address indexed from, uint256 burnAmount);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address initialOwner)
        ERC20("AGROVIDA", "AGRO")
        Ownable(initialOwner)
    {
        // Owner is always exempt so protocol ops don't trigger extra burns.
        burnExempt[initialOwner] = true;

        _mint(initialOwner, MAX_SUPPLY);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /// @notice Mark or unmark an address as exempt from the 2 % deflation burn.
    function setBurnExempt(address account, bool exempt) external onlyOwner {
        require(account != address(0), "AGRO: zero address");
        burnExempt[account] = exempt;
        emit BurnExemptSet(account, exempt);
    }

    /// @notice Pause all token transfers. Only callable by owner.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause token transfers.
    function unpause() external onlyOwner {
        _unpause();
    }

    // ─── Internals ────────────────────────────────────────────────────────────

    /**
     * @dev Hook executed before every transfer.
     *      If neither sender nor recipient is burn-exempt, 2 % of `value` is
     *      burned (permanently destroyed) and only `value - burnAmt` is moved.
     *
     *      Mint (from == address(0)) and burn (to == address(0)) are never
     *      subject to deflation to prevent double-accounting.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        // Exclude mints, burns, and exempt addresses from deflation logic.
        if (
            from != address(0) &&
            to   != address(0) &&
            !burnExempt[from]  &&
            !burnExempt[to]    &&
            value > 0
        ) {
            uint256 burnAmt = (value * BURN_BPS) / BPS_BASE;

            if (burnAmt > 0) {
                // Deduct burn from sender's balance first.
                super._update(from, address(0), burnAmt);
                totalBurned += burnAmt;
                emit DeflationBurn(from, burnAmt);

                // Transfer the net amount.
                value -= burnAmt;
            }
        }

        super._update(from, to, value);
    }
}
