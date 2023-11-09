'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OTC_MARKET_ABI, OTC_MARKET_ADDRESS } from '@/lib/abi/otc-market';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/lib/abi/royalty-token';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive({
    message: 'Royalty tokens must be > 0',
  }),
  stablecoins: z.coerce.number().positive({
    message: 'Stablecoins must be > 0',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOfferForm() {
  const publicClient = usePublicClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokens: 1,
      stablecoins: 5,
    },
  });

  const createOffer = useContractWrite({
    address: OTC_MARKET_ADDRESS,
    abi: OTC_MARKET_ABI,
    functionName: 'createOffer',
  });

  const cancelOffer = useContractWrite({
    address: OTC_MARKET_ADDRESS,
    abi: OTC_MARKET_ABI,
    functionName: 'cancelOffer',
  });

  useEffect(() => {
    if (cancelOffer.isSuccess) {
      toast.success('Offer cancelled');
    }
    if (cancelOffer.isError) {
      toast.error(cancelOffer.error?.message);
    }
  }, [cancelOffer.isSuccess, cancelOffer.isError, cancelOffer.error]);

  const acceptOfferId = useContractWrite({
    address: OTC_MARKET_ADDRESS,
    abi: OTC_MARKET_ABI,
    functionName: 'acceptOffer',
  });

  const approveRoyaltyTokens = useContractWrite({
    address: ROYALTY_TOKEN_ADDRESS,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'approve',
  });

  const approveStablecoins = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  async function onSubmit(values: FormValues) {
    try {
      // approve royalty tokens
      const approveRoyaltyTokensHash = await approveRoyaltyTokens.writeAsync({
        args: [OTC_MARKET_ADDRESS, parseEther(values.royaltyTokens.toString())],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveRoyaltyTokensHash.hash,
      });
      toast.success('Royalty tokens approved');
      // create offer
      const createOfferHash = await createOffer.writeAsync({
        args: [parseEther(values.royaltyTokens.toString()), parseEther(values.stablecoins.toString())],
      });
      await publicClient.waitForTransactionReceipt({
        hash: createOfferHash.hash,
      });
      toast.success('Offer created');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function acceptOffer(offerId: bigint) {
    try {
      // fetch offer
      const offerDetails = await publicClient.readContract({
        address: OTC_MARKET_ADDRESS,
        abi: OTC_MARKET_ABI,
        functionName: 'offers',
        args: [offerId],
      });

      // approve stablecoins
      const approveStablecoinsHash = await approveStablecoins.writeAsync({
        args: [OTC_MARKET_ADDRESS, offerDetails[2]],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStablecoinsHash.hash,
      });
      toast.success('Stablecoins approved');

      // accept offer
      const acceptOfferHash = await acceptOfferId.writeAsync({
        args: [offerId],
      });
      await publicClient.waitForTransactionReceipt({
        hash: acceptOfferHash.hash,
      });
      toast.success('Offer accepted');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OTC Market</CardTitle>
        <CardDescription>Enter the amount of royalty tokens to sell and the revenue you want for them.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="royaltyTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Royalty Tokens</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount of royalty tokens to sell" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stablecoins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USDC $</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount of stablecoins to receive" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button type="submit">Create offer</Button>
          </CardFooter>
        </form>
      </Form>
      <div className="flex gap-4 p-6 pt-0">
        <Button
          onClick={() =>
            cancelOffer.write({
              args: [BigInt('43531246209371066320552557765218276856130943617704640044000604487612653884707')],
            })
          }
        >
          Cancel offer
        </Button>
        <Button
          onClick={() =>
            acceptOffer(BigInt('99447179739117052866152548561566185202668920647118204285419359808988754816997'))
          }
        >
          Accept offer
        </Button>
      </div>
    </Card>
  );
}
