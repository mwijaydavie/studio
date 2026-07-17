
"use client";

import React, { useEffect, useState } from 'react';
import { Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PyramidLoader } from './pyramid-loader';
import { useUser } from '@/firebase';

export function SplashScreen() {
  const { isUserLoading } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Splash sequence duration depends on auth stabilizer
    if (!isUserLoading) {
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => setIsVisible(false), 800);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isUserLoading, mounted]);

  if (!isVisible || !mounted) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[500] flex flex-col items-center justify-center bg-background transition-opacity duration-1000",
      isFading ? "opacity-0" : "opacity-100"
    )}>
      {/* Immersive Background Atmosphere */}
      <div className="aura-bg">
        <div className="aura-blob bg-primary/30 top-1/4 left-1/4 w-[60vw] h-[60vw]" />
        <div className="aura-blob bg-accent/20 bottom-1/4 right-1/4 w-[50vw] h-[50vw]" style={{ animationDelay: '-5s' }} />
      </div>

      <div className="relative flex flex-col items-center gap-12 animate-fade-in">
        {/* Animated Pyramid Synthesis */}
        <PyramidLoader />
        
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl liquid-glass flex items-center justify-center mx-auto mb-6 shadow-2xl border-white/10">
            <Music2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-headline font-bold tracking-tighter text-white">
              Aura<span className="text-gradient">Tune</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] font-black opacity-50 animate-pulse">
              {isUserLoading ? "Stabilizing Identity Node" : "Synchronizing Soundscape"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
