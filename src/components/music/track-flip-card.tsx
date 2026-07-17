
"use client";

import React from 'react';
import { Track } from '@/lib/types';
import { useMusic } from '@/context/music-context';
import { Play, Pause, Plus, Heart, Music, Zap, Info, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrackFlipCardProps {
  track: Track;
  isFlipped?: boolean;
}

export function TrackFlipCard({ track, isFlipped: forceFlipped }: TrackFlipCardProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay, toggleFavorite, isFavorite, addToQueue } = useMusic();
  const isActive = currentTrack?.id === track.id;
  const favorite = isFavorite(track.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) togglePlay();
    else playTrack(track);
  };

  const ResonanceFallback = () => {
    const gradients = [
      'from-primary/20 via-purple-900/40 to-black',
      'from-blue-900/20 via-indigo-900/40 to-black',
      'from-emerald-900/20 via-teal-900/40 to-black',
      'from-rose-900/20 via-pink-900/40 to-black'
    ];
    const index = (track.id || track.title).length % gradients.length;
    return (
      <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", gradients[index])}>
        <span className="text-4xl font-bold text-white/20">{track.title.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div className="group perspective-1000 w-full aspect-[3/4] max-w-[220px] mx-auto cursor-pointer">
      <div className={cn(
        "relative w-full h-full transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(180deg)]",
        forceFlipped && "[transform:rotateY(180deg)]"
      )}>
        
        {/* FRONT: Cover Art & Identity */}
        <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
            {track.coverUrl && !track.coverUrl.includes('archive.org') ? (
              <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
            ) : <ResonanceFallback />}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase tracking-widest text-primary">
                {track.source || 'Node'}
              </span>
              {isActive && (
                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#A24CF1] animate-pulse" />
              )}
            </div>
            
            <div className="space-y-1">
              <h4 className="font-headline font-bold text-white text-lg truncate drop-shadow-md">{track.title}</h4>
              <p className="text-white/60 text-xs truncate font-medium">{track.artist}</p>
            </div>
          </div>
        </div>

        {/* BACK: Workstation Controls & Metadata */}
        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] rounded-[2.5rem] overflow-hidden bg-zinc-950 border border-primary/20 shadow-2xl p-6 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-[8px] font-bold text-primary uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3" /> System Reasoning
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              "Frequency aligns with active session. 94% resonance probability detected."
            </p>
            
            <div className="h-px bg-white/5 w-full" />
            
            <div className="grid gap-2">
              <div className="flex justify-between text-[9px] uppercase font-bold tracking-tighter">
                <span className="text-muted-foreground">Genre</span>
                <span className="text-white">{track.genre}</span>
              </div>
              <div className="flex justify-between text-[9px] uppercase font-bold tracking-tighter">
                <span className="text-muted-foreground">Source</span>
                <span className="text-white truncate max-w-[100px]">{track.source || 'Local'}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2">
            <Button 
              onClick={handlePlay}
              className="rounded-2xl h-12 bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/20"
            >
              {isActive && isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current translate-x-0.5" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
              className="rounded-2xl h-12 border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
              className={cn("rounded-2xl h-12 border-white/10 bg-white/5", favorite && "text-primary border-primary/20 bg-primary/10")}
            >
              <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
            </Button>
            <Button 
              variant="outline" 
              className="rounded-2xl h-12 border-white/10 bg-white/5"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
