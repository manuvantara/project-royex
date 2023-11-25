import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { Explorers } from '@/config/explorers';

export default function TransactionSuccess({ name, hash }: { name: string; hash: string }) {
  const receipt = {
    transactionHash: hash,
  };
  return (
    <div className="flex items-center gap-2 font-medium">
      <span>{name}</span>
      <Button asChild size="icon" variant="outline" className="h-6 w-6">
        <Link target="_blank" href={`${Explorers['aurora-testnet']}/tx/${hash}`}>
          <ArrowTopRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
