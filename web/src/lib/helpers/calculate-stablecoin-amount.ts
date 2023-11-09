import { formatEther } from 'viem';

export default function calculateStablecoinAmount(
  buyOrSell: boolean,
  desiredAmount: bigint,
  priceSlippage: number
): string {
  return buyOrSell
    ? formatEther((desiredAmount * (BigInt(1000) + BigInt(priceSlippage))) / BigInt(1000))
    : formatEther((desiredAmount * (BigInt(1000) - BigInt(priceSlippage))) / BigInt(1000));
}
