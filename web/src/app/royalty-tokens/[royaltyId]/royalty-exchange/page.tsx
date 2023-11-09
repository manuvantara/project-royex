'use client';

import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import Card from '@/components/card';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import roundUpEther from '@/lib/helpers/round-up-ether';
import PageLayout from '../components/page-layout';
import ExchangeForm from './components/exchange-form';

export default function Page() {
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
  ];

  return (
    <PageLayout contractAddress={ROYALTY_EXCHANGE_ADDRESS}>
      <div className="flex items-start justify-center gap-4">
        <div className="w-[400px]">
          <ExchangeForm />
        </div>
        <div className="grid gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
