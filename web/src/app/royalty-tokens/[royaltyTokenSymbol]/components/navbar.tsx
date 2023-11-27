'use client';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMemo } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Explorers } from '@/config/explorers';
import { cn } from '@/lib/utils';

type Link = {
  name: string;
  href: string;
  contractAddress: string | null;
};

type Props = React.HTMLAttributes<HTMLDivElement> & {
  contractAddresses: string[];
  royaltyTokenSymbol: string;
};

export default function Navbar({ className, contractAddresses, royaltyTokenSymbol, ...props }: Props) {
  const pathname = usePathname();

  const links = useMemo(() => {
    return [
      {
        name: 'Royalty Payment Pool',
        href: `/royalty-tokens/${royaltyTokenSymbol}/royalty-payment-pool`,
        contractAddress: contractAddresses[0],
      },
      {
        name: 'Stakeholder Collective',
        href: `/royalty-tokens/${royaltyTokenSymbol}/stakeholder-collective`,
        contractAddress: contractAddresses[1],
      },
      {
        name: 'OTC Market',
        href: `/royalty-tokens/${royaltyTokenSymbol}/otc-market`,
        contractAddress: contractAddresses[2],
      },
      {
        name: 'Initial Royalty Offering',
        href: `/royalty-tokens/${royaltyTokenSymbol}/initial-royalty-offering`,
        contractAddress: contractAddresses[3],
      },
      {
        name: 'Royalty Exchange',
        href: `/royalty-tokens/${royaltyTokenSymbol}/royalty-exchange`,
        contractAddress: contractAddresses[4],
      },
    ];
  }, [contractAddresses, royaltyTokenSymbol]);

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
      <ContractLink links={links} pathname={pathname} />
    </div>
  );
}

export function ContractLink({ links, pathname }: { pathname: string | null; links: Link[] }) {
  const link = links.find((link) => pathname?.includes(link.href));

  if (!link?.contractAddress) {
    return null;
  }

  return (
    <Link
      href={`${Explorers['aurora-testnet']}/address/${link.contractAddress}`}
      target="_blank"
      rel="nofollow"
      className="absolute right-0 top-0 hidden items-center rounded-[0.5rem] text-sm font-medium md:flex"
    >
      View contract
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
