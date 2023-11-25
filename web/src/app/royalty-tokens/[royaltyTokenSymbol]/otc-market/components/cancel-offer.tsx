'use client';

import { type Offer } from '@/api/requests';
import TransactionSuccess from '@/components/transaction-success';
import { Button } from '@/components/ui/button';
import { OTC_MARKET_ABI } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';
import { toast } from 'sonner';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';

export default function CancelOffer({
  marketAddress,
  selectedOffers,
}: {
  marketAddress: `0x${string}`;
  selectedOffers: Offer[];
}) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();

  const cancel = useContractWrite({
    address: marketAddress,
    abi: OTC_MARKET_ABI,
    functionName: 'cancelOffer',
  });

  async function cancelOffers(offers: Offer[]) {
    for (const offer of offers) {
      const resultPromise = cancel.writeAsync?.({ args: [BigInt(offer.offerId)] });

      const waitForResultPromise = resultPromise.then((result) => {
        return publicClient.waitForTransactionReceipt({
          hash: result.hash,
        });
      });

      toast.promise(waitForResultPromise, {
        error: (err) => err.message,
        loading: 'Cancelling offer...',
        success: (receipt) => <TransactionSuccess name="Cancelled!" hash={receipt.transactionHash} />,
      });
    }
  }

  return (
    <Button
      variant="default"
      disabled={!selectedOffers.length || (isMounted && !isConnected)}
      onClick={() => cancelOffers(selectedOffers)}
      type="button"
    >
      Cancel offer(s)
    </Button>
  );
}
