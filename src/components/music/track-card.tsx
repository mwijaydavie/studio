"use client";

import React from 'react';
import { Track } from '@/lib/types';
import { useMusic } from '@/context/music-context';
import { Play, Pause, Plus, Music, Zap, Info, Share2, MoreHorizontal, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
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
      'from-primary/40 via-purple-900/60 to-black',
      'from-blue-900/40 via-indigo-900/60 to-black',
      'from-emerald-900/40 via-teal-900/60 to-black',
      'from-rose-900/40 via-pink-900/60 to-black'
    ];
    const index = (track.id || track.title).length % gradients.length;
    return (
      <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", gradients[index])}>
        <span className="text-4xl font-bold text-white/30">{track.title.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div className="group relative w-full aspect-[3/4] max-w-[220px] mx-auto rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-card border border-border shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:border-primary/40">
      <div className="absolute inset-0 z-0">
        {track.coverUrl && !track.coverUrl.includes('archive.org/services/img') ? (
          <img src={track.coverUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.8]" alt="" />
        ) : <ResonanceFallback />}
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-xl border border-border text-[8px] font-black uppercase tracking-widest text-primary shadow-lg">
            {track.source || 'Node'}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all shadow-lg",
                favorite ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground/60 hover:text-foreground border border-border"
              )}
            >
              <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 liquid-glass border-border rounded-2xl p-2 shadow-3xl">
                <DropdownMenuItem onClick={() => addToQueue(track)} className="rounded-xl gap-2 cursor-pointer font-bold text-xs uppercase tracking-widest">
                  <Plus className="h-4 w-4" /> Add to Queue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-headline font-bold text-foreground text-lg truncate drop-shadow-2xl leading-tight">{track.title}</h4>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest truncate">{track.artist}</p>
          </div>
          
          <Button 
            onClick={handlePlay}
            className="w-full rounded-2xl h-12 bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all gap-2 font-bold uppercase tracking-widest text-[10px]"
          >
            {isActive && isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current translate-x-0.5" />}
            <span>{isActive && isPlaying ? 'Active' : 'Play'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}