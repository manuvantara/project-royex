'use client';

import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import Card from '@/components/card';
import {
  INITIAL_ROYALTY_OFFERING_ABI,
  INITIAL_ROYALTY_OFFERING_ADDRESS,
  ROYALTY_TOKEN_ABI,
  ROYALTY_TOKEN_ADDRESS,
} from '@/config/contracts';
import roundUpEther from '@/lib/helpers/round-up-ether';

export default function Stats() {
  const royaltyTokenReserve = useContractRead({
    address: ROYALTY_TOKEN_ADDRESS,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [INITIAL_ROYALTY_OFFERING_ADDRESS],
    watch: true,
  });

  const offeringPrice = useContractRead({
    address: INITIAL_ROYALTY_OFFERING_ADDRESS,
    abi: INITIAL_ROYALTY_OFFERING_ABI,
    functionName: 'offeringPrice',
    watch: true,
  });

  const stats = [
    {
      title: 'Royalty Token Reserve',
      value: royaltyTokenReserve.data ? roundUpEther(formatEther(royaltyTokenReserve.data)) : undefined,
      icon: <div></div>,
    },
    {
      title: 'Offering price',
      value: offeringPrice.data ? `1 RT = $${offeringPrice.data}` : undefined,
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