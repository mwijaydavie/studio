
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  textAlign?: 'left' | 'center' | 'right';
  tag?: keyof JSX.IntrinsicElements;
  onAnimationComplete?: () => void;
}

/**
 * High-performance SplitText using core GSAP.
 * Provides staggered character entrance without paid plugin dependencies.
 */
export function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  textAlign = 'center',
  tag: Tag = 'p',
  onAnimationComplete
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (document.fonts) {
        document.fonts.ready.then(() => setFontsLoaded(true));
      } else {
        setFontsLoaded(true);
      }
    }
  }, []);

  useGSAP(() => {
    if (!containerRef.current || !fontsLoaded) return;

    const chars = containerRef.current.querySelectorAll('.split-char');
    
    gsap.fromTo(chars, from, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      scrollTrigger: {
        trigger: containerRef.current,
        start: `top ${100 - (threshold * 100)}%`,
        once: true,
      },
      onComplete: onAnimationComplete
    });
  }, { dependencies: [text, fontsLoaded], scope: containerRef });

  return (
    <Tag 
      ref={containerRef} 
      className={className}
      style={{ textAlign, display: 'inline-block' }}
    >
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="split-char inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
}
