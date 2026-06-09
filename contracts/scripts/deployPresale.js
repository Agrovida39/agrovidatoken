const { ethers } = require("hardhat");

const AGROVIDA_ADDRESS = "0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5";
const USDT_POLYGON     = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const RATE_MATIC       = 1000;
const RATE_USDT        = 10;
const PRESALE_ALLOC    = ethers.parseEther("100000000");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "POL\n");

  const agrovida = await ethers.getContractAt("AGROVIDA", AGROVIDA_ADDRESS);

  console.log("[1/4] Deploying Presale...");
  const Presale = await ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(
    AGROVIDA_ADDRESS,
    USDT_POLYGON,
    RATE_MATIC,
    RATE_USDT,
    deployer.address
  );
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log("  Presale →", presaleAddress);

  console.log("[2/4] Configurando burn-exempt...");
  await (await agrovida.setBurnExempt(presaleAddress, true)).wait();
  console.log("  Burn-exempt ✓");

  console.log("[3/4] Fondeando presale con 100M AGROVIDA...");
  await (await agrovida.transfer(presaleAddress, PRESALE_ALLOC)).wait();
  console.log("  Funded ✓");

  console.log("[4/4] Abriendo presale...");
  await (await presale.setPresaleOpen(true)).wait();
  console.log("  Presale abierta ✓");

  console.log("\n✅ PRESALE ADDRESS:", presaleAddress);
  console.log("⚠️  Actualiza PRESALE_ADDRESS en components/BuySection.tsx con:", presaleAddress);
}

main().catch((err) => { console.error(err); process.exit(1); });
