'use client';

import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const examples = [
  {
    name: 'Initial Royalty Offering',
    href: 'initial-royalty-offering',
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/examples/dashboard',
  },
  {
    name: 'OTC Market',
    href: 'otc-market',
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/examples/cards',
  },
  {
    name: 'Royalty Exchange',
    href: 'royalty-exchange',
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/examples/tasks',
  },
  {
    name: 'Royalty Payments Pool',
    href: 'royalty-payments-pool',
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/examples/playground',
  },
  {
    name: 'Collective',
    href: 'collective',
    code: 'https://github.com/shadcn/ui/tree/main/apps/www/app/examples/forms',
  },
];

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Navbar({ className, ...props }: Props) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('mb-4 flex items-center', className)} {...props}>
          {examples.map((example) => (
            <Link
              href={example.href}
              key={example.href}
              className={cn(
                'flex items-center px-4',
                pathname?.includes(example.href) ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'
              )}
            >
              {example.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <CodeLink pathname={pathname} />
    </div>
  );
}

interface CodeLinkProps {
  pathname: string | null;
}

export function CodeLink({ pathname }: CodeLinkProps) {
  const example = examples.find((example) => pathname?.startsWith(example.href));

  if (!example?.code) {
    return null;
  }

  return (
    <Link
      href={example?.code}
      target="_blank"
      rel="nofollow"
      className="absolute right-0 top-0 hidden items-center rounded-[0.5rem] text-sm font-medium md:flex"
    >
      View code
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </Link>
  );
}
