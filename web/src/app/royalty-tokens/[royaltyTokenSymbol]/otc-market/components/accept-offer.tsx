'use client';

import { type Offer } from '@/api/requests';
import TransactionSuccess from '@/components/transaction-success';
import { Button } from '@/components/ui/button';
import { OTC_MARKET_ABI, STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';
import { toast } from 'sonner';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';

export default function AcceptOffer({
  marketAddress,
  selectedOffers,
}: {
  marketAddress: `0x${string}`;
  selectedOffers: Offer[];
}) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();

  const approve = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  const accept = useContractWrite({
    address: marketAddress,
    abi: OTC_MARKET_ABI,
    functionName: 'acceptOffer',
  });

  async function handleApprove(offers: Offer[]) {
    let totalStablecoinAmount = BigInt(0);
    for (const offer of offers) {
      const stablecoinAmount = BigInt(offer.stablecoinAmount.toLocaleString('fullwide', { useGrouping: false }));
      totalStablecoinAmount += stablecoinAmount;
    }

    const resultPromise = approve.writeAsync?.({ args: [marketAddress, BigInt(totalStablecoinAmount)] });

    const waitForResultPromise = resultPromise.then((result) => {
      return publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => err.message,
      loading: 'Approving stablecoins...',
      success: async (receipt) => {
        await handleAccept(offers);
        return <TransactionSuccess name="Approved!" hash={receipt.transactionHash} />;
      },
    });
  }

  async function handleAccept(offers: Offer[]) {
    for (const offer of offers) {
      const resultPromise = accept.writeAsync?.({ args: [BigInt(offer.offerId)] });

      const waitForResultPromise = resultPromise.then((result) => {
        return publicClient.waitForTransactionReceipt({
          hash: result.hash,
        });
      });

      toast.promise(waitForResultPromise, {
        error: (err) => err.message,
        loading: 'Accepting offer...',
        success: (receipt) => <TransactionSuccess name="Accepted!" hash={receipt.transactionHash} />,
      });
    }
  }

  return (
    <Button
      variant="default"
      disabled={!selectedOffers.length || (isMounted && !isConnected)}
      onClick={() => handleApprove(selectedOffers)}
      type="button"
    >
      Accept offer(s)
    </Button>
  );
}
