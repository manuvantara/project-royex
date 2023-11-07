import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import ConnectButton from './connect-button';
import Navbar from './navbar';
import { Button } from './ui/button';
import { siteConfig } from '@/config/site';
// import { MobileNav } from "@/components/mobile-nav"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Navbar />
        {/* <MobileNav /> */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            <Button className="w-9 px-0" variant="ghost" asChild>
              <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <GitHubLogoIcon className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <ConnectButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
