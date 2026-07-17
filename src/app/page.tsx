
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Music2, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { CircularText } from '@/components/ui/circular-text';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PyramidLoader } from '@/components/ui/pyramid-loader';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loadSpline, setLoadSpline] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoadSpline(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    router.push('/login');
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleEnter();
    }
    lastTapRef.current = now;
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!mounted) return <div className="h-screen w-screen bg-background" />;

  return (
    <main 
      className="relative h-screen w-screen overflow-hidden bg-background cursor-crosshair"
      onDoubleClick={handleDoubleTap}
      onTouchStart={handleDoubleTap}
    >
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* 3D ATMOSPHERE NODE */}
          <div className="absolute inset-0 backface-hidden flex items-center justify-center overflow-hidden">
            <div className="relative w-[115%] h-[115%] scale-110 overflow-hidden flex items-center justify-center">
              {loadSpline ? (
                <div className="relative w-full h-full overflow-hidden">
                  {/* scale-x-[-1] fixes mirrored text in the Spline scene */}
                  <iframe 
                    src='https://my.spline.design/3dtextbluecopy-vi4Sf0AqFNlD3V6aDwL1HzpY/' 
                    className="w-full h-full border-0 grayscale-[0.1] contrast-110 pointer-events-auto scale-x-[-1]"
                    title="AuraTune 3D Experience"
                  />
                  {/* WATERMARK ERASURE SHIELDS */}
                  <div className="absolute bottom-0 right-0 w-[25%] h-[15%] bg-background blur-3xl pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-full border-[20px] border-background pointer-events-none opacity-20" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
                  <PyramidLoader />
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60 animate-pulse">Synthesizing Atmosphere</p>
                </div>
              )}
            </div>
          </div>

          {/* BRAND FLIP SIDE */}
          <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] flex flex-col items-center justify-center bg-background/40 backdrop-blur-3xl">
            <div className="space-y-4 text-center">
              <div className="h-24 w-24 rounded-[2.5rem] liquid-glass flex items-center justify-center mx-auto shadow-3xl border-primary/20">
                <Music2 size={48} className="text-primary" />
              </div>
              <h1 className="text-7xl font-headline font-bold tracking-tighter text-foreground">
                Aura<span className="text-gradient">Tune</span>
              </h1>
              <p className="text-xs font-black uppercase tracking-[0.6em] text-primary/60">Professional Neural Studio</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 h-full w-full pointer-events-none">
        <div className="absolute top-6 left-6 pointer-events-auto">
          <div 
            onClick={handleEnter}
            className="h-8 w-8 rounded-xl liquid-glass flex items-center justify-center shadow-xl border border-border group cursor-pointer hover:border-primary/40 transition-all active:scale-95"
          >
            <Music2 size={12} className="text-primary group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="absolute bottom-6 right-6 pointer-events-auto">
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={toggleFlip}
              className="h-10 w-10 rounded-2xl liquid-glass border border-primary/20 flex items-center justify-center text-primary shadow-3xl hover:scale-110 active:rotate-180 transition-all"
            >
              <RotateCcw size={18} />
            </button>
            <div className="liquid-glass border-border px-4 py-2 rounded-xl shadow-3xl flex flex-col items-end gap-0.5 bg-background/80">
              <span className="text-[5px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Chief Architect</span>
              <h2 className="text-[7px] font-headline font-bold text-foreground tracking-tighter uppercase whitespace-nowrap">Aura Systems Node</h2>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="relative group">
            <button 
              onClick={handleEnter}
              className="relative h-10 w-10 rounded-full overflow-hidden grid place-content-center bg-primary transition-all duration-500 hover:scale-110 shadow-2xl shadow-primary/40 active:scale-95 border border-border group-hover:border-primary/40"
            >
              <CircularText 
                text="ENTER STUDIO SYNC " 
                spinDuration={18} 
                onHover="speedUp" 
                className="absolute inset-0 z-0 scale-110" 
              />
              <div className="relative z-10 h-2 w-2 bg-white rounded-full flex items-center justify-center text-primary group-hover:text-white group-hover:bg-primary transition-all duration-300">
                <ChevronRight size={6} strokeWidth={4} />
              </div>
            </button>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[4px] font-black uppercase tracking-[0.4em] text-white/30">Double-tap anywhere to enter</div>
          </div>
        </div>
      </div>
    </main>
  );
}
