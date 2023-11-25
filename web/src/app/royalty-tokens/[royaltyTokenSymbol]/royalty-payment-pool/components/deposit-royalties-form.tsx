'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROYALTY_PAYMENT_POOL_ABI, STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/config/contracts';
import { useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';
import TransactionSuccess from '@/components/transaction-success';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const formSchema = z.object({
  amount: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DepositRoyaltiesForm({
  royaltyPaymentPoolAddress,
}: {
  royaltyPaymentPoolAddress: `0x${string}`;
}) {
  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected, address } = useAccount();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 5,
    },
  });

  const deposit = useContractWrite({
    address: royaltyPaymentPoolAddress,
    abi: ROYALTY_PAYMENT_POOL_ABI,
    functionName: 'depositRoyalties',
  });

  const approve = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  async function onSubmit(values: FormValues) {
    await handleApprove(parseEther(values.amount.toString()));
  }

  async function handleApprove(amount: bigint) {
    setIsLoading(true);
    setOpen(false);

    const resultPromise = approve.writeAsync?.({ args: [royaltyPaymentPoolAddress, amount] });

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
        await handleDeposit(amount);
        return <TransactionSuccess name="Approved!" hash={receipt.transactionHash} />;
      },
    });
  }

  async function handleDeposit(amount: bigint) {
    const resultPromise = deposit.writeAsync?.({ args: [address!, amount] });

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
      loading: 'Depositing...',
      success: (receipt) => {
        setIsLoading(false);
        return <TransactionSuccess name="Deposited!" hash={receipt.transactionHash} />;
      },
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isLoading}>Deposit Royalties</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Royalties</DialogTitle>
          <DialogDescription>Have reported royalties revenue? It&apos;s time to make a deposit!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 pb-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stablecoins $</FormLabel>
                    <FormControl>
                      <Input placeholder="1000" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4">
              <Button type="submit" disabled={isLoading || !address || !approve.write || (isMounted && !isConnected)}>
                Deposit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
