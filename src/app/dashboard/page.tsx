
"use client";

import React, { useState, useMemo } from 'react';
import { useMusic } from '@/context/music-context';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Search, User, Menu, Zap, Bot, ArrowRight, Loader2, TrendingUp, Sparkles, ShieldCheck, Network, Activity, Database, HardDrive, Wifi
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { SplitText } from '@/components/ui/split-text';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { AnimatePresence } from 'framer-motion';
import { RecentMedia } from '@/components/music/recent-media';
import { TrackCard } from '@/components/music/track-card';
import { ListeningRoomModal } from '@/components/music/listening-room-modal';
import { NotificationCenter } from '@/components/music/notification-center';

export default function DashboardPage() {
  const { user, firestore } = useFirebase();
  const { isSidebarCollapsed, toggleSidebar, startAiDjSession, isDjSessionStarting, localTracks, activeRoomId, isOnline } = useMusic();
  const router = useRouter();
  const [showSyncModal, setShowSyncModal] = useState(false);

  const premiumQuery = useMemoFirebase(() => query(collection(firestore, 'globalTracks'), orderBy('createdAt', 'desc'), limit(10)), [firestore]);
  const { data: premiumTracks, isLoading: isPremiumLoading } = useCollection(premiumQuery);

  const resonanceScore = useMemo(() => {
     if (!localTracks.length) return 0;
     return Math.min(100, localTracks.length * 1.5 + 40);
  }, [localTracks]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MainSidebar />
      <main className={cn("flex-1 pb-40 transition-all duration-500 overflow-y-auto scrollbar-hide", isSidebarCollapsed ? "md:pl-20" : "md:pl-64")}>
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 bg-background/30 backdrop-blur-2xl z-40 border-b border-border mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl md:rounded-3xl liquid-glass">
          <div className="flex items-center gap-2 md:gap-4 w-full max-w-md">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}><Menu className="h-5 w-5" /></Button>
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
              <input type="text" placeholder="Query Aura nodes..." onFocus={() => router.push('/search')} className="w-full h-10 md:h-11 bg-foreground/5 border border-border rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-4 text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/40 text-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button onClick={startAiDjSession} disabled={isDjSessionStarting} variant="ghost" className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 transition-all">
              {isDjSessionStarting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3 text-primary" />}
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI DJ Session</span>
            </Button>
            <NotificationCenter />
            <div onClick={() => router.push(user ? '/profile' : '/login')} className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent p-[1px] cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <div className="w-full h-full rounded-[11px] md:rounded-[15px] bg-background flex items-center justify-center overflow-hidden text-foreground">
                {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-8 py-6 md:py-10 space-y-12 md:space-y-20 relative z-10">
          <header className="space-y-1 md:space-y-2">
             <div className="text-2xl md:text-5xl font-headline font-bold text-foreground"><SplitText text={`Welcome, ${user?.displayName || "Aura Guest"}`} textAlign="left" delay={30} /></div>
             <p className="text-muted-foreground text-[10px] md:text-lg">{user ? "Workstation synchronized and active." : "Public synthesis mode enabled."}</p>
          </header>

          <section className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 relative h-[250px] md:h-[450px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden group shadow-3xl">
              <Image src={PlaceHolderImages.find(img => img.id === 'hero-music')?.imageUrl || ""} alt="Experience" fill className="object-cover transition-transform [transition-duration:5000ms] group-hover:scale-110 brightness-[0.6]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 space-y-4 md:space-y-6 max-w-xl">
                <div className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-primary/20 backdrop-blur-xl rounded-full border border-primary/30 w-fit"><Zap className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" /><span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">Neural Hub Active</span></div>
                <h3 className="text-3xl md:text-6xl font-headline font-bold text-white leading-tight tracking-tighter">Explore your <br/><span className="text-gradient">Sonic Future.</span></h3>
                <button onClick={() => router.push('/discover')} className="neon-shimmer py-3 md:py-4 px-6 md:px-8"><span /> <span /> <span /> <span />Begin Global Sync</button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <SpotlightCard onClick={() => setShowSyncModal(true)} className="group p-6 md:p-8 flex flex-col justify-between h-[180px] md:h-[210px] shadow-2xl bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <Network size={120} className="text-primary" />
                </div>
                <div className="space-y-3 md:space-y-4 relative z-10">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg border border-primary/20">
                    <Network className={cn("h-5 w-5 md:h-6 md:w-6 text-primary", activeRoomId && "animate-pulse")} />
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <h4 className="text-xl md:text-2xl font-headline font-bold tracking-tight text-card-foreground">Collective Sync</h4>
                    <p className="text-muted-foreground text-[10px] md:text-xs leading-relaxed">Shared acoustic transmission across nodes.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[8px] group-hover:gap-4 transition-all relative z-10">
                  {activeRoomId ? 'Active Session Found' : 'Initialize Shared Node'} <ArrowRight className="h-3 w-3" />
                </div>
                {activeRoomId && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />}
              </SpotlightCard>

              <SpotlightCard className="p-6 md:p-8 flex flex-col gap-4 border-border bg-card group/telemetry overflow-hidden cursor-default h-[180px] md:h-[210px]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Activity size={14} className="text-primary animate-pulse" /> Acoustic Telemetry</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Neural Resonance</p>
                    <div className="flex items-end gap-2">
                       <span className="text-2xl font-headline font-bold text-primary">{resonanceScore}%</span>
                       <TrendingUp size={14} className="text-primary mb-1" />
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${resonanceScore}%` }} />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Node Stability</p>
                    <div className="flex items-center gap-2">
                       <span className={cn("text-xs font-bold uppercase", isOnline ? "text-emerald-400" : "text-rose-400")}>
                         {isOnline ? "Link Stable" : "Link Offline"}
                       </span>
                       <Wifi size={14} className={cn(isOnline ? "text-emerald-400" : "text-rose-400")} />
                    </div>
                    <p className="text-[8px] text-muted-foreground uppercase font-medium">Ping: {isOnline ? "24ms" : "---"}</p>
                  </div>

                  <div className="col-span-2 flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <HardDrive size={10} className="text-muted-foreground" />
                       <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">{localTracks.length} Nodes Cached</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Database size={10} className="text-muted-foreground" />
                       <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground">Studio Node 7.0</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-headline font-bold text-foreground">Premium Frequencies</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Artist Verified</span>
              </div>
            </div>
            {isPremiumLoading ? (
              <div className="h-48 flex items-center justify-center opacity-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : premiumTracks?.length ? (
              <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x px-2">
                {premiumTracks.map((track) => (<div key={track.id} className="shrink-0 w-[200px] snap-start"><TrackCard track={track} /></div>))}
              </div>
            ) : (
              <div className="p-12 rounded-[3rem] border border-dashed border-border bg-foreground/[0.01] text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Waiting for global node synthesis...</p>
              </div>
            )}
          </section>

          <RecentMedia />
        </div>
      </main>
      <PlayerBar />
      <AnimatePresence>{showSyncModal && (<ListeningRoomModal onClose={() => setShowSyncModal(false)} />)}</AnimatePresence>
    </div>
  );
}
