
"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import { Track } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ScrollToCurrentFabProps {
    nowPlaying: Track | null;
    onScrollToCurrent: () => void;
}

/**
 * High-fidelity Draggable FAB
 * Allows users to instantly navigate the repository to the active pattern.
 * Features drag-to-dismiss behavior and cinematic glow.
 */
export function ScrollToCurrentFab({ nowPlaying, onScrollToCurrent }: ScrollToCurrentFabProps) {
    const [isVisible, setIsVisible] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        if (nowPlaying) {
            setIsVisible(true);
            controls.start({ opacity: 1, scale: 1, x: 0 });
        } else {
            setIsVisible(false);
        }
    }, [nowPlaying, controls]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        const threshold = 150;
        if (Math.abs(info.offset.x) > threshold) {
            setIsVisible(false);
        } else {
            controls.start({ x: 0 }); 
        }
    };

    if (!isVisible || !nowPlaying) return null;

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragConstraints={{ 
              left: -window.innerWidth + 80, 
              right: 20, 
              top: -window.innerHeight + 120, 
              bottom: 20 
            }}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-32 right-8 z-[60]"
            whileTap={{ scale: 0.9 }}
        >
            <button
                onClick={onScrollToCurrent}
                className={cn(
                  "w-16 h-16 rounded-full liquid-glass border border-primary/30 text-primary shadow-3xl flex items-center justify-center relative overflow-hidden group transition-transform",
                  "hover:scale-110 active:scale-95"
                )}
                title="Synchronize view to active frequency"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Crosshair size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                
                {/* Visual Resonance Rings */}
                <div className="absolute inset-1.5 border border-white/10 rounded-full pointer-events-none" />
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping [animation-duration:3s] opacity-20" />
            </button>
        </motion.div>
    );
}
