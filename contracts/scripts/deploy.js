const { ethers, run, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

// ── Configuración de la presale ───────────────────────────────────────────────
const USDT_POLYGON  = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT oficial en Polygon
const RATE_MATIC    = 1000;   // 1 MATIC  = 1 000 AGROVIDA
const RATE_USDT     = 10;     // 1 USDT   = 10   AGROVIDA ($0.10/token)
const PRESALE_ALLOC = ethers.parseEther("100000000"); // 100M AGROVIDA para presale
const STAKING_ALLOC = ethers.parseEther("50000000");  // 50M  AGROVIDA para staking rewards

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC\n");

  // ── 1. AGROVIDA Token ─────────────────────────────────────────────────────
  console.log("[1/4] Deploying AGROVIDA token...");
  const AGROVIDA = await ethers.getContractFactory("AGROVIDA");
  const agrovida = await AGROVIDA.deploy(deployer.address);
  await agrovida.waitForDeployment();
  const agroAddress = await agrovida.getAddress();
  console.log("  AGROVIDA →", agroAddress);

  // ── 2. Staking ────────────────────────────────────────────────────────────
  console.log("[2/4] Deploying Staking contract...");
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(agroAddress, deployer.address);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("  Staking  →", stakingAddress);

  // ── 3. Presale ────────────────────────────────────────────────────────────
  console.log("[3/4] Deploying Presale contract...");
  const usdtAddress = network.name === "hardhat" ? ethers.ZeroAddress : USDT_POLYGON;

  const Presale = await ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(
    agroAddress,
    usdtAddress,
    RATE_MATIC,
    RATE_USDT,
    deployer.address
  );
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log("  Presale  →", presaleAddress);

  // ── 4. Configuración post-deploy ──────────────────────────────────────────
  console.log("[4/4] Configuring contracts...");

  // Staking y Presale exentos del 2% burn
  await (await agrovida.setBurnExempt(stakingAddress, true)).wait();
  await (await agrovida.setBurnExempt(presaleAddress, true)).wait();
  console.log("  Burn-exempt: Staking ✓  Presale ✓");

  // Fondear staking con 50M AGROVIDA
  await (await agrovida.approve(stakingAddress, STAKING_ALLOC)).wait();
  await (await staking.depositRewardReserve(STAKING_ALLOC)).wait();
  console.log("  Staking funded: 50,000,000 AGROVIDA ✓");

  // Fondear presale con 100M AGROVIDA
  await (await agrovida.transfer(presaleAddress, PRESALE_ALLOC)).wait();
  console.log("  Presale funded: 100,000,000 AGROVIDA ✓");

  // Abrir presale
  await (await presale.setPresaleOpen(true)).wait();
  console.log("  Presale abierta ✓");

  // ── Guardar deployment ────────────────────────────────────────────────────
  const info = {
    network:   network.name,
    chainId:   (await ethers.provider.getNetwork()).chainId.toString(),
    deployer:  deployer.address,
    timestamp: new Date().toISOString(),
    rates: { maticPerAgrovida: RATE_MATIC, usdtPerAgrovida: RATE_USDT },
    contracts: {
      AGROVIDA: agroAddress,
      Staking:  stakingAddress,
      Presale:  presaleAddress,
    },
  };

  const outDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${network.name}.json`), JSON.stringify(info, null, 2));
  console.log("\nDeployment guardado en deployments/" + network.name + ".json");

  // ── Verificar en Polygonscan ──────────────────────────────────────────────
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nEsperando 30s para que Polygonscan indexe...");
    await new Promise((r) => setTimeout(r, 30_000));

    for (const [name, address, args] of [
      ["AGROVIDA", agroAddress,   [deployer.address]],
      ["Staking",  stakingAddress, [agroAddress, deployer.address]],
      ["Presale",  presaleAddress, [agroAddress, usdtAddress, RATE_MATIC, RATE_USDT, deployer.address]],
    ]) {
      try {
        await run("verify:verify", { address, constructorArguments: args });
        console.log(`  ${name} verificado ✓`);
      } catch (e) {
        console.warn(`  ${name} verificación fallida:`, e.message);
      }
    }
  }

  console.log("\n✅ Deploy completo!");
  console.log("  AGROVIDA :", agroAddress);
  console.log("  Staking  :", stakingAddress);
  console.log("  Presale  :", presaleAddress);
  console.log("\n⚠️  Actualiza PRESALE_ADDRESS en components/BuySection.tsx con:", presaleAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
