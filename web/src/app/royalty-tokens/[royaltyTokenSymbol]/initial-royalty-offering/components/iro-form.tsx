'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { INITIAL_ROYALTY_OFFERING_ABI, STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';
import TransactionSuccess from '@/components/transaction-success';

const formSchema = z.object({
  royaltyTokenAmount: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

export default function IroForm({ initialRoyaltyOfferingAddress }: { initialRoyaltyOfferingAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokenAmount: 1,
    },
  });

  const approve = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  const buy = useContractWrite({
    address: initialRoyaltyOfferingAddress,
    abi: INITIAL_ROYALTY_OFFERING_ABI,
    functionName: 'buy',
  });

  const { data: price } = useContractRead({
    address: initialRoyaltyOfferingAddress,
    abi: INITIAL_ROYALTY_OFFERING_ABI,
    functionName: 'offeringPrice',
  });

  async function onSubmit(values: FormValues) {
    const royaltyTokenAmount = parseEther(values.royaltyTokenAmount.toString());
    const stablecoinAmount = price! * royaltyTokenAmount;

    await handleApprove(royaltyTokenAmount, stablecoinAmount);
  }

  async function handleApprove(royaltyTokenAmount: bigint, stablecoinAmount: bigint) {
    setIsLoading(true);

    const resultPromise = approve.writeAsync?.({ args: [initialRoyaltyOfferingAddress, stablecoinAmount] });

    const waitForResultPromise = resultPromise.then((result) => {
      return publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
      loading: 'Approving stablecoins...',
      success: async (receipt) => {
        await handleBuy(royaltyTokenAmount);
        return <TransactionSuccess name="Approved!" hash={receipt.transactionHash} />;
      },
    });
  }

  async function handleBuy(royaltyTokenAmount: bigint) {
    const resultPromise = buy.writeAsync?.({ args: [royaltyTokenAmount] });

    const waitForResultPromise = resultPromise.then((result) => {
      return publicClient.waitForTransactionReceipt({
        hash: result.hash,
      });
    });

    toast.promise(waitForResultPromise, {
      error: (err) => {
        setIsLoading(false);
        return err.message;
      },
      loading: 'Buying...',
      success: async (receipt) => {
        setIsLoading(false);
        return <TransactionSuccess name="Bought!" hash={receipt.transactionHash} />;
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initial Royalty Offering</CardTitle>
        <CardDescription>Buy a desired amount of royalty tokens offered at a fixed price.</CardDescription>
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
                    <Input placeholder="4" {...field} />
                  </FormControl>
                  <FormDescription>The amount of royalty tokens you want to buy.</FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button type="submit" disabled={isLoading || (isMounted && !isConnected)}>
              Buy
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
