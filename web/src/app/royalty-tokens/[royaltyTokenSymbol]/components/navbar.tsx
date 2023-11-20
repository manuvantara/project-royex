'use client';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Explorers } from '@/config/explorers';
import { cn } from '@/lib/utils';

const links = [
  {
    name: 'Initial Royalty Offering',
    href: 'initial-royalty-offering',
  },
  {
    name: 'OTC Market',
    href: 'otc-market',
  },
  {
    name: 'Royalty Exchange',
    href: 'royalty-exchange',
  },
  {
    name: 'Royalty Payment Pool',
    href: 'royalty-payment-pool',
  },
  {
    name: 'Stakeholder Collective',
    href: 'stakeholder-collective',
  },
];

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  contractAddress: string;
}

export default function Navbar({ className, contractAddress, ...props }: Props) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                'flex items-center px-4',
                pathname?.includes(link.href) ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <ContractLink contractAddress={contractAddress} />
    </div>
  );
}

export function ContractLink({ contractAddress }: { contractAddress: string }) {
  if (!contractAddress) {
    return null;
  }

  return (
    <Link
      href={`${Explorers['aurora-testnet']}/address/${contractAddress}`}
      target="_blank"
      rel="nofollow"
      className="absolute right-0 top-0 hidden items-center rounded-[0.5rem] text-sm font-medium md:flex"
    >
      View contract
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
