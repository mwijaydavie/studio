
"use client";

import React from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#A24CF1', '#3b82f6', '#10b981', '#f43f5e', '#ffffff'];

export function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 1, 
            scale: 0, 
            x: '50vw', 
            y: '50vh' 
          }}
          animate={{ 
            opacity: [1, 1, 0], 
            scale: Math.random() * 1.5 + 0.5, 
            x: `${Math.random() * 100}vw`, 
            y: `${Math.random() * 100}vh`,
            rotate: Math.random() * 720
          }}
          transition={{ 
            duration: 2.5, 
            ease: "easeOut",
            delay: Math.random() * 0.2
          }}
          className="absolute h-3 w-3 rounded-sm"
          style={{ 
            backgroundColor: COLORS[i % COLORS.length],
            boxShadow: `0 0 10px ${COLORS[i % COLORS.length]}`
          }}
        />
      ))}
    </div>
  );
}
