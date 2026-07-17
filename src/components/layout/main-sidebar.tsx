
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMusic } from '@/context/music-context';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  Home, 
  Search, 
  Compass, 
  Library, 
  Heart, 
  PlusSquare, 
  Music2, 
  Mic2,
  Settings,
  ListMusic,
  ChevronLeft,
  ChevronRight,
  Zap,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/music/theme-toggle';

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Compass, label: "Discover", href: "/discover" },
  { icon: Zap, label: "Reels", href: "/reels" },
  { icon: Smartphone, label: "Simple Mode", href: "/drive" },
];

const libraryItems = [
  { icon: Library, label: "Library", href: "/library" },
  { icon: Heart, label: "Liked", href: "/library?tab=favorites" },
  { icon: Mic2, label: "Artists", href: "/library?tab=artists" },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { user, firestore } = useFirebase();
  const { playlists, createPlaylist, isSidebarCollapsed, toggleSidebar } = useMusic();

  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: userData } = useDoc(userRef);
  const isAdmin = userData?.role === 'admin';

  const SidebarItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    const Content = (
      <Link 
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group",
          isActive 
            ? "bg-primary text-white shadow-lg shadow-primary/20" 
            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
          isSidebarCollapsed ? "justify-center px-0" : ""
        )}
      >
        <item.icon className={cn("h-5 w-5 shrink-0", !isActive && "group-hover:scale-110 transition-transform")} />
        {!isSidebarCollapsed && <span className="tracking-tight">{item.label}</span>}
      </Link>
    );

    if (isSidebarCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {Content}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover border border-border text-foreground font-bold uppercase text-[10px] tracking-widest">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return Content;
  };

  return (
    <aside className={cn(
      "border-r border-border bg-background flex flex-col h-screen fixed left-0 top-0 shrink-0 hidden md:flex transition-all duration-500 z-50",
      isSidebarCollapsed ? "w-20" : "w-64"
    )}>
      {/* ZONE 1: Logo Node (Fixed Top) */}
      <div className={cn("p-6 flex items-center justify-between shrink-0", isSidebarCollapsed && "p-4 justify-center")}>
        {!isSidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 text-primary group">
            <Music2 className="h-8 w-8 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-headline font-bold tracking-tight text-foreground">AuraTune</h1>
          </Link>
        )}
        {isSidebarCollapsed && <Music2 className="h-8 w-8 text-primary" />}
      </div>

      {/* ZONE 2: Navigation Repository (Scrollable Center) */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-10 scrollbar-hide">
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </div>

        {isAdmin && (
          <div>
            {!isSidebarCollapsed && <h3 className="px-3 mb-3 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">System Core</h3>}
            <SidebarItem item={{ icon: ShieldCheck, label: "Admin Terminal", href: "/admin" }} />
          </div>
        )}

        <div>
          {!isSidebarCollapsed && <h3 className="px-3 mb-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Collection</h3>}
          <div className="space-y-1.5">
            {libraryItems.map((item) => (
              <SidebarItem key={item.href} item={item} />
            ))}
          </div>
        </div>

        <div>
          <div className={cn("flex items-center justify-between px-3 mb-3", isSidebarCollapsed && "justify-center")}>
            {!isSidebarCollapsed && <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Playlists</h3>}
            <button 
              onClick={() => createPlaylist("New Sonic Session")}
              className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors"
            >
              <PlusSquare className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1.5 pr-1">
            {!isSidebarCollapsed ? (
              playlists.length > 0 ? (
                playlists.map((pl) => (
                  <Link 
                    key={pl.id}
                    href={`/library?tab=playlists&id=${pl.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground font-bold hover:text-foreground hover:bg-foreground/5 truncate transition-all group"
                  >
                    <ListMusic className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                    <span className="truncate">{pl.name}</span>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-2 text-[8px] text-muted-foreground/30 font-bold uppercase tracking-widest italic">No syncs identified.</p>
              )
            ) : (
              <div className="flex flex-col items-center gap-3">
                {playlists.slice(0, 3).map(pl => (
                  <ListMusic key={pl.id} className="h-4 w-4 text-muted-foreground/40" />
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ZONE 3: System Infrastructure (Fixed Bottom Lockdown) */}
      <div className="p-4 space-y-4 border-t border-border shrink-0 mt-auto bg-background">
        <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center" : "justify-between px-2")}>
          {!isSidebarCollapsed && <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Spectrum</span>}
          <ThemeToggle />
        </div>
        <SidebarItem item={{ icon: Settings, label: "Settings", href: "/settings" }} />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="w-full h-10 rounded-xl hover:bg-foreground/5 text-muted-foreground"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}
