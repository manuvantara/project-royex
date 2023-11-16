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
import { useMounted } from '@/hooks/use-mounted';
import { ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/lib/abi/royalty-exchange';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/lib/abi/royalty-token';
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
  minStablecoinAmount: bigint;
  priceSlippage: number;
};

export default function SellForm() {
  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokens: 1,
      priceSlippage: 5,
    },
  });

  const [sellConfig, setSellConfig] = useState<BuyConfig>({
    royaltyTokenAmount: BigInt(0),
    desiredStablecoinAmount: BigInt(0),
    minStablecoinAmount: BigInt(0),
    priceSlippage: 0,
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sell = useContractWrite({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'sell',
  });

  const approveRoyaltyTokens = useContractWrite({
    address: ROYALTY_TOKEN_ADDRESS,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'approve',
  });

  async function onSubmit(values: FormValues) {
    try {
      const desiredStablecoinAmountToReceive = await publicClient.readContract({
        address: ROYALTY_EXCHANGE_ADDRESS,
        abi: ROYALTY_EXCHANGE_ABI,
        functionName: 'calculateStablecoinAmount',
        args: [false, parseEther(values.royaltyTokens.toString())],
      });

      setSellConfig({
        royaltyTokenAmount: parseEther(values.royaltyTokens.toString()),
        minStablecoinAmount: parseEther(
          calculateStablecoinAmount(false, desiredStablecoinAmountToReceive, values.priceSlippage)
        ),
        desiredStablecoinAmount: desiredStablecoinAmountToReceive,
        priceSlippage: values.priceSlippage,
      });

      setOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleSell(sellConfig: BuyConfig) {
    try {
      setIsLoading(true);

      // approve royalty token amount
      const approveRoyaltyTokenAmountResult = await approveRoyaltyTokens.writeAsync({
        args: [ROYALTY_EXCHANGE_ADDRESS, sellConfig.royaltyTokenAmount],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveRoyaltyTokenAmountResult.hash,
      });
      toast.success(`${roundUpEther(formatEther(sellConfig.royaltyTokenAmount))} royalty token(s) approved`);

      // sell
      const sellResult = await sell.writeAsync({
        args: [sellConfig.royaltyTokenAmount, sellConfig.desiredStablecoinAmount, sellConfig.priceSlippage],
      });
      await publicClient.waitForTransactionReceipt({
        hash: sellResult.hash,
      });
      toast.success(`${roundUpEther(formatEther(sellConfig.royaltyTokenAmount))} royalty token(s) sold`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell</CardTitle>
        <CardDescription>Sell a specified amount of royalty tokens.</CardDescription>
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
                  <FormDescription>The amount of royalty tokens to sell.</FormDescription>
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
              Sell
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
                    <span className="text-xl">{roundUpEther(formatEther(sellConfig.desiredStablecoinAmount))}</span>
                  </p>
                  <Separator orientation="vertical" />
                  <p>
                    min $
                    {!!sellConfig.desiredStablecoinAmount && !!sellConfig.minStablecoinAmount ? (
                      <span className="text-xl">{roundUpEther(formatEther(sellConfig.minStablecoinAmount))}</span>
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
                  onClick={() => handleSell(sellConfig)}
                  disabled={
                    isMounted &&
                    (!sellConfig.desiredStablecoinAmount ||
                      !sellConfig.minStablecoinAmount ||
                      !isConnected ||
                      isLoading)
                  }
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
