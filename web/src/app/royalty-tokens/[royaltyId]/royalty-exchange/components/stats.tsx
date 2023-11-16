'use client';

import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import Card from '@/components/card';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import roundUpEther from '@/lib/helpers/round-up-ether';

export default function Stats() {
  const royaltyTokenReserve = useContractRead({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'royaltyTokenReserve',
    watch: true,
  });

  const stablecoinReserve = useContractRead({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'stablecoinReserve',
    watch: true,
  });

  const stats = [
    {
      title: 'Royalty Token Reserve',
      value: royaltyTokenReserve.data ? roundUpEther(formatEther(royaltyTokenReserve.data)) : undefined,
      icon: <div></div>,
    },
    {
      title: 'Stablecoin Reserve',
      value: stablecoinReserve.data ? `$${roundUpEther(formatEther(stablecoinReserve.data))}` : undefined,
      icon: <div></div>,
    },
    {
      title: 'Price',
      value:
        royaltyTokenReserve.data && stablecoinReserve.data
          ? `1 RT = $${stablecoinReserve.data / royaltyTokenReserve.data}`
          : undefined, // TODO: use some library to have precise division
      icon: <div></div>,
    },
  ];
  return (
    <div className="grid gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} {...stat} />
      ))}
    </div>
  );
}
