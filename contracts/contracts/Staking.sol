// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AGROVIDA Staking
 * @notice Allows AGRO holders to stake tokens and earn 10 % APY.
 *         Rewards are funded by the owner depositing AGRO into this contract.
 *         No external oracle dependency — reward math uses block timestamps.
 *
 * Security measures:
 *  • ReentrancyGuard on all state-mutating external functions.
 *  • SafeERC20 to handle any non-standard ERC-20 return values.
 *  • Pausable — owner can halt stakes/unstakes in an emergency.
 *  • Rewards are capped by the contract's reward reserve; users can always
 *    withdraw their principal even if the reserve is depleted.
 *  • No flash-loan attack surface: rewards are time-weighted from deposit ts.
 */
contract Staking is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ─── Constants ────────────────────────────────────────────────────────────
    IERC20 public immutable token;

    /// @notice Annual percentage yield in basis points (1000 = 10 %).
    uint256 public constant APY_BPS   = 1_000;
    uint256 private constant BPS_BASE = 10_000;
    uint256 private constant YEAR     = 365 days;

    // ─── State ────────────────────────────────────────────────────────────────
    struct StakeInfo {
        uint256 principal;   // AGRO staked
        uint256 stakedAt;    // timestamp of last stake / reward checkpoint
        uint256 pendingReward; // accumulated but unclaimed rewards
    }

    mapping(address => StakeInfo) public stakes;

    uint256 public totalStaked;
    uint256 public rewardReserve; // AGRO deposited by owner to pay rewards

    // ─── Events ───────────────────────────────────────────────────────────────
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardReserveDeposited(uint256 amount);
    event RewardReserveWithdrawn(uint256 amount);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _token, address initialOwner)
        Ownable(initialOwner)
    {
        require(_token != address(0), "Staking: zero token address");
        token = IERC20(_token);
    }

    // ─── Owner functions ──────────────────────────────────────────────────────

    /// @notice Deposit AGRO into the reward reserve.
    function depositRewardReserve(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Staking: zero amount");
        rewardReserve += amount;
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardReserveDeposited(amount);
    }

    /// @notice Withdraw excess reward reserve (cannot touch staked principal).
    function withdrawRewardReserve(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Staking: zero amount");
        require(amount <= rewardReserve, "Staking: exceeds reserve");
        rewardReserve -= amount;
        token.safeTransfer(msg.sender, amount);
        emit RewardReserveWithdrawn(amount);
    }

    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ─── User functions ───────────────────────────────────────────────────────

    /**
     * @notice Stake `amount` AGRO tokens.
     *         If the caller already has an active stake, pending rewards are
     *         checkpointed before updating the principal.
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Staking: zero amount");

        StakeInfo storage info = stakes[msg.sender];

        // Checkpoint any accrued rewards before updating principal.
        if (info.principal > 0) {
            info.pendingReward += _pendingRewards(info);
        }

        info.principal   += amount;
        info.stakedAt     = block.timestamp;
        totalStaked       += amount;

        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Unstake all tokens and claim all pending rewards.
     *         If the reward reserve is insufficient, only available rewards
     *         are paid; principal is always returned in full.
     */
    function unstake() external nonReentrant whenNotPaused {
        StakeInfo storage info = stakes[msg.sender];
        require(info.principal > 0, "Staking: nothing staked");

        uint256 principal = info.principal;
        uint256 reward    = info.pendingReward + _pendingRewards(info);

        // Cap reward to available reserve.
        uint256 payableReward = reward <= rewardReserve ? reward : rewardReserve;

        // Clear state before transfers (CEI pattern).
        totalStaked      -= principal;
        rewardReserve    -= payableReward;
        delete stakes[msg.sender];

        token.safeTransfer(msg.sender, principal + payableReward);
        emit Unstaked(msg.sender, principal, payableReward);
    }

    /**
     * @notice Claim only the accrued rewards without touching the stake.
     */
    function claimRewards() external nonReentrant whenNotPaused {
        StakeInfo storage info = stakes[msg.sender];
        require(info.principal > 0, "Staking: nothing staked");

        uint256 reward = info.pendingReward + _pendingRewards(info);
        require(reward > 0, "Staking: no rewards");

        uint256 payableReward = reward <= rewardReserve ? reward : rewardReserve;

        // Reset checkpoint.
        info.pendingReward = 0;
        info.stakedAt      = block.timestamp;
        rewardReserve     -= payableReward;

        token.safeTransfer(msg.sender, payableReward);
        emit RewardClaimed(msg.sender, payableReward);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /// @notice Returns the total unclaimed rewards for `user` at this moment.
    function pendingRewards(address user) external view returns (uint256) {
        StakeInfo storage info = stakes[user];
        return info.pendingReward + _pendingRewards(info);
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    /**
     * @dev Calculates rewards accrued since the last checkpoint.
     *      reward = principal * APY_BPS / BPS_BASE * elapsed / YEAR
     */
    function _pendingRewards(StakeInfo storage info) private view returns (uint256) {
        if (info.principal == 0 || info.stakedAt == 0) return 0;
        uint256 elapsed = block.timestamp - info.stakedAt;
        return (info.principal * APY_BPS * elapsed) / (BPS_BASE * YEAR);
    }
}
