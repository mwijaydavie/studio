"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  className?: string;
}

/**
 * Precision Circular Text Engine
 * Optimized for high-density professional workstations with smaller, tighter typography.
 */
export function CircularText({ 
  text, 
  spinDuration = 20, 
  onHover = 'speedUp', 
  className 
}: CircularTextProps) {
  const letters = Array.from(text);
  const [isHovered, setIsHovered] = useState(false);

  const getSpinDuration = () => {
    if (!isHovered) return spinDuration;
    switch (onHover) {
      case 'slowDown': return spinDuration * 2;
      case 'speedUp': return spinDuration / 4;
      case 'goBonkers': return spinDuration / 10;
      case 'pause': return spinDuration; 
      default: return spinDuration;
    }
  };

  const currentDuration = getSpinDuration();

  return (
    <motion.div
      className={cn("relative flex items-center justify-center aspect-square", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ rotate: 360 }}
      transition={{
        rotate: {
          duration: currentDuration,
          ease: "linear",
          repeat: Infinity,
        }
      }}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        // Radius reduced further for a very tight, precision look
        const radius = 28; 
        
        return (
          <span
            key={i}
            className="absolute text-[4.5px] md:text-[5.5px] font-bold uppercase tracking-[0.3em] text-white/70 drop-shadow-[0_0_1px_rgba(255,255,255,0.1)] antialiased"
            style={{
              transform: `rotate(${rotationDeg}deg) translateY(-${radius}px)`,
              transformOrigin: `0 ${radius}px`
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}
