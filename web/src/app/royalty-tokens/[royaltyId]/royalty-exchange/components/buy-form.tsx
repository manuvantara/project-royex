'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';
import calculateStablecoinAmount from '@/lib/helpers/calculate-stablecoin-amount';
import roundUpEther from '@/lib/helpers/round-up-ether';

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive(),
  priceSlippage: z.coerce.number().positive(),
});
type FormValues = z.infer<typeof formSchema>;

type BuyConfig = {
  royaltyTokenAmount: bigint;
  desiredStablecoinAmount: bigint;
  maxStablecoinAmount: bigint;
  priceSlippage: number;
};

export default function BuyForm() {
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokens: 1,
      priceSlippage: 5,
    },
  });

  const [buyConfig, setBuyConfig] = useState<BuyConfig>({
    royaltyTokenAmount: BigInt(0),
    desiredStablecoinAmount: BigInt(0),
    maxStablecoinAmount: BigInt(0),
    priceSlippage: 0,
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buy = useContractWrite({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'buy',
  });

  const approveStablecoins = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  async function onSubmit(values: FormValues) {
    try {
      const desiredStablecoinAmountToPay = await publicClient.readContract({
        address: ROYALTY_EXCHANGE_ADDRESS,
        abi: ROYALTY_EXCHANGE_ABI,
        functionName: 'calculateStablecoinAmount',
        args: [true, parseEther(values.royaltyTokens.toString())],
      });

      setBuyConfig({
        royaltyTokenAmount: parseEther(values.royaltyTokens.toString()),
        maxStablecoinAmount: parseEther(
          calculateStablecoinAmount(true, desiredStablecoinAmountToPay, values.priceSlippage)
        ),
        desiredStablecoinAmount: desiredStablecoinAmountToPay,
        priceSlippage: values.priceSlippage,
      });

      setOpen(true);
    } catch (error) {
      toast.error('You have exceeded reserves. Try with a smaller value.');
    }
  }

  async function handleBuy(buyConfig: BuyConfig) {
    try {
      setIsLoading(true);

      // approve the maximum permissible stablecoin amount
      const approveStablecoinsResult = await approveStablecoins.writeAsync({
        args: [ROYALTY_EXCHANGE_ADDRESS, buyConfig.maxStablecoinAmount],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStablecoinsResult.hash,
      });
      toast.success(`Approved ${roundUpEther(formatEther(buyConfig.maxStablecoinAmount))} stablecoins.`);

      // buy royalty token amount
      const buyResult = await buy.writeAsync({
        args: [buyConfig.royaltyTokenAmount, buyConfig.desiredStablecoinAmount, buyConfig.priceSlippage],
      });
      await publicClient.waitForTransactionReceipt({
        hash: buyResult.hash,
      });
      toast.success(`${roundUpEther(formatEther(buyConfig.royaltyTokenAmount))} royalty token(s) bought!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy</CardTitle>
        <CardDescription>Buy a specified amount of royalty tokens.</CardDescription>
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
                    <Input placeholder="2" {...field} />
                  </FormControl>
                  <FormDescription>The amount of royalty tokens to buy.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceSlippage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max. slippage in 1/10 of percent</FormLabel>
                  <FormControl>
                    <Input placeholder="5" {...field} />
                  </FormControl>
                  <FormDescription>
                    Price Slippage is the difference between the price you expect to receive vs what you actually
                    receive when the trade is complete.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button type="submit" disabled={isLoading}>
              Buy
            </Button>
          </CardFooter>
          <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <div className="flex items-center gap-4 py-4">
                  <p>Quote</p>
                  <Separator orientation="vertical" />
                  <p>
                    expected $
                    <span className="text-xl">{roundUpEther(formatEther(buyConfig.desiredStablecoinAmount))}</span>
                  </p>
                  <Separator orientation="vertical" />
                  <p>
                    max $
                    {!!buyConfig.desiredStablecoinAmount && !!buyConfig.maxStablecoinAmount ? (
                      <span className="text-xl">{roundUpEther(formatEther(buyConfig.maxStablecoinAmount))}</span>
                    ) : (
                      <Skeleton className="h-[20px] w-[20px] rounded-full" />
                    )}
                  </p>
                </div>
                <p className="max-w-sm text-sm text-muted-foreground">
                  This includes 0.3% fee to ensure the best experience with Royex. It has already been factored into the
                  quote.
                </p>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleBuy(buyConfig)}
                  disabled={!buyConfig.desiredStablecoinAmount || !buyConfig.maxStablecoinAmount || !isConnected}
                >
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
