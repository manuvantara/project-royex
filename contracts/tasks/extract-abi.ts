import { scope } from "hardhat/config";
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { HardhatPluginError } from "hardhat/plugins";
import * as fs from "fs";

const sourceNames = [
  "RoyaltyToken",
  "RoyaltyPaymentPool",
  "Stablecoin",
  "OtcMarket",
  "StakeholderCollective",
  "RoyaltyExchange",
  "InitialRoyaltyOffering"
];

function toConstantCase(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toUpperCase();
}

const abiScope = scope("extract-abi", "Extracts ABI of the contracts");


abiScope.task("json", "Extracts ABI in a format of json files of each contract")
  .setAction(async (args, hre) => {
    try {
      await hre.run(TASK_COMPILE);
    } catch (e: any) {
      throw new HardhatPluginError('extract-abi', e.message);
    }
  
    for (const sourceName of sourceNames) {
      const { abi } = await hre.artifacts.readArtifact(sourceName);
  
      fs.writeFileSync(`./abi/${sourceName}.json`, JSON.stringify(abi));
    }
    
    console.log(`Check out ABI files at /abi`);
  });

abiScope.task("ts", "Extracts ABI in a format of ts files of each contract")
  .setAction(async (args, hre) => {
    try {
      await hre.run(TASK_COMPILE);
    } catch (e: any) {
      throw new HardhatPluginError('extract-abi', e.message);
    }
  
    for (const sourceName of sourceNames) {
      const { abi } = await hre.artifacts.readArtifact(sourceName);

      const content = `export const ${toConstantCase(sourceName)}_ABI = ${JSON.stringify(abi)} as const;`;
  
      fs.writeFileSync(`./abi/${sourceName}.ts`, content);
    }
    
    console.log(`Check out ABI files at /abi`);
  });

abiScope.task("client", "Extracts ABI for client purposes")
  .setAction(async (args, hre) => {
    try {
      await hre.run(TASK_COMPILE);
    } catch (e: any) {
      throw new HardhatPluginError('extract-abi', e.message);
    }
  
    let contents = '';
    for (const sourceName of sourceNames) {
      const { abi } = await hre.artifacts.readArtifact(sourceName);
  
      contents += `export const ${toConstantCase(sourceName)}_ABI = ${JSON.stringify(abi)} as const;`;
    }
  
    fs.writeFileSync(`../web/src/config/contracts.ts`, contents);
    console.log(`/web/src/config/contracts.ts`);
  });