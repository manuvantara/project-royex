'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount, useContractWrite, usePrepareContractWrite, usePublicClient, useWaitForTransaction } from 'wagmi';
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
import { STABLECOIN_ABI, STABLECOIN_ADDRESS, ROYALTY_EXCHANGE_ABI, ROYALTY_EXCHANGE_ADDRESS } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';
import calculateStablecoinAmount from '@/lib/helpers/calculate-stablecoin-amount';
import roundUpEther from '@/lib/helpers/round-up-ether';
import { useDebounce } from 'usehooks-ts';
import Link from 'next/link';
import { Explorers } from '@/config/explorers';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive(),
  priceSlippage: z.coerce.number().positive(),
});
type FormValues = z.infer<typeof formSchema>;

type BuyConfig = {
  royaltyTokenAmount: bigint;
  requiredStablecoinAmount: bigint;
  maxStablecoinAmount: bigint;
  priceSlippage: number;
};

export default function BuyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokens: 1,
      priceSlippage: 5,
    },
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const [buyConfig, setBuyConfig] = useState<BuyConfig>({
    royaltyTokenAmount: BigInt(0),
    requiredStablecoinAmount: BigInt(0),
    maxStablecoinAmount: BigInt(0),
    priceSlippage: 0,
  });
  const debouncedBuyConfig = useDebounce(buyConfig, 500);

  const prepareApproveStablecoins = usePrepareContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
    args: [ROYALTY_EXCHANGE_ADDRESS, debouncedBuyConfig.maxStablecoinAmount],
    enabled: debouncedBuyConfig.maxStablecoinAmount !== BigInt(0),
  });
  const approveStablecoins = useContractWrite(prepareApproveStablecoins.config);
  const waitForApproveStablecoins = useWaitForTransaction({
    hash: approveStablecoins.data?.hash,
    enabled: approveStablecoins.isSuccess,
  });

  const prepareBuyRoyaltyTokens = usePrepareContractWrite({
    address: ROYALTY_EXCHANGE_ADDRESS,
    abi: ROYALTY_EXCHANGE_ABI,
    functionName: 'buy',
    args: [
      debouncedBuyConfig.royaltyTokenAmount,
      debouncedBuyConfig.requiredStablecoinAmount,
      debouncedBuyConfig.priceSlippage,
    ],
    enabled: waitForApproveStablecoins.isSuccess,
  });
  const buyRoyaltyTokens = useContractWrite(prepareBuyRoyaltyTokens.config);
  useEffect(() => {
    if (prepareBuyRoyaltyTokens.isSuccess) {
      handleBuy();
    }
  }, [prepareBuyRoyaltyTokens.isSuccess]);

  async function onSubmit(values: FormValues) {
    const desiredStablecoinAmountPromise = publicClient.readContract({
      address: ROYALTY_EXCHANGE_ADDRESS,
      abi: ROYALTY_EXCHANGE_ABI,
      functionName: 'calculateStablecoinAmount',
      args: [true, parseEther(values.royaltyTokens.toString())],
    });

    toast.promise(desiredStablecoinAmountPromise, {
      error: (err) => err.message,
      loading: 'Calculating required stablecoin amount...',
      success: (requiredStablecoinAmount) => {
        setBuyConfig({
          royaltyTokenAmount: parseEther(values.royaltyTokens.toString()),
          maxStablecoinAmount: parseEther(
            calculateStablecoinAmount(true, requiredStablecoinAmount, values.priceSlippage)
          ),
          requiredStablecoinAmount: requiredStablecoinAmount,
          priceSlippage: values.priceSlippage,
        });
        setOpen(true);

        return 'Required stablecoin amount calculated!';
      },
    });
  }

  async function handleApprove() {
    setIsLoading(true);

    const resultPromise = approveStablecoins.writeAsync?.();

    const waitForResultPromise = resultPromise!.then(async (result) => {
      return await publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
      loading: 'Approving stablecoin amount...',
      success: (receipt) => (
        <div className="flex items-center gap-2 font-medium">
          <span>Approved!</span>
          <Button asChild size="icon" variant="outline" className="h-6 w-6">
            <Link target="_blank" href={`${Explorers['aurora-testnet']}/tx/${receipt.transactionHash}`}>
              <ArrowTopRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    });
  }

  async function handleBuy() {
    const resultPromise = buyRoyaltyTokens.writeAsync?.();

    const waitForResultPromise = resultPromise!.then(async (result) => {
      return await publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
      loading: 'Buying royalty tokens...',
      success: (receipt) => {
        setIsLoading(false);
        return (
          <div className="flex items-center gap-2 font-medium">
            <span>Bought!</span>
            <Button asChild size="icon" variant="outline" className="h-6 w-6">
              <Link target="_blank" href={`${Explorers['aurora-testnet']}/tx/${receipt.transactionHash}`}>
                <ArrowTopRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      },
    });
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
                    <span className="text-xl">{roundUpEther(formatEther(buyConfig.requiredStablecoinAmount))}</span>
                  </p>
                  <Separator orientation="vertical" />
                  <p>
                    max $<span className="text-xl">{roundUpEther(formatEther(buyConfig.maxStablecoinAmount))}</span>
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
                  disabled={!approveStablecoins.write || (isMounted && !isConnected)}
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
