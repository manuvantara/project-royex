'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { parseEther } from 'viem';
import { useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/lib/abi/royalty-token';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';
import calculateStablecoinAmount from '@/lib/helpers/calculate-stablecoin-amount';
import roundUpEther from '@/lib/helpers/round-up-ether';

const types = z.enum(['sell', 'buy']);

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive({
    message: 'Royalty tokens must be > 0',
  }),
  priceSlippage: z.coerce.number().positive({
    message: 'Price slippage must be > 0',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExchangeForm() {
  const publicClient = usePublicClient();

  const [input, setInput] = useState({
    royaltyTokens: BigInt(0),
    stablecoinAmount: BigInt(0),
    priceSlippage: 0,
  });

  const [submit, setSubmit] = useState(false);
  const [type, setType] = useState<z.infer<typeof types>>(types.enum.sell);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokens: 1,
      priceSlippage: 5,
    },
  });

  const stablecoinAmount = useContractRead({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'calculateStablecoinAmount',
    args: [type === types.enum.buy, parseEther(form.getValues('royaltyTokens').toString())],
    enabled: false,
    onSuccess(data) {
      setInput({
        royaltyTokens: parseEther(form.getValues('royaltyTokens').toString()),
        stablecoinAmount: data,
        priceSlippage: form.getValues('priceSlippage') * 10,
      });
    },
  });

  const buy = useContractWrite({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'buy',
  });

  const sell = useContractWrite({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'sell',
  });

  const approveStablecoins = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  const approveRoyaltyTokens = useContractWrite({
    address: ROYALTY_TOKEN_ADDRESS,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'approve',
  });

  function onSubmit(values: FormValues) {
    setSubmit(true);
    stablecoinAmount.refetch();
  }

  async function onTrade() {
    if (type === types.enum.buy) {
      // approve stablecoins
      const approveStablecoinsHash = await approveStablecoins.writeAsync({
        args: [
          ROYALTY_EXCHANGE_ADDRESS,
          parseEther(calculateStablecoinAmount(true, input.stablecoinAmount, input.priceSlippage)),
        ],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStablecoinsHash.hash,
      });
      // buy
      const buyHash = await buy.writeAsync({
        args: [input.royaltyTokens, input.stablecoinAmount, input.priceSlippage],
      });
      await publicClient.waitForTransactionReceipt({
        hash: buyHash.hash,
      });
    } else {
      // approve royalty tokens
      const approveRoyaltyTokensHash = await approveRoyaltyTokens.writeAsync({
        args: [ROYALTY_EXCHANGE_ADDRESS, input.royaltyTokens],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveRoyaltyTokensHash.hash,
      });
      // sell
      const sellHash = await sell.writeAsync({
        args: [input.royaltyTokens, input.stablecoinAmount, input.priceSlippage],
      });
      await publicClient.waitForTransactionReceipt({
        hash: sellHash.hash,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Royalty Exchange</CardTitle>
        <CardDescription>Provide how many royalty tokens you want to buy or sell.</CardDescription>
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
                    <Input placeholder="Amount of royalty tokens to trade" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceSlippage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price slippage %</FormLabel>
                  <FormControl>
                    <Input placeholder="Price slippage in %" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button onClick={() => setType(types.enum.buy)} type="submit">
              Buy
            </Button>
            <Button onClick={() => setType(types.enum.sell)} type="submit">
              Sell
            </Button>
          </CardFooter>
          <AlertDialog onOpenChange={setSubmit} open={submit}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                {input.stablecoinAmount ? (
                  <div>
                    {type === types.enum.buy
                      ? `You will pay at most $${roundUpEther(
                          calculateStablecoinAmount(true, input.stablecoinAmount, input.priceSlippage)
                        )}`
                      : `You will receive at least $${roundUpEther(
                          calculateStablecoinAmount(false, input.stablecoinAmount, input.priceSlippage)
                        )}`}
                  </div>
                ) : (
                  <Skeleton className="h-[20px] w-[100px] rounded-full" />
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onTrade()} disabled={!input.stablecoinAmount}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </Card>
  );
}
