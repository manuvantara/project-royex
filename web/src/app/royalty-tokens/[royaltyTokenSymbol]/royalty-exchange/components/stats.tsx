'use client';

import { useIsClient } from 'usehooks-ts';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import Card from '@/components/card';
import { StatSkeleton } from '@/components/skeletons';
import { ROYALTY_EXCHANGE_ABI } from '@/config/contracts';
import roundUpEther from '@/lib/helpers/round-up-ether';

type Props = {
  royaltyExchangeAddress: `0x${string}`;
};

export default function Stats({ royaltyExchangeAddress }: Props) {
  const isClient = useIsClient();

  const { data: royaltyTokenReserve, isLoading: isLoadingRoyalty } = useContractRead({
    address: royaltyExchangeAddress,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'royaltyTokenReserve',
    watch: true,
  });

  const { data: stablecoinReserve, isLoading: isLoadingStablecoin } = useContractRead({
    address: royaltyExchangeAddress,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'stablecoinReserve',
    watch: true,
  });

  const isLoading = isLoadingRoyalty || isLoadingStablecoin;

  const formatValue = (value: bigint) => roundUpEther(formatEther(value));

  const calculatePrice = (stablecoinReserveValue: bigint, royaltyTokenReserveValue: bigint) => {
    const price = Number(formatEther(stablecoinReserveValue)) / Number(formatEther(royaltyTokenReserveValue));
    return `$${roundUpEther(price.toString())}`;
  };

  const stats = !isLoading && [
    {
      title: 'Royalty Token Reserve',
      value: formatValue(royaltyTokenReserve!),
      icon: null,
    },
    {
      title: 'Stablecoin Reserve',
      value: `$${formatValue(stablecoinReserve!)}`,
      icon: null,
    },
    {
      title: 'Price',
      value: calculatePrice(stablecoinReserve!, royaltyTokenReserve!),
      icon: null,
    },
  ];

  return (
    <div className="grid gap-6">
      {isClient && !isLoading && stats ? (
        stats.map((stat) => <Card key={stat.title} {...stat} />)
      ) : (
        <div className="grid gap-6">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      )}
    </div>
  );
}
