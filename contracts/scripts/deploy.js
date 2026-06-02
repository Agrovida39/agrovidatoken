const { ethers, run, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  // ── Deploy AGROVIDA Token ─────────────────────────────────────────────────
  console.log("\n[1/3] Deploying AGROVIDA token...");
  const AGROVIDA = await ethers.getContractFactory("AGROVIDA");
  const agrovida = await AGROVIDA.deploy(deployer.address);
  await agrovida.waitForDeployment();
  const agroAddress = await agrovida.getAddress();
  console.log("AGROVIDA deployed to:", agroAddress);

  // ── Deploy Staking Contract ───────────────────────────────────────────────
  console.log("\n[2/3] Deploying Staking contract...");
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(agroAddress, deployer.address);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("Staking deployed to:", stakingAddress);

  // ── Post-deploy configuration ─────────────────────────────────────────────
  console.log("\n[3/3] Configuring contracts...");

  // Mark staking contract as burn-exempt so internal transfers don't trigger deflation.
  const exemptTx = await agrovida.setBurnExempt(stakingAddress, true);
  await exemptTx.wait();
  console.log("Staking contract set as burn-exempt in AGROVIDA token.");

  // Fund reward reserve: transfer 5% of total supply (50M AGRO) to staking contract.
  const rewardAllocation = ethers.parseEther("50000000"); // 50M AGRO
  const approveTx = await agrovida.approve(stakingAddress, rewardAllocation);
  await approveTx.wait();
  const depositTx = await staking.depositRewardReserve(rewardAllocation);
  await depositTx.wait();
  console.log("Reward reserve funded with 50,000,000 AGRO.");

  // ── Save deployment info ──────────────────────────────────────────────────
  const deploymentInfo = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AGROVIDA: agroAddress,
      Staking: stakingAddress,
    },
  };

  const outDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", outFile);

  // ── Verify on Polygonscan (skip for local network) ────────────────────────
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nWaiting 30s for Polygonscan to index contracts...");
    await new Promise((r) => setTimeout(r, 30_000));

    try {
      console.log("Verifying AGROVIDA...");
      await run("verify:verify", {
        address: agroAddress,
        constructorArguments: [deployer.address],
      });
    } catch (e) {
      console.warn("AGROVIDA verification failed (may already be verified):", e.message);
    }

    try {
      console.log("Verifying Staking...");
      await run("verify:verify", {
        address: stakingAddress,
        constructorArguments: [agroAddress, deployer.address],
      });
    } catch (e) {
      console.warn("Staking verification failed (may already be verified):", e.message);
    }
  }

  console.log("\n✅ Deployment complete!");
  console.log("  AGROVIDA :", agroAddress);
  console.log("  Staking  :", stakingAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
