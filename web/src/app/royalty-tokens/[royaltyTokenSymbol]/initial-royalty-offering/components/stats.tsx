'use client';

import { useIsClient } from 'usehooks-ts';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import Card from '@/components/card';
import { StatSkeleton } from '@/components/skeletons';
import { INITIAL_ROYALTY_OFFERING_ABI, ROYALTY_TOKEN_ABI } from '@/config/contracts';
import roundUpEther from '@/lib/helpers/round-up-ether';

export default function Stats({
  initialRoyaltyOfferingAddress,
  royaltyTokenAddress,
}: {
  initialRoyaltyOfferingAddress: `0x${string}`;
  royaltyTokenAddress: `0x${string}`;
}) {
  const isClient = useIsClient();

  const { data: royaltyTokenReserve, isLoading: isLoadingRoyalty } = useContractRead({
    address: royaltyTokenAddress,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [initialRoyaltyOfferingAddress],
    watch: true,
  });

  const { data: price, isLoading: isLoadingPrice } = useContractRead({
    address: initialRoyaltyOfferingAddress,
    abi: INITIAL_ROYALTY_OFFERING_ABI,
    functionName: 'offeringPrice',
    watch: true,
  });

  const isLoading = isLoadingRoyalty || isLoadingPrice;

  const formatValue = (value: bigint) => roundUpEther(formatEther(value));
  const formatPrice = (value: bigint) => `$${roundUpEther(value.toString())}`;

  const stats = !isLoading && [
    {
      title: 'Royalty Token Reserve',
      value: formatValue(royaltyTokenReserve!),
      icon: null,
    },
    {
      title: 'Price',
      value: formatPrice(price!),
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
        </div>
      )}
    </div>
  );
}
