
'use client';

import React from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { MusicProvider } from '@/context/music-context';

/**
 * Centralized Providers wrapper to ensure correct nesting 
 * and avoid context errors in the global layout.
 * The order is critical: Firebase must be available to MusicProvider.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <MusicProvider>
        {children}
      </MusicProvider>
    </FirebaseClientProvider>
  );
}
