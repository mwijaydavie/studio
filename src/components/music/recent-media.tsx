'use client';

import React, { useMemo } from 'react';
import { useMusic } from '@/context/music-context';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Track } from '@/lib/types';
import { TrackCard } from './track-card';
import { Clock, Loader2, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

/**
 * RecentMedia - High-density activity hub for the dashboard.
 * Displays exactly 10 recent session frequencies in a horizontal line.
 */
export function RecentMedia() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { localTracks } = useMusic();

  const historyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'listeningHistory'),
      orderBy('listenedAt', 'desc'),
      limit(10)
    );
  }, [user?.uid, firestore]);

  const { data: history, isLoading } = useCollection(historyQuery);

  const recentTracks = useMemo(() => {
    if (!history) return [];
    return history.map(h => {
      const fullTrack = localTracks.find(t => t.id === h.trackId);
      if (fullTrack) return fullTrack;
      return {
        id: h.trackId,
        title: h.trackTitle || "Unknown Pattern",
        artist: h.artist || "Aura Core",
        genre: "Recent Session",
        duration: "---",
        coverUrl: `https://picsum.photos/seed/${h.trackId}/600/600`,
        source: 'local'
      } as Track;
    });
  }, [history, localTracks]);

  if (isLoading) {
    return (
      <div className="h-48 flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-40">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Reconstructing Sessions...</p>
      </div>
    );
  }

  if (!recentTracks || recentTracks.length === 0) {
    return (
      <div className="p-12 rounded-[3rem] border border-white/5 bg-foreground/[0.02] text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-foreground/5 mx-auto flex items-center justify-center">
          <Clock className="h-8 w-8 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold">No Recent Syncs</h4>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">Venture into discovery to begin your first session.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/discover')} className="rounded-xl gap-2 h-12">
          <Search className="h-4 w-4" /> Discovery Node
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-headline font-bold text-foreground">Recent Session Frequencies</h3>
        </div>
        <Button 
          variant="link" 
          onClick={() => router.push('/library')} 
          className="text-primary font-bold uppercase text-[10px] tracking-[0.2em] hover:tracking-[0.3em] transition-all group"
        >
          View All Nodes <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      
      <div className="relative group">
        {/* Horizontal Linear Row */}
        <div className="flex items-center gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x px-2">
          {recentTracks.map((track, i) => (
            <div 
              key={`${track.id}-${i}`} 
              className="animate-fade-in shrink-0 w-[200px] snap-start" 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <TrackCard track={track} />
            </div>
          ))}
          
          {/* Visual Link to Library Endcap */}
          <div 
            onClick={() => router.push('/library')}
            className="shrink-0 w-[200px] h-[266px] rounded-[2.5rem] bg-foreground/[0.02] border border-dashed border-border flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-foreground/[0.05] transition-all hover:border-primary/40 group/endcap snap-start"
          >
             <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover/endcap:scale-110 transition-transform">
                <Search className="h-6 w-6 text-primary" />
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/endcap:text-primary">Repository</p>
               <p className="text-[8px] font-medium text-muted-foreground/40 uppercase">Venture Beyond 10</p>
             </div>
          </div>
        </div>
        
        {/* Edge Fade Decor */}
        <div className="absolute top-0 right-0 bottom-8 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
