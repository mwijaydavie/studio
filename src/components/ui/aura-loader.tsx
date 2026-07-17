"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AuraLoaderProps {
  text?: string;
  className?: string;
}

export function AuraLoader({ text = "AuraLoading", className }: AuraLoaderProps) {
  const letters = text.split("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="relative flex items-center justify-center h-[120px] w-auto scale-150 md:scale-[2]">
        <div className="flex gap-0.5">
          {letters.map((char, i) => (
            <span 
              key={i} 
              className="inline-block opacity-0 animate-letter font-headline font-bold text-foreground"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Animated Aura Background Mask - Extracted to CSS to avoid extension interference */}
        <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20">
          <div className="absolute inset-0 w-full h-full bg-transparent aura-loader-bg-mask" />
          <div className="absolute inset-0 w-full h-full aura-loader-gradient" />
        </div>
      </div>
    </div>
  );
}