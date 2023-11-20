'use client';

import { toast } from 'sonner';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';
import { type Offer } from '@/api/requests';
import { Button } from '@/components/ui/button';
import { OTC_MARKET_ABI, OTC_MARKET_ADDRESS, STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';

export default function AcceptButton({
  marketAddress,
  selectedOffers,
}: {
  marketAddress: string;
  selectedOffers: Offer[];
}) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();

  const acceptOffer = useContractWrite({
    address: marketAddress,
    abi: OTC_MARKET_ABI,
    functionName: 'acceptOffer',
  });

  const approveStablecoins = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  async function acceptOffers(offers: Offer[]) {
    try {
      // approve stablecoins

      let totalStablecoinAmount = BigInt(0);
      for (const offer of offers) {
        const stablecoinAmount = BigInt(offer.stablecoinAmount.toLocaleString('fullwide', { useGrouping: false }));

        totalStablecoinAmount += stablecoinAmount;
      }

      const approveStablecoinsResult = await approveStablecoins.writeAsync({
        args: [marketAddress, totalStablecoinAmount],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStablecoinsResult.hash,
      });
      toast.success('Total stablecoin amount approved');

      // accept offers

      for (const offer of offers) {
        const acceptOfferResult = await acceptOffer.writeAsync({
          args: [BigInt(offer.offerId)],
        });
        await publicClient.waitForTransactionReceipt({
          hash: acceptOfferResult.hash,
        });
        toast.success('Offer accepted');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Button
      variant="default"
      disabled={!selectedOffers.length || (isMounted && !isConnected)}
      onClick={() => acceptOffers(selectedOffers)}
      type="button"
    >
      Accept offer(s)
    </Button>
  );
}
