import { formatEther } from 'viem';

export default function calculateStablecoinAmount(
  buyOrSell: boolean,
  desiredAmount: bigint,
  priceSlippage: bigint
): string {
  return buyOrSell
    ? formatEther((desiredAmount * (BigInt(1000) + priceSlippage)) / BigInt(1000))
    : formatEther((desiredAmount * (BigInt(1000) - priceSlippage)) / BigInt(1000));
}
