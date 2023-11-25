import { ethers } from "hardhat";

const ACCOUNT_ADDRESS = "0xC37713ef41Aff1A7ac1c3D02f6f0B3a57F8A3091";
const RXRC2_ROLE =
  "0x77c6a04230ad617eb59ec90dad8c70a66f2f87f5d791cd2603e1d73ba16d4a96";

async function main() {
  const royaltyToken = await ethers.deployContract("RoyaltyToken", [
    ACCOUNT_ADDRESS,
  ]);
  await royaltyToken.waitForDeployment();
  console.log(`Royalty token deployed to ${royaltyToken.target}`);

  const stablecoin = await ethers.deployContract("Stablecoin", [
    ACCOUNT_ADDRESS,
  ]);
  await royaltyToken.waitForDeployment();
  console.log(`Stable coin deployed to ${stablecoin.target}`);

  const royaltyPaymentPool = await ethers.deployContract("RoyaltyPaymentPool", [
    ACCOUNT_ADDRESS,
    royaltyToken.target,
    stablecoin.target,
  ]);
  await royaltyPaymentPool.waitForDeployment();
  await royaltyToken.grantRole(RXRC2_ROLE, royaltyPaymentPool.getAddress());
  console.log(`Royalty pool deployed to ${royaltyPaymentPool.target}`);

  const royaltyExchange = await ethers.deployContract("RoyaltyExchange", [
    ACCOUNT_ADDRESS,
    royaltyToken.target,
    stablecoin.target,
  ]);
  await royaltyExchange.waitForDeployment();
  console.log(`RoyaltyExchange deployed to ${royaltyExchange.target}`);

  const otcMarket = await ethers.deployContract("OtcMarket", [
    ACCOUNT_ADDRESS,
    royaltyToken.target,
    stablecoin.target,
  ]);
  await otcMarket.waitForDeployment();
  console.log(`OTC market deployed to ${otcMarket.target}`);

  const initialRoyaltyOffering = await ethers.deployContract("InitialRoyaltyOffering", [
    ACCOUNT_ADDRESS,
    royaltyToken.target,
    stablecoin.target,
    1699501779n,
    2n,
  ]);
  await initialRoyaltyOffering.waitForDeployment();
  console.log(`IRO deployed to ${initialRoyaltyOffering.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
