'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { isAddress, parseEther } from 'viem';
import { useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { OTC_MARKET_ABI, OTC_MARKET_ADDRESS } from '@/lib/abi/otc-market';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/lib/abi/royalty-token';
import calculateStablecoinAmount from '@/lib/helpers/calculate-stablecoin-amount';
import roundUpEther from '@/lib/helpers/round-up-ether';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';
import { ROYALTY_PAYMENT_POOL_ABI, ROYALTY_PAYMENT_POOL_ADDRESS } from '@/lib/abi/royalty-payment-pool';

const formSchema = z.object({
  from: z.string().refine((v) => isAddress(v), {
    message: 'Invalid address',
  }),
  amount: z.coerce.number().positive({
    message: 'Deposit must be > 0',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DepositRoyaltiesForm() {
  const publicClient = usePublicClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 5,
    },
  });

  const depositRoyalties = useContractWrite({
    address: ROYALTY_PAYMENT_POOL_ADDRESS,
    abi: ROYALTY_PAYMENT_POOL_ABI,
    functionName: 'depositRoyalties',
  });

  const approveStablecoins = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  async function onSubmit(values: FormValues) {
    // approve stablecoins
    const approveStablecoinsHash = await approveStablecoins.writeAsync({
      args: [ROYALTY_PAYMENT_POOL_ADDRESS, parseEther(values.amount.toString())],
    });
    await publicClient.waitForTransactionReceipt({
      hash: approveStablecoinsHash.hash,
    });
    // deposit royalties
    const depositRoyaltiesHash = await depositRoyalties.writeAsync({
      args: [values.from as `0x${string}`, parseEther(values.amount.toString())],
    });
    await publicClient.waitForTransactionReceipt({
      hash: depositRoyaltiesHash.hash,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Royalties</CardTitle>
        <CardDescription>Enter the amount of stablecoins to deposit.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input placeholder="Distributor's address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>USDC $</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount of stablecoins to deposit" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button type="submit">Deposit royalties</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
