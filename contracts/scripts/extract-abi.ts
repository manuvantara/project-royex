import * as fs from "fs";

const coreContracts = [
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

export function extractAbiToJson() {
  for (const contract of coreContracts) {
    const abi = require(
      `../artifacts/contracts/${contract}/${contract}.sol/${contract}.json`
    ).abi;

    fs.writeFileSync(`./abi/${contract}.json`, JSON.stringify(abi));
  }
}

export function extractAbiToTs() {
  for (const contract of coreContracts) {
    const abi = require(
      `../artifacts/contracts/${contract}/${contract}.sol/${contract}.json`,
    ).abi;

    const content = `export const ${toConstantCase(contract)}_ABI = ${JSON.stringify(abi)} as const;\n`;

    fs.writeFileSync(`./abi/${contract}.ts`, content);
  }
}

export function extractAbiToClient() {
    let contents = '';
    for (const contract of coreContracts) {
      const abi = require(
        `../artifacts/contracts/${contract}/${contract}.sol/${contract}.json`,
      ).abi;
  
      contents += `export const ${toConstantCase(contract)}_ABI = ${JSON.stringify(abi)} as const;\n`;
    }
  
    fs.writeFileSync(`../web/src/config/contracts.ts`, contents);
  }