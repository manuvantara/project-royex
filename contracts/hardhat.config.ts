import { HardhatUserConfig, scope, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { extractAbiToClient, extractAbiToJson, extractAbiToTs } from "./scripts/extract-abi";

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
};

const abiScope = scope("extract-abi", "Extracts ABI of the contracts");

abiScope.task("json", "Extracts ABI in a format of json files for each contract to /abi")
  .setAction(async () => { extractAbiToJson(); });

abiScope.task("ts", "Extracts ABI in a format of json files for each contract to /abi")
  .setAction(async () => { extractAbiToTs(); });

abiScope.task("client", "Extracts ABI for a client purposes")
  .setAction(async () => { extractAbiToClient(); });

export default config;
