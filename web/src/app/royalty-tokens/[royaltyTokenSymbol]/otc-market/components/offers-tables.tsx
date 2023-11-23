'use client';

import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useCountdown } from 'usehooks-ts';
import { useOtcMarketsServiceFetchOffersKey, useOtcMarketsServiceGetContractAddressKey } from '@/api/queries';
import { OtcMarketsService, type Offer } from '@/api/requests';
import { useAccount } from 'wagmi';
import { useMounted } from '@/hooks/use-mounted';
import MarketOffersTable from './market-offers-table';
import YourOffersTable from './your-offers-table';

export default function OffersTables({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const { address } = useAccount();
  const isMounted = useMounted();

  const {
    data: offers,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: [useOtcMarketsServiceFetchOffersKey],
    queryFn: () => OtcMarketsService.fetchOffers(royaltyTokenSymbol),
    refetchInterval: 15_000,
  });

  const { data: marketAddress } = useQuery({
    queryKey: [useOtcMarketsServiceGetContractAddressKey],
    queryFn: () => OtcMarketsService.getContractAddress(royaltyTokenSymbol),
  });

  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 1,
    isIncrement: true,
    intervalMs: 1000,
  });

  React.useEffect(() => {
    if (!isFetching && !isPending) {
      startCountdown();
    } else {
      stopCountdown();
      resetCountdown();
    }
  });

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3">
        <MarketOffersTable
          offers={offers ? (isMounted ? offers.filter((offer: Offer) => offer.seller !== address) : []) : []}
          marketAddress={marketAddress ?? ''}
          count={count}
        />
      </div>
      <div className="col-span-2">
        <YourOffersTable
          offers={offers ? (isMounted ? offers.filter((offer: Offer) => offer.seller === address) : []) : []}
          marketAddress={marketAddress ?? ''}
          count={count}
        />
      </div>
    </div>
  );
}
