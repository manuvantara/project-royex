'use client';

import Balancer from 'react-wrap-balancer';
import { useEffectOnce } from 'usehooks-ts';
import { INITIAL_ROYALTY_OFFERING_ADDRESS, ROYALTY_TOKEN_ADDRESS } from '@/config/contracts';
import { IroForm, Stats } from './components';

export default function Page({ params: { royaltyTokenSymbol } }: { params: { royaltyTokenSymbol: string } }) {
  useEffectOnce(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  });

  return (
    <div className="rounded-md border p-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">Initial Royalty Offering</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          <Balancer>IRO is a place where royalty tokens are initially offered.</Balancer>
        </p>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <IroForm initialRoyaltyOfferingAddress={INITIAL_ROYALTY_OFFERING_ADDRESS} />
        </div>
        <Stats
          initialRoyaltyOfferingAddress={INITIAL_ROYALTY_OFFERING_ADDRESS}
          royaltyTokenAddress={ROYALTY_TOKEN_ADDRESS}
        />
      </div>
    </div>
  );
}
