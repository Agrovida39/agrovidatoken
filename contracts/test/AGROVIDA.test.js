const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("AGROVIDA Token", function () {
  let agrovida, owner, alice, bob;
  const TOTAL_SUPPLY = ethers.parseEther("1000000000"); // 1B

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const AGROVIDA = await ethers.getContractFactory("AGROVIDA");
    agrovida = await AGROVIDA.deploy(owner.address);
  });

  // ── Basic ERC-20 ─────────────────────────────────────────────────────────
  describe("Deployment", function () {
    it("should mint total supply to owner", async function () {
      expect(await agrovida.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });

    it("should set correct name and symbol", async function () {
      expect(await agrovida.name()).to.equal("AGROVIDA");
      expect(await agrovida.symbol()).to.equal("AGRO");
    });

    it("should set owner as burn-exempt", async function () {
      expect(await agrovida.burnExempt(owner.address)).to.equal(true);
    });
  });

  // ── Deflation burn ────────────────────────────────────────────────────────
  describe("2% deflation burn", function () {
    const AMOUNT = ethers.parseEther("1000");

    beforeEach(async function () {
      // Fund alice with tokens from the (exempt) owner — alice gets no burn.
      await agrovida.transfer(alice.address, AMOUNT);
    });

    it("should burn 2% and transfer 98% between non-exempt addresses", async function () {
      const burnBefore = await agrovida.totalBurned();
      const bobBefore  = await agrovida.balanceOf(bob.address);
      const aliceBefore = await agrovida.balanceOf(alice.address);

      await agrovida.connect(alice).transfer(bob.address, AMOUNT);

      const expectedBurn    = (AMOUNT * 200n) / 10_000n;
      const expectedReceive = AMOUNT - expectedBurn;

      expect(await agrovida.balanceOf(bob.address)).to.equal(bobBefore + expectedReceive);
      expect(await agrovida.balanceOf(alice.address)).to.equal(aliceBefore - AMOUNT);
      expect(await agrovida.totalBurned()).to.equal(burnBefore + expectedBurn);
    });

    it("should NOT burn when sender is exempt", async function () {
      const burnBefore = await agrovida.totalBurned();
      await agrovida.transfer(bob.address, AMOUNT); // owner is exempt
      expect(await agrovida.balanceOf(bob.address)).to.equal(AMOUNT);
      expect(await agrovida.totalBurned()).to.equal(burnBefore);
    });

    it("should NOT burn when recipient is exempt", async function () {
      await agrovida.setBurnExempt(bob.address, true);
      const burnBefore = await agrovida.totalBurned();
      await agrovida.connect(alice).transfer(bob.address, AMOUNT);
      expect(await agrovida.balanceOf(bob.address)).to.equal(AMOUNT);
      expect(await agrovida.totalBurned()).to.equal(burnBefore);
    });

    it("should NOT apply burn on mint", async function () {
      // constructor minted full supply without burn
      expect(await agrovida.totalBurned()).to.equal(0n);
    });
  });

  // ── Admin controls ────────────────────────────────────────────────────────
  describe("Admin", function () {
    it("should allow owner to set burn exemption", async function () {
      await agrovida.setBurnExempt(alice.address, true);
      expect(await agrovida.burnExempt(alice.address)).to.equal(true);
    });

    it("should reject setBurnExempt from non-owner", async function () {
      await expect(
        agrovida.connect(alice).setBurnExempt(bob.address, true)
      ).to.be.revertedWithCustomError(agrovida, "OwnableUnauthorizedAccount");
    });

    it("should pause and unpause transfers", async function () {
      await agrovida.pause();
      await expect(
        agrovida.transfer(alice.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(agrovida, "EnforcedPause");

      await agrovida.unpause();
      await agrovida.transfer(alice.address, ethers.parseEther("100"));
      expect(await agrovida.balanceOf(alice.address)).to.equal(ethers.parseEther("100"));
    });

    it("should reject pause from non-owner", async function () {
      await expect(agrovida.connect(alice).pause()).to.be.revertedWithCustomError(
        agrovida,
        "OwnableUnauthorizedAccount"
      );
    });

    it("should reject zero address for setBurnExempt", async function () {
      await expect(
        agrovida.setBurnExempt(ethers.ZeroAddress, true)
      ).to.be.revertedWith("AGRO: zero address");
    });
  });
});

describe("Staking", function () {
  let agrovida, staking, owner, alice, bob;
  const STAKE_AMOUNT    = ethers.parseEther("10000");
  const RESERVE_AMOUNT  = ethers.parseEther("1000000"); // 1M AGRO
  const APY_BPS         = 1_000n;
  const BPS_BASE        = 10_000n;
  const YEAR            = 365n * 24n * 3600n;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    // Deploy token
    const AGROVIDA = await ethers.getContractFactory("AGROVIDA");
    agrovida = await AGROVIDA.deploy(owner.address);

    // Deploy staking
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(await agrovida.getAddress(), owner.address);

    // Make staking contract burn-exempt
    await agrovida.setBurnExempt(await staking.getAddress(), true);

    // Fund reward reserve
    await agrovida.approve(await staking.getAddress(), RESERVE_AMOUNT);
    await staking.depositRewardReserve(RESERVE_AMOUNT);

    // Fund alice and bob (exempt owner transfers, no burn)
    await agrovida.transfer(alice.address, STAKE_AMOUNT * 10n);
    await agrovida.transfer(bob.address,   STAKE_AMOUNT * 10n);
  });

  // ── Staking ───────────────────────────────────────────────────────────────
  describe("stake()", function () {
    it("should stake tokens and update totalStaked", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);

      const info = await staking.stakes(alice.address);
      expect(info.principal).to.equal(STAKE_AMOUNT);
      expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT);
    });

    it("should reject zero-amount stake", async function () {
      await expect(staking.connect(alice).stake(0)).to.be.revertedWith("Staking: zero amount");
    });

    it("should checkpoint rewards on top-up stake", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT * 2n);
      await staking.connect(alice).stake(STAKE_AMOUNT);

      await time.increase(Number(YEAR) / 2); // 6 months

      await staking.connect(alice).stake(STAKE_AMOUNT); // top-up

      const info = await staking.stakes(alice.address);
      expect(info.pendingReward).to.be.gt(0n); // accrued before top-up
    });
  });

  // ── Unstaking ─────────────────────────────────────────────────────────────
  describe("unstake()", function () {
    it("should return principal + rewards after 1 year", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);

      await time.increase(Number(YEAR)); // 1 year

      const balBefore = await agrovida.balanceOf(alice.address);
      await staking.connect(alice).unstake();
      const balAfter = await agrovida.balanceOf(alice.address);

      const received  = balAfter - balBefore;
      const expectedReward = (STAKE_AMOUNT * APY_BPS) / BPS_BASE;

      // Allow ±0.01% tolerance for timestamp rounding
      expect(received).to.be.closeTo(STAKE_AMOUNT + expectedReward, ethers.parseEther("0.1"));
    });

    it("should clear stake info after unstake", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);
      await staking.connect(alice).unstake();

      const info = await staking.stakes(alice.address);
      expect(info.principal).to.equal(0n);
    });

    it("should revert if nothing staked", async function () {
      await expect(staking.connect(alice).unstake()).to.be.revertedWith(
        "Staking: nothing staked"
      );
    });

    it("should cap reward payout to reserve if reserve is low", async function () {
      // Drain most of the reserve
      await staking.connect(owner).withdrawRewardReserve(RESERVE_AMOUNT - ethers.parseEther("1"));

      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);
      await time.increase(Number(YEAR) * 10); // long time, large reward accrues

      // Should not revert — just pays what's available
      await expect(staking.connect(alice).unstake()).not.to.be.reverted;
    });
  });

  // ── Claim rewards ─────────────────────────────────────────────────────────
  describe("claimRewards()", function () {
    it("should claim rewards without touching principal", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);

      await time.increase(Number(YEAR));

      const balBefore = await agrovida.balanceOf(alice.address);
      await staking.connect(alice).claimRewards();
      const balAfter = await agrovida.balanceOf(alice.address);

      expect(balAfter).to.be.gt(balBefore); // received rewards

      // Principal still staked
      const info = await staking.stakes(alice.address);
      expect(info.principal).to.equal(STAKE_AMOUNT);
    });

    it("should reset pending reward after claim", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);
      await time.increase(Number(YEAR));
      await staking.connect(alice).claimRewards();

      const info = await staking.stakes(alice.address);
      expect(info.pendingReward).to.equal(0n);
    });

    it("should revert if no rewards yet", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);
      // Same block — no time elapsed, no reward
      await expect(staking.connect(alice).claimRewards()).to.be.revertedWith(
        "Staking: no rewards"
      );
    });
  });

  // ── Reward reserve ────────────────────────────────────────────────────────
  describe("Reward reserve", function () {
    it("should allow owner to deposit and withdraw reserve", async function () {
      const extra = ethers.parseEther("500");
      await agrovida.approve(await staking.getAddress(), extra);
      await staking.depositRewardReserve(extra);

      const before = await staking.rewardReserve();
      await staking.withdrawRewardReserve(extra);
      expect(await staking.rewardReserve()).to.equal(before - extra);
    });

    it("should reject withdraw exceeding reserve", async function () {
      await expect(
        staking.withdrawRewardReserve(RESERVE_AMOUNT * 2n)
      ).to.be.revertedWith("Staking: exceeds reserve");
    });

    it("should reject non-owner deposit", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), ethers.parseEther("100"));
      await expect(
        staking.connect(alice).depositRewardReserve(ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount");
    });
  });

  // ── Pause ─────────────────────────────────────────────────────────────────
  describe("Pause", function () {
    it("should block stake when paused", async function () {
      await staking.pause();
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await expect(staking.connect(alice).stake(STAKE_AMOUNT)).to.be.revertedWithCustomError(
        staking,
        "EnforcedPause"
      );
    });

    it("should allow unstake after unpause", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);
      await staking.pause();
      await staking.unpause();
      await expect(staking.connect(alice).unstake()).not.to.be.reverted;
    });
  });

  // ── pendingRewards view ───────────────────────────────────────────────────
  describe("pendingRewards()", function () {
    it("should return zero for non-stakers", async function () {
      expect(await staking.pendingRewards(alice.address)).to.equal(0n);
    });

    it("should increase linearly over time", async function () {
      await agrovida.connect(alice).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(alice).stake(STAKE_AMOUNT);

      await time.increase(Number(YEAR) / 2);
      const half = await staking.pendingRewards(alice.address);

      await time.increase(Number(YEAR) / 2);
      const full = await staking.pendingRewards(alice.address);

      // full should be ~2× half
      expect(full).to.be.closeTo(half * 2n, ethers.parseEther("0.01"));
    });
  });
});
