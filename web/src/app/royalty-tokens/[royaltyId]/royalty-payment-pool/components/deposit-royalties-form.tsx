'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isAddress, parseEther } from 'viem';
import { useContractWrite, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  STABLECOIN_ABI,
  STABLECOIN_ADDRESS,
  ROYALTY_PAYMENT_POOL_ADDRESS,
  ROYALTY_PAYMENT_POOL_ABI,
} from '@/config/contracts';

const formSchema = z.object({
  from: z.string().refine((v) => isAddress(v.trim())),
  amount: z.coerce.number().positive(),
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
    try {
      // approve stablecoins
      const approveStablecoinsResult = await approveStablecoins.writeAsync({
        args: [ROYALTY_PAYMENT_POOL_ADDRESS, parseEther(values.amount.toString())],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStablecoinsResult.hash,
      });
      toast.success(`${values.amount} stablecoins approved`);

      // deposit royalties
      const depositRoyaltiesResult = await depositRoyalties.writeAsync({
        args: [values.from.trim() as `0x${string}`, parseEther(values.amount.toString())],
      });
      await publicClient.waitForTransactionReceipt({
        hash: depositRoyaltiesResult.hash,
      });
      toast.success(`${values.amount} stablecoins deposited`);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Royalties</CardTitle>
        <CardDescription>Have reported royalties revenue? It`s time to make a deposit!</CardDescription>
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
                  <FormLabel>Stablecoins $</FormLabel>
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
