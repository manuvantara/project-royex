'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import { useContractRead, useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { STAKEHOLDER_ADDRESS, STAKEHOLDER_COLLECTIVE_ABI, ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/config/contracts';

const FormSchema = z.object({
  vote: z.enum(['for', 'against', 'abstain'], {
    required_error: 'You need to select a vote option.',
  }),
});

function formatVotes(votes: bigint) {
  const parsed = formatEther(votes);

  return Intl.NumberFormat('en-US', {
    compactDisplay: 'short',
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(Number(parsed));
}

export default function CastVote({ proposalId }: { proposalId: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { address, isConnected } = useAccount();

  const { data: votes } = useContractRead({
    abi: ROYALTY_TOKEN_ABI,
    address: ROYALTY_TOKEN_ADDRESS,
    args: [address!],
    enabled: isConnected && !!address,
    functionName: 'getVotes',
  });

  const { write, data } = useContractWrite({
    abi: STAKEHOLDER_COLLECTIVE_ABI,
    address: STAKEHOLDER_ADDRESS,
    functionName: 'castVote',
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading('Voting...');
    }

    if (isSuccess) {
      toast.success('Voted!');
    }
  }, [isLoading, isSuccess]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    switch (data.vote) {
      case 'for':
        write?.({ args: [BigInt(proposalId), 1] });
        break;
      case 'against':
        write?.({ args: [BigInt(proposalId), -1] });
        break;
      case 'abstain':
        write?.({ args: [BigInt(proposalId), 0] });
        break;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Cast vote</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Cast vote</DialogTitle>
          <DialogDescription>Please select your vote for the proposal below.</DialogDescription>
        </DialogHeader>
        <Separator />
        <div>Voting power: {formatVotes(votes ?? BigInt(0))}</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="vote"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="for" />
                        </FormControl>
                        <FormLabel className="font-normal">For</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="against" />
                        </FormControl>
                        <FormLabel className="font-normal">Against</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="abstain" />
                        </FormControl>
                        <FormLabel className="font-normal">Abstain</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!form.formState.isValid} type="submit" className="w-fit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
