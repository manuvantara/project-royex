'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader, PageHeaderHeading } from '@/components/ui/page-header';
import { COLLECTIVE_ABI, COLLECTIVE_ADDRESS } from '@/lib/abi/collective';
import Editor from './components/editor';
import TemplateSelector from './components/template-selector';

import { proposalTemplates, templateTypes } from './data/templates';

export default function Page() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { config } = usePrepareContractWrite({
    abi: COLLECTIVE_ABI,
    address: COLLECTIVE_ADDRESS,
    functionName: 'propose',
    args: [[COLLECTIVE_ADDRESS], [BigInt(0)], ['0x00'], JSON.stringify({ title, description })],
    enabled: Boolean(title) && Boolean(description)
  });

  const { write, data } = useContractWrite(config);

  const { isError, isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading('Creating proposal...');
    }

    if (isSuccess) {
      toast.success('Proposal created');
    }

    if (isError) {
      toast.error('Error creating proposal');
    }
  }, [isLoading, isSuccess, isError]);

  return (
    <div className="px-4 pb-8">
      <PageHeader className="px-0 pb-8">
        <PageHeaderHeading className="text-2xl md:text-3xl">Create a new proposal.</PageHeaderHeading>
      </PageHeader>
      <div className="flex h-full flex-col">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="My awesome proposal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid h-full items-start gap-6 py-6 md:grid-cols-[1fr_350px]">
          <Editor onUpdate={(value) => setDescription(value)} />
          <div className="grid items-start gap-6">
            <TemplateSelector templates={proposalTemplates} types={templateTypes} />
            <Button
              disabled={!write || isLoading}
              onClick={() => {
                write?.();
              }}
            >
              Create proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
