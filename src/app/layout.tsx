
import React from 'react';
import './globals.css';
import { Metadata, Viewport } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { Providers } from '@/components/layout/providers';
import RootLayoutClient from '@/components/layout/root-layout-client';

export const metadata: Metadata = {
  title: 'AuraTune Pro Workstation | High-Fidelity AI Studio',
  description: 'The definitive high-density professional AI music studio and visual pattern manager. Built for Architects of the future sound.',
  keywords: 'music, studio, ai, genkit, workstation, audio effects, offline music player',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AuraTune',
  },
  openGraph: {
    title: 'AuraTune Pro Workstation',
    description: 'High-fidelity AI sound synthesis and architectural repository.',
    url: 'https://auratune.app',
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
  themeColor: '#A24CF1',
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
