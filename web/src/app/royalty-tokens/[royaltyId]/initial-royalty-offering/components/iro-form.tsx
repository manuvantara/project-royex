'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { useAccount, useContractRead, useContractWrite, usePublicClient } from 'wagmi';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/use-mounted';
import { IRO_ABI, IRO_ADDRESS } from '@/lib/abi/iro';
import { STABLECOIN_ABI, STABLECOIN_ADDRESS } from '@/lib/abi/stablecoin';

const formSchema = z.object({
  royaltyTokens: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

export default function IroForm() {
  const isMounted = useMounted();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const offeringPrice = useContractRead({
    address: IRO_ADDRESS,
    abi: IRO_ABI,
    functionName: 'offeringPrice',
  });

  function onSubmit(values: FormValues) {
    setOpen(true);
  }

  async function handleBuy(values: FormValues) {
    try {
      setIsLoading(true);

      const royaltyTokenAmount = parseEther(values.royaltyTokens.toString());
      const stablecoinAmount = offeringPrice.data! * royaltyTokenAmount;

      // approve stablecoins
      const approveStablecoinsResult = await approveStablecoins.writeAsync({
        args: [IRO_ADDRESS, stablecoinAmount],
      });
      await publicClient.waitForTransactionReceipt({
        hash: approveStablecoinsResult.hash,
      });
      toast.success(`${formatEther(stablecoinAmount)} stablecoin(s) approved`);

      // buy
      const buyResult = await buy.writeAsync({
        args: [royaltyTokenAmount],
      });
      await publicClient.waitForTransactionReceipt({
        hash: buyResult.hash,
      });
      toast.success(`${values.royaltyTokens} royalty token(s) bought`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
              name="royaltyTokens"
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
            <Button type="submit" disabled={isMounted && (isLoading || !offeringPrice.data)}>
              Buy
            </Button>
          </CardFooter>
          <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  <p>
                    You pay $
                    {!offeringPrice.data ? (
                      <Skeleton className="h-[20px] w-[20px] rounded-full" />
                    ) : (
                      <span className="text-xl">
                        {formatEther(offeringPrice.data * parseEther(form.getValues('royaltyTokens').toString()))}
                      </span>
                    )}
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleBuy(form.getValues())} disabled={!isConnected}>
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
