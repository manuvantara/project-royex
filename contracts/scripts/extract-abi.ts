import * as fs from "fs";

const coreContracts = [
  "RoyaltyToken",
  "RoyaltyPaymentPool",
  "Stablecoin",
  "OtcMarket",
  "StakeholderCollective",
];

async function main() {
  for (const contract of coreContracts) {
    const abi = require(
      `../artifacts/contracts/${contract}/${contract}.sol/${contract}.json`,
    ).abi;

    fs.writeFileSync(`./abi/${contract}.json`, JSON.stringify(abi));
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
