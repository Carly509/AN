import type { Metadata } from 'next';
import { Providers } from './providers';
import { SidebarProvider } from '@/lib/context/SidebarContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sales Analytics Dashboard',
  description: 'Comprehensive sales analytics and performance tracking',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950">
        <SidebarProvider><Providers>{children}</Providers></SidebarProvider>
      </body>
    </html>
  );
}
