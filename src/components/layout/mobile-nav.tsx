
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
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className="max-w-md mx-auto h-16 bg-[#09080A] border border-white/10 rounded-full shadow-2xl flex items-center justify-between px-2 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/library' && pathname?.includes('/library'));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex-1 flex justify-center items-center h-full"
            >
              {isActive ? (
                <motion.div
                  layoutId="active-pill"
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <item.icon className="h-4 w-4 text-black fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-tight text-black">
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
