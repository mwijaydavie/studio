
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Search, Library, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Zap, label: "Reels", href: "/reels" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  // Hide on specific full-screen experience nodes
  if (pathname === '/login' || pathname === '/drive' || pathname === '/') return null;

  return (
    <div className="md:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 px-4 pointer-events-none">
      <nav aria-label="App navigation" className="max-w-md mx-auto h-16 bg-background/90 backdrop-blur-2xl border border-border/80 rounded-full shadow-[0_12px_40px_rgba(0,0,0,.35)] flex items-center justify-between px-2 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/library' && pathname?.includes('/library'));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex-1 flex justify-center items-center h-full"
            >
              {isActive ? (
                <motion.div
                  layoutId="active-pill"
                  className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full shadow-lg shadow-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <item.icon className="h-4 w-4 text-primary-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-primary-foreground">
                    {item.label}
                  </span>
                </motion.div>
              ) : (
                <div className="p-2 text-white/40 hover:text-white/60 transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
