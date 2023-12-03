import { ethers } from "hardhat";

const RXRC2_ROLE =
  "0x77c6a04230ad617eb59ec90dad8c70a66f2f87f5d791cd2603e1d73ba16d4a96";

async function main() {
  const [owner, ...otherAccounts] = await ethers.getSigners();

  const royaltyToken = await ethers.deployContract("RoyaltyToken", [
    owner.address,
  ]);
  await royaltyToken.waitForDeployment();
  await royaltyToken.mint(owner.address, ethers.parseEther("1000000"));
  console.log(`Royalty token deployed to ${royaltyToken.target}`);

  const stablecoin = await ethers.deployContract("Stablecoin", [
    owner.address,
  ]);
  await stablecoin.waitForDeployment();
  await stablecoin.mint(owner.address, ethers.parseEther("1000000"));
  console.log(`Stable coin deployed to ${stablecoin.target}`);

  const royaltyPaymentPool = await ethers.deployContract("RoyaltyPaymentPool", [
    owner.address,
    royaltyToken.target,
    stablecoin.target,
  ]);
  await royaltyPaymentPool.waitForDeployment();
  await royaltyToken.grantRole(RXRC2_ROLE, royaltyPaymentPool.getAddress());
  console.log(`Royalty pool deployed to ${royaltyPaymentPool.target}`);

  const royaltyExchange = await ethers.deployContract("RoyaltyExchange", [
    owner.address,
    royaltyToken.target,
    stablecoin.target,
  ]);
  await royaltyExchange.waitForDeployment();
  await royaltyToken.approve(
    royaltyExchange.target,
    ethers.parseEther("5000"),
  );
  await stablecoin.approve(
    royaltyExchange.target,
    ethers.parseEther("5000"),
  );
  await royaltyExchange.provideInitialLiquidity(
    ethers.parseEther("5000"),
    ethers.parseEther("5000"),
  );
  console.log(`RoyaltyExchange deployed to ${royaltyExchange.target}`);

  const otcMarket = await ethers.deployContract("OtcMarket", [
    owner.address,
    royaltyToken.target,
    stablecoin.target,
  ]);
  await otcMarket.waitForDeployment();
  console.log(`OTC market deployed to ${otcMarket.target}`);

  const initialRoyaltyOffering = await ethers.deployContract("InitialRoyaltyOffering", [
    owner.address,
    royaltyToken.target,
    stablecoin.target,
    1699501779n,
    2n,
  ]);
  await royaltyToken.approve(
    initialRoyaltyOffering.target,
    ethers.parseEther("5000"),
  );
  await initialRoyaltyOffering.depositRoyaltyTokens(
    ethers.parseEther("5000"),
  );
  await initialRoyaltyOffering.waitForDeployment();
  console.log(`IRO deployed to ${initialRoyaltyOffering.target}`);

  const stakeholderCollective = await ethers.deployContract("StakeholderCollective", [
    royaltyToken.getAddress(),
    "Stakeholder Collective Test"
  ]);
  await stakeholderCollective.waitForDeployment();
  console.log(`Stakeholder collective deployed to ${stakeholderCollective.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
