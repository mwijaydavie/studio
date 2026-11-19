
import React from 'react';
import './globals.css';
import { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/components/layout/providers';
import RootLayoutClient from '@/components/layout/root-layout-client';

export const metadata: Metadata = {
  title: 'AuraTune — Music for your mood',
  description: 'Discover new sounds and make a music library that feels like yours.',
  keywords: 'music, discovery, listening, playlists, audio',
  icons: {
    icon: '/icons/aura-icon.svg',
    apple: '/icons/aura-icon.svg',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraTune',
  },
  openGraph: {
    title: 'AuraTune — Music for your mood',
    description: 'Discover new sounds and make a music library that feels like yours.',
    siteName: 'AuraTune',
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#09080d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
