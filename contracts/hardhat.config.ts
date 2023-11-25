import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-ts-plugin-abi-extractor";

if (!process.env.PRIVATE_KEY) {
  throw new Error("Set PRIVATE_KEY in a .env file");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    aurora_testnet: {
      url: `https://testnet.aurora.dev`,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 1313161555,
    },
  },
  contractsToExtractAbi: [
    "RoyaltyToken",
    "RoyaltyPaymentPool",
    "Stablecoin",
    "OtcMarket",
    "StakeholderCollective",
    "RoyaltyExchange",
    "InitialRoyaltyOffering"
  ],
  paths: {
    clientAbiFile: "../web/src/config/contracts.ts",
  },
};

export default config;
