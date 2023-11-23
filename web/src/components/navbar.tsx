'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
          <rect width="256" height="256" fill="none" />
          <line
            x1="208"
            y1="128"
            x2="128"
            y2="208"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
          <line
            x1="192"
            y1="40"
            x2="40"
            y2="192"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          />
        </svg>
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/royalty-tokens"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname.includes('royalty-tokens') ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Royalty Tokens
        </Link>
        <Link
          href="/portfolio"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/portfolio') ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Portfolio
        </Link>
        <Link
          href="https://forms.gle/9Dk5X5oC9uJyDmS4A"
          target="_blank"
          rel="noreferrer"
          className="text-foreground/60 transition-colors hover:text-foreground/80"
        >
          RTGE Application
        </Link>
      </nav>
    </div>
  );
}
