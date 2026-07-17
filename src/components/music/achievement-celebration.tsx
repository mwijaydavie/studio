
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AchievementCelebration() {
  const [activeAchievement, setActiveAchievement] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setActiveAchievement(e.detail);
      setTimeout(() => setActiveAchievement(null), 6000);
    };
    window.addEventListener('aura-achievement', handler);
    return () => window.removeEventListener('aura-achievement', handler);
  }, []);

  return (
    <AnimatePresence>
      {activeAchievement && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-6">
          {/* Confetti Explosion (Simplified SVG Particles) */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1, 
                  x: (Math.random() - 0.5) * 1000, 
                  y: (Math.random() - 0.5) * 1000,
                  rotate: 360
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 h-4 w-4 rounded-sm bg-primary"
                style={{ backgroundColor: i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--accent))' }}
              />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="relative pointer-events-auto liquid-glass border-primary/40 bg-primary/10 rounded-[3rem] p-10 max-w-sm w-full text-center space-y-6 shadow-[0_0_100px_rgba(162,76,241,0.3)]"
          >
            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center shadow-2xl animate-float">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                <Sparkles className="h-3 w-3" /> Neural Milestone
              </div>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tighter">
                {activeAchievement.title}
              </h2>
              <p className="text-muted-foreground text-sm italic">
                "{activeAchievement.description}"
              </p>
            </div>

            <Button 
              onClick={() => setActiveAchievement(null)}
              className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]"
            >
              Continue Session
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
