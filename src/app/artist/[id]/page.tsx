
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic2, ArrowLeft, Star } from 'lucide-react';

/**
 * Artist profile node - optimized for Android 15 static export.
 */
export async function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function ArtistPage() {
  return (
    <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-6 p-8 text-center overflow-hidden">
      <div className="aura-bg">
        <div className="aura-blob bg-primary/20 top-1/4 left-1/4" />
      </div>
      
      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-3xl">
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
           <Mic2 className="h-16 w-16 text-primary" />
        </div>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-2 px-4 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 w-fit mx-auto">
          <Star size={12} className="text-yellow-500 fill-current" />
          <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500">Verified Architect</span>
        </div>
        <h2 className="text-5xl font-headline font-bold text-white tracking-tighter">Artist Node Sync</h2>
        <p className="text-muted-foreground max-w-xs mx-auto italic leading-relaxed">
          "Direct artist discovery is being recalibrated for Android 15. Local nodes remain accessible in your Repository."
        </p>
      </div>
      
      <Button 
        asChild
        className="rounded-2xl h-14 px-10 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary transition-all"
      >
        <Link href="/dashboard">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}
