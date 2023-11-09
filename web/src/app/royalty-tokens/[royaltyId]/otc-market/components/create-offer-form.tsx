'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { parseEther } from 'viem';
import { useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { OTC_MARKET_ABI, OTC_MARKET_ADDRESS } from '@/lib/abi/otc-market';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/lib/abi/royalty-token';
import calculateStablecoinAmount from '@/lib/helpers/calculate-stablecoin-amount';
import roundUpEther from '@/lib/helpers/round-up-ether';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive({
    message: 'Royalty tokens must be > 0',
  }),
  stablecoins: z.coerce.number().positive({
    message: 'Price slippage must be > 0',
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
    // approve royalty tokens
    const approveRoyaltyTokensHash = await approveRoyaltyTokens.writeAsync({
      args: [OTC_MARKET_ADDRESS, parseEther(values.royaltyTokens.toString())],
    });
    await publicClient.waitForTransactionReceipt({
      hash: approveRoyaltyTokensHash.hash,
    });
    // create offer
    const createOfferHash = await createOffer.writeAsync({
      args: [parseEther(values.royaltyTokens.toString()), parseEther(values.stablecoins.toString())],
    });
    await publicClient.waitForTransactionReceipt({
      hash: createOfferHash.hash,
    });
  }

  async function acceptOffer(offerId: bigint) {
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

    // accept offer
    const acceptOfferHash = await acceptOfferId.writeAsync({
      args: [offerId],
    });
    await publicClient.waitForTransactionReceipt({
      hash: acceptOfferHash.hash,
    });
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
