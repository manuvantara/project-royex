'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { PopoverProps } from '@radix-ui/react-popover';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMutationObserver } from '@/hooks/use-mutation-observer';
import { cn } from '@/lib/utils';
import { ProposalTemplate, TemplateType } from '../data/templates';

interface TemplateSelectorProps extends PopoverProps {
  types: readonly TemplateType[];
  templates: ProposalTemplate[];
}

export default function TemplateSelector({ templates, types, ...props }: TemplateSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<ProposalTemplate>(templates[0]);
  const [peekedTemplate, setPeekedTemplate] = React.useState<ProposalTemplate>(templates[0]);

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="template">Template</Label>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          The model which will generate the completion. Some models are suitable for natural language tasks, others
          specialize in code. Learn more.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a template"
            className="w-full justify-between"
          >
            {selectedTemplate ? selectedTemplate.name : 'Select a template...'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent side="left" align="start" forceMount className="min-h-[280px]">
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">{peekedTemplate.name}</h4>
                <div className="text-sm text-muted-foreground">{peekedTemplate.description}</div>
                {peekedTemplate.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">Strengths</h5>
                    <ul className="text-sm text-muted-foreground">{peekedTemplate.strengths}</ul>
                  </div>
                ) : null}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Search Templates..." />
                <CommandEmpty>No Templates found.</CommandEmpty>
                <HoverCardTrigger />
                {types.map((type) => (
                  <CommandGroup key={type} heading={type}>
                    {templates
                      .filter((x) => x.type === type)
                      .map((x) => (
                        <TemplateItem
                          key={x.id}
                          template={x}
                          isSelected={selectedTemplate?.id === x.id}
                          onPeek={(template) => setPeekedTemplate(template)}
                          onSelect={() => {
                            setSelectedTemplate(x);
                            setOpen(false);
                          }}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface TemplateItemProps {
  template: ProposalTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (template: ProposalTemplate) => void;
}

function TemplateItem({ template, isSelected, onSelect, onPeek }: TemplateItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.target.attributes.getNamedItem('aria-selected')?.value === 'true') {
          onPeek(template);
        }
      }
    }
  });

  return (
    <CommandItem
      key={template.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {template.name}
      <CheckIcon className={cn('ml-auto h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
    </CommandItem>
  );
}
