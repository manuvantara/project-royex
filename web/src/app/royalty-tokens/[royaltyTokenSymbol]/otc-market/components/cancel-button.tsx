'use client';

import { type Offer } from '@/api/requests';
import { Button } from '@/components/ui/button';
import { OTC_MARKET_ABI } from '@/config/contracts';
import { Explorers } from '@/config/explorers';
import { useMounted } from '@/hooks/use-mounted';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';

export default function CancelButton({
  marketAddress,
  selectedOffers,
}: {
  marketAddress: string;
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
        success: (receipt) => (
          <div className="flex items-center gap-2 font-medium">
            <span>Offer cancelled!</span>
            <Button asChild size="icon" variant="outline" className="h-6 w-6">
              <Link target="_blank" href={`${Explorers['aurora-testnet']}/tx/${receipt.transactionHash}`}>
                <ArrowTopRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ),
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
