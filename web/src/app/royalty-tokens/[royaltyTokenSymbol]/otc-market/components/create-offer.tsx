'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OTC_MARKET_ABI, ROYALTY_TOKEN_ABI } from '@/config/contracts';
import { useMounted } from '@/hooks/use-mounted';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TransactionSuccess from '@/components/transaction-success';

const formSchema = z.object({
  royaltyTokenAmount: z.coerce.number().positive(),
  stablecoinAmount: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOffer({
  marketAddress,
  royaltyTokenAddress,
}: {
  marketAddress: `0x${string}`;
  royaltyTokenAddress: `0x${string}`;
}) {
  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokenAmount: 1,
      stablecoinAmount: 5,
    },
  });

  const approve = useContractWrite({
    address: royaltyTokenAddress,
    abi: ROYALTY_TOKEN_ABI,
    functionName: 'approve',
  });

  const create = useContractWrite({
    address: marketAddress,
    abi: OTC_MARKET_ABI,
    functionName: 'createOffer',
  });

  async function onSubmit(values: FormValues) {
    await handleApprove(
      parseEther(values.royaltyTokenAmount.toString()),
      parseEther(values.stablecoinAmount.toString())
    );
  }

  async function handleApprove(royaltyTokenAmount: bigint, stablecoinAmount: bigint) {
    setIsLoading(true);
    setOpen(false);

    const resultPromise = approve.writeAsync?.({ args: [marketAddress, royaltyTokenAmount] });

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
      loading: 'Approving royalty tokens...',
      success: async (receipt) => {
        await handleCreate(royaltyTokenAmount, stablecoinAmount);
        return <TransactionSuccess name="Approved!" hash={receipt.transactionHash} />;
      },
    });
  }

  async function handleCreate(royaltyTokenAmount: bigint, stablecoinAmount: bigint) {
    const resultPromise = create.writeAsync?.({ args: [royaltyTokenAmount, stablecoinAmount] });

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
      loading: 'Creating offer...',
      success: (receipt) => {
        setIsLoading(false);
        return <TransactionSuccess name="Created!" hash={receipt.transactionHash} />;
      },
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>Create offer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an offer</DialogTitle>
          <DialogDescription>Sell royalty tokens for the preferred revenue.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 pb-6">
              <FormField
                control={form.control}
                name="royaltyTokenAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Royalty Tokens</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>The amount of royalty tokens to sell.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stablecoinAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stablecoins $</FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormDescription>Total stablecoin amount you want a buyer to pay.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit" disabled={isMounted && !isConnected}>
                Create offer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
