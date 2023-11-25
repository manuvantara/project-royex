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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS, ROYALTY_EXCHANGE_ABI } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';
import calculateStablecoinAmount from '@/lib/helpers/calculate-stablecoin-amount';
import roundUpEther from '@/lib/helpers/round-up-ether';
import TransactionSuccess from '@/components/transaction-success';

const formSchema = z.object({
  royaltyTokenAmount: z.coerce.number().positive(),
  priceSlippage: z.coerce.number().positive(),
});
type FormValues = z.infer<typeof formSchema>;

type BuyConfig = {
  royaltyTokenAmount: bigint;
  givenStablecoinAmount: bigint;
  minStablecoinAmount: bigint;
  priceSlippage: number;
};

export default function SellForm({ royaltyExchangeAddress }: { royaltyExchangeAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokenAmount: 1,
      priceSlippage: 5,
    },
  });

  const [sellConfig, setSellConfig] = useState<BuyConfig>({
    royaltyTokenAmount: BigInt(0),
    givenStablecoinAmount: BigInt(0),
    minStablecoinAmount: BigInt(0),
    priceSlippage: 0,
  });
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sell = useContractWrite({
    address: royaltyExchangeAddress,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'sell',
  });

  const approve = useContractWrite({
    address: ROYALTY_TOKEN_ADDRESS,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'approve',
  });

  async function onSubmit(values: FormValues) {
    const stablecoinAmountPromise = publicClient.readContract({
      address: royaltyExchangeAddress,
      abi: ROYALTY_EXCHANGE_ABI,
      functionName: 'calculateStablecoinAmount',
      args: [false, parseEther(values.royaltyTokenAmount.toString())],
    });

    toast.promise(stablecoinAmountPromise, {
      error: (err) => err.message,
      loading: 'Calculating stablecoin amount...',
      success: (stablecoinAmount) => {
        setSellConfig({
          royaltyTokenAmount: parseEther(values.royaltyTokenAmount.toString()),
          minStablecoinAmount: parseEther(calculateStablecoinAmount(true, stablecoinAmount, values.priceSlippage)),
          givenStablecoinAmount: stablecoinAmount,
          priceSlippage: values.priceSlippage,
        });
        setOpen(true);

        return 'Calculated!';
      },
    });
  }

  async function handleApprove() {
    setIsLoading(true);

    const resultPromise = approve.writeAsync?.({
      args: [royaltyExchangeAddress, sellConfig.royaltyTokenAmount],
    });

    const waitForResultPromise = resultPromise!.then(async (result) => {
      return publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
      loading: 'Approving royalty tokens...',
      success: async (receipt) => {
        await handleSell();
        return <TransactionSuccess name="Approved!" hash={receipt.transactionHash} />;
      },
    });
  }

  async function handleSell() {
    const resultPromise = sell.writeAsync?.({
      args: [sellConfig.royaltyTokenAmount, sellConfig.givenStablecoinAmount, sellConfig.priceSlippage],
    });

    const waitForResultPromise = resultPromise!.then(async (result) => {
      return publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
      loading: 'Selling royalty tokens...',
      success: (receipt) => {
        setIsLoading(false);
        return <TransactionSuccess name="Sold!" hash={receipt.transactionHash} />;
      },
    });
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
              name="royaltyTokenAmount"
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
                    <span className="text-xl">{roundUpEther(formatEther(sellConfig.givenStablecoinAmount))}</span>
                  </p>
                  <Separator orientation="vertical" />
                  <p>
                    min $<span className="text-xl">{roundUpEther(formatEther(sellConfig.minStablecoinAmount))}</span>
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
                  onClick={() => handleApprove()}
                  disabled={!approve.write || isLoading || (isMounted && !isConnected)}
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
