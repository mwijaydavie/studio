
"use client";

import React from 'react';
import { useMusic } from '@/context/music-context';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Premium Spectral Switch
 * High-fidelity toggle node for shifting between interface spectrums.
 */
export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode, themeColor, playUISound } = useMusic();

  const handleToggle = () => {
    playUISound('switch');
    toggleDarkMode();
  };

  return (
    <button 
      onClick={handleToggle}
      className={cn(
        "relative h-9 w-16 rounded-full p-1 transition-all duration-500 overflow-hidden group border",
        isDarkMode 
          ? "bg-zinc-900 border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" 
          : "bg-zinc-100 border-black/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
      )}
      title={isDarkMode ? "Shift to Light Spectrum" : "Shift to Dark Spectrum"}
    >
      {/* Animated Aura Background */}
      <div className={cn(
        "absolute inset-0 opacity-20 blur-md transition-opacity duration-500",
        isDarkMode ? "bg-primary" : "bg-orange-400"
      )} />

      {/* The Sliding Node */}
      <div className={cn(
        "relative z-10 h-full w-7 rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-lg",
        isDarkMode 
          ? "translate-x-7 bg-primary text-white" 
          : "translate-x-0 bg-white text-orange-500"
      )}>
        {isDarkMode ? (
          <Moon size={12} className="fill-current animate-in zoom-in duration-300" />
        ) : (
          <Sun size={12} className="fill-current animate-in zoom-in duration-300" />
        )}
      </div>

      {/* Background Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles 
          size={8} 
          className={cn(
            "absolute top-2 left-3 transition-opacity duration-500",
            isDarkMode ? "opacity-40 text-white" : "opacity-0"
          )} 
        />
        <Sparkles 
          size={6} 
          className={cn(
            "absolute bottom-2 right-3 transition-opacity duration-500",
            isDarkMode ? "opacity-20 text-white" : "opacity-0"
          )} 
        />
      </div>
    </button>
  );
}
