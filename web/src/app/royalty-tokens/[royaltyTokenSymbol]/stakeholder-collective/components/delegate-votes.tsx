import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROYALTY_TOKEN_ABI, ROYALTY_TOKEN_ADDRESS } from '@/config/contracts';
import { Explorers } from '@/config/explorers';

export default function DelegateVotes() {
  const [open, setOpen] = useState(false);
  const [switchDelegateForm, setSwitchDelegateForm] = useState(true);
  const [delegateAddress, setDelegateAddress] = useState<`0x${string}`>('0x0');
  const { address } = useAccount();

  const { data: delegatee } = useContractRead({
    abi: ROYALTY_TOKEN_ABI,
    address: ROYALTY_TOKEN_ADDRESS,
    args: [address!],
    enabled: !!address,
    functionName: 'delegates',
    watch: true,
  });

  const { write, data } = useContractWrite({
    abi: ROYALTY_TOKEN_ABI,
    address: ROYALTY_TOKEN_ADDRESS,
    functionName: 'delegate',
  });

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccessful } = useWaitForTransaction({
    hash: data?.hash,
  });

  const openDelegateDialog = () => {
    setSwitchDelegateForm(true);
  };

  const closeDelegateDialog = () => {
    setSwitchDelegateForm((prevValue) => !prevValue);
  };

  const delegateToSomeone = () => {
    setSwitchDelegateForm((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (isTransactionLoading) {
      toast.loading('Delegating...');
    }

    if (isTransactionSuccessful) {
      toast.success('Successfully delegated');
    }
  }, [isTransactionLoading, isTransactionSuccessful]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={openDelegateDialog} suppressHydrationWarning>
          Delegate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onCloseAutoFocus={closeDelegateDialog}>
        <DialogHeader>
          <DialogTitle>Delegate voting power</DialogTitle>
        </DialogHeader>
        {delegatee && switchDelegateForm && (
          <div className="text-muted-foreground">
            You currently delegate to{' '}
            <Link href={`${Explorers['aurora-testnet']}/address/${delegatee}`} target="_blank">
              {delegatee.slice(0, 6)}...{delegatee.slice(-4)}
            </Link>
          </div>
        )}
        <div className="grid gap-4 py-4">
          {switchDelegateForm ? (
            <>
              <Button
                onClick={() =>
                  write({
                    args: [address!],
                  })
                }
                disabled={!write || !address}
              >
                Myself
              </Button>
              <Button onClick={delegateToSomeone} variant="outline">
                Someone
              </Button>
            </>
          ) : (
            <>
              <Label htmlFor="delegatee">Delegatee address</Label>
              <Input
                id="delegatee"
                placeholder="0xC37713ef41Aff1A7ac1c3D02f6f0B3a57F8A3091"
                type="text"
                value={delegateAddress}
                onChange={(e) => setDelegateAddress(e.target.value as `0x${string}`)}
              />
              <Button
                onClick={() =>
                  write({
                    args: [delegateAddress],
                  })
                }
                disabled={!write}
              >
                Delegate votes
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
