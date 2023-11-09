'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
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
import { IRO_ABI, IRO_ADDRESS } from '@/lib/abi/iro';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive({
    message: 'Royalty tokens must be > 0',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function IroForm() {
  const publicClient = usePublicClient();

  const [submit, setSubmit] = useState(false);

  const offeringPrice = useContractRead({
    address: IRO_ADDRESS,
    abi: IRO_ABI,
    functionName: 'offeringPrice',
    watch: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      royaltyTokens: 1,
    },
  });

  const approveStablecoins = useContractWrite({
    address: STABLECOIN_ADDRESS,
    abi: STABLECOIN_ABI,
    functionName: 'approve',
  });

  const buy = useContractWrite({
    address: IRO_ADDRESS,
    abi: IRO_ABI,
    functionName: 'buy',
  });

  function onSubmit(values: FormValues) {
    setSubmit(true);
  }

  async function onTrade(values: FormValues) {
    try {
      // approve stable coins
      const approveStableCoinsHash = await approveStablecoins.writeAsync({
        args: [IRO_ADDRESS, offeringPrice.data! * parseEther(values.royaltyTokens.toString())],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStableCoinsHash.hash,
      });
      toast.success('Stablecoins approved');
      // buy
      const buyHash = await buy.writeAsync({
        args: [parseEther(values.royaltyTokens.toString())],
      });
      await publicClient.waitForTransactionReceipt({
        hash: buyHash.hash,
      });
      toast.success('Royalty tokens bought');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initial Royalty Offering</CardTitle>
        <CardDescription>Provide how many royalty tokens you want to buy.</CardDescription>
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
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4">
            <Button type="submit">Buy</Button>
          </CardFooter>
          <AlertDialog onOpenChange={setSubmit} open={submit}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                {!offeringPrice.data ? (
                  <Skeleton className="h-[20px] w-[100px] rounded-full" />
                ) : (
                  <div>
                    You will pay{' '}
                    {formatEther(offeringPrice.data * parseEther(form.getValues('royaltyTokens').toString()))}$
                  </div>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onTrade(form.getValues())}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </Card>
  );
}
