
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/spotlight-card';

interface DiscoveryCategoryCardProps {
  label: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * DiscoveryCategoryCard - Kinetic category node
 * Features spotlight tracking and adaptive scaling for mobile.
 */
export function DiscoveryCategoryCard({ 
  label, 
  description, 
  icon, 
  color, 
  isActive, 
  onClick 
}: DiscoveryCategoryCardProps) {
  return (
    <SpotlightCard 
      onClick={onClick}
      spotlightColor="rgba(255, 255, 255, 0.15)"
      className={cn(
        "group relative w-full aspect-square cursor-pointer transition-all duration-700 shadow-xl perspective-1000 border-white/5",
        isActive ? "ring-2 md:ring-4 ring-primary ring-offset-2 md:ring-offset-4 ring-offset-background scale-[1.02] md:scale-105" : "hover:scale-[1.02] md:hover:scale-105"
      )}
    >
      {/* Dynamic Background Layer */}
      <div 
        className="absolute inset-0 transition-opacity duration-700 opacity-80" 
        style={{ background: color }}
      />

      {/* Sliding Animated Layers */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute w-[70%] h-[70%] -bottom-[70%] -left-[70%] bg-white/10 border-t-2 border-r-2 border-white/20 rounded-[10%_13%_42%_0%/10%_12%_75%_0%] transition-all duration-1000 group-hover:bottom-[-1px] group-hover:left-[-1px]" />
        <div className="absolute w-[50%] h-[50%] -bottom-[50%] -left-[50%] bg-white/10 border-t-2 border-r-2 border-white/20 rounded-[10%_13%_42%_0%/10%_12%_75%_0%] transition-all duration-1000 delay-[0.2s] group-hover:bottom-[-1px] group-hover:left-[-1px]" />
      </div>

      {/* Floating Icon Node */}
      <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 text-2xl md:text-5xl transition-all duration-700 z-20 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:bottom-4 md:group-hover:bottom-6 group-hover:right-4 md:group-hover:right-6 drop-shadow-lg">
        {icon}
      </div>

      {/* Text Context Hub */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white z-20 space-y-0.5 pointer-events-none">
        <h3 className="text-sm md:text-2xl font-headline font-bold leading-none tracking-tight">{label}</h3>
        <p className="text-[7px] md:text-xs font-medium uppercase tracking-[0.1em] opacity-70 line-clamp-1">{description}</p>
      </div>

      {/* Active Indicator Overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] pointer-events-none z-[5]" />
      )}
    </SpotlightCard>
  );
}
