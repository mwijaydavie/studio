
"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
  index: number;
}

const AnimatedItem = ({ children, delay = 0, index }: AnimatedItemProps) => {
  const ref = useRef(null);
  // Optimized: amount threshold reduced for faster triggering
  const inView = useInView(ref, { amount: 0.1, triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: Math.min(delay * (index % 10), 0.5), ease: "easeOut" }}
      className="mb-4"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  children: React.ReactNode[];
  showGradients?: boolean;
  className?: string;
  displayScrollbar?: boolean;
}

export function AnimatedList({
  children,
  showGradients = true,
  className = '',
  displayScrollbar = true,
}: AnimatedListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    setTopGradientOpacity(Math.min(scrollTop / 100, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 100, 1));
  }, []);

  useEffect(() => {
    if (listRef.current) {
      const { scrollHeight, clientHeight } = listRef.current;
      setBottomGradientOpacity(scrollHeight > clientHeight ? 1 : 0);
    }
  }, [children]);

  return (
    <div className={`scroll-list-container ${className}`}>
      <div 
        ref={listRef} 
        className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : 'scrollbar-hide'}`} 
        onScroll={handleScroll}
      >
        {React.Children.map(children, (child, index) => (
          <AnimatedItem
            key={index}
            delay={0.03}
            index={index}
          >
            {child}
          </AnimatedItem>
        ))}
      </div>
      
      {showGradients && (
        <>
          <div className="top-gradient" style={{ opacity: topGradientOpacity }}></div>
          <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
}
