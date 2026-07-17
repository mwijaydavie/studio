import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, ArrowLeft } from 'lucide-react';

/**
 * Static path generator for APK builds.
 * Ensures the 'output: export' configuration can resolve dynamic profile paths.
 */
export async function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function PublicProfilePage() {
  return (
    <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center shadow-2xl">
        <BrainCircuit className="h-12 w-12 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-headline font-bold text-white tracking-tighter">Social Node Offline</h2>
        <p className="text-muted-foreground max-w-xs mx-auto italic leading-relaxed">
          "The Communal Architect Network is currently restricted in the local APK build to ensure maximum hardware stability."
        </p>
      </div>
      <Button 
        asChild
        className="rounded-2xl h-14 px-10 bg-primary text-white font-bold uppercase tracking-widest text-[10px]"
      >
        <Link href="/dashboard">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
