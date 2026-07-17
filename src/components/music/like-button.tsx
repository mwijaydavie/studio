
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
}

export function LikeButton({ isActive, onClick, size = 40 }: LikeButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Critical for workstation gesture zones
    onClick(e);
  };

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer group pointer-events-auto"
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Heart Outline */}
        <svg 
          viewBox="0 0 24 24" 
          className={cn(
            "absolute transition-all duration-300",
            isActive ? "opacity-0 scale-50" : "opacity-100 scale-100"
          )}
          style={{ fill: 'rgb(255, 91, 137)', width: '60%', height: '60%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
        </svg>

        {/* Heart Filled */}
        <svg 
          viewBox="0 0 24 24" 
          className={cn(
            "absolute transition-all duration-500",
            isActive ? "opacity-100 scale-110" : "opacity-0 scale-50"
          )}
          style={{ fill: 'rgb(255, 91, 137)', width: '60%', height: '60%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
        </svg>
      </div>
    </div>
  );
}
