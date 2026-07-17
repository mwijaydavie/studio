
"use client";

import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/ui/splash-screen';
import { MobileNav } from '@/components/layout/mobile-nav';
import { CommandK } from '@/components/music/command-k';
import { useMusic } from '@/context/music-context';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { AchievementCelebration } from '@/components/music/achievement-celebration';
import { ExitDialog } from '@/components/ui/exit-dialog';
import { App as CapacitorApp } from '@capacitor/app';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { 
    fontFamily, isHighContrast, themeColor, isDarkMode, 
    fontSizeMultiplier, blurIntensity, neonGlow, 
    isFullPlayer, setIsFullPlayer, setExitDialogOpen
  } = useMusic();
  
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === '/';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // CAPACITOR HARDWARE BACK BUTTON LOGIC
    const handleBackButton = async () => {
      if (isFullPlayer) {
        setIsFullPlayer(false);
        return;
      }

      if (pathname === '/dashboard') {
        setExitDialogOpen(true);
      } else if (pathname === '/' || pathname === '/login') {
        setExitDialogOpen(true);
      } else {
        router.back();
      }
    };

    const backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      backButtonListener.then(l => l.remove());
    };
  }, [isFullPlayer, pathname, router, setIsFullPlayer, setExitDialogOpen]);

  useEffect(() => {
    if (!mounted) return;
    
    const classes = ['theme-purple', 'theme-blue', 'theme-emerald', 'theme-rose', 'theme-custom'];
    document.documentElement.classList.remove(...classes);
    document.body.classList.remove(...classes);
    
    const themeClass = `theme-${themeColor}`;
    document.documentElement.classList.add(themeClass);
    document.body.classList.add(themeClass);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [themeColor, isDarkMode, mounted]);

  const getFontFamily = () => {
    if (!mounted) return 'var(--font-headline)';
    switch (fontFamily) {
      case 'Inter': return 'var(--font-body)';
      case 'JetBrains Mono': return 'monospace';
      case 'Syne': return 'sans-serif';
      default: return 'var(--font-headline)';
    }
  };

  const bodyClasses = cn(
    "antialiased selection:bg-primary/30 overflow-x-hidden min-h-screen relative transition-colors duration-500",
    mounted && isHighContrast ? 'contrast-125 saturate-150' : '',
    mounted && neonGlow.enabled ? `neon-active neon-${neonGlow.style}` : '',
    mounted && isDarkMode ? 'dark' : ''
  );

  return (
    <div 
      className={bodyClasses}
      style={{ 
        fontFamily: getFontFamily(),
        fontSize: mounted ? `${fontSizeMultiplier}rem` : '1rem',
        ['--blur-intensity' as any]: mounted ? `${blurIntensity}%` : '100%'
      }}
    >
      {!isLanding && <SplashScreen />}
      
      <div className="aura-bg" style={{ filter: mounted ? `blur(calc(120px * var(--blur-intensity) / 100))` : 'blur(60px)' }}>
        <div className="aura-blob bg-primary/10 top-[-10%] left-[-10%] w-[60vw] h-[60vw]" />
        <div className="aura-blob bg-accent/8 bottom-[-10%] right-[-10%] w-[50vw] h-[50vw]" style={{ animationDelay: '-7s' }} />
        <div className="aura-blob bg-purple-600/5 top-[30%] right-[15%] w-[40vw] h-[40vw]" style={{ animationDelay: '-12s' }} />
      </div>

      <div className="relative z-10 h-full w-full">
        {!isLanding && <CommandK />}
        <AchievementCelebration />
        <ExitDialog />
        {children}
        {!isLanding && <MobileNav />}
      </div>
    </div>
  );
}
