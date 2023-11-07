import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { siteConfig } from '../config/site';
import Providers from './providers';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { cn } from '@/lib/utils';

const sans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', sans.variable)}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
