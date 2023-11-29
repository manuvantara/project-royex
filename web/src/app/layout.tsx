import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Providers from './providers';

const sans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
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
    <html lang="en" className="dark-theme">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground',
          sans.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <Suspense>
              <main className="flex-1">{children}</main>
            </Suspense>
            <Footer />
          </div>
        </Providers>
        <Toaster
          theme="dark"
          closeButton={true}
          richColors={true}
          toastOptions={{
            classNames: {
              toast: 'bg-background font-sans',
              title: 'text-foreground text-sm',
              description: 'text-muted-foreground',
              success: 'bg-primary text-primary-foreground',
              error: 'bg-destructive text-destructive-foreground',
            },
          }}
        />
      </body>
    </html>
  );
}
