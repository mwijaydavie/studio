
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Track } from '@/lib/types';
import { useMusic } from '@/context/music-context';
import { Play, Pause, MoreVertical, Plus, Share2, Download, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import * as idb from 'idb-keyval';

interface TrackListItemProps {
  track: Track;
  index: number;
  onClick?: () => void;
}

export function TrackListItem({ track, index, onClick }: TrackListItemProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay, addToQueue, playUISound } = useMusic();
  const isActive = currentTrack?.id === track.id;
  
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const [isBlobActive, setIsBlobActive] = useState<boolean | null>(null);

  useEffect(() => {
    if (track.source === 'local') {
      const checkBlob = async () => {
        const cached = await idb.get(`aura_blob_${track.id}`);
        if (cached) {
          try {
            const res = await fetch(cached, { method: 'HEAD' });
            setIsBlobActive(res.ok);
          } catch (e) {
            setIsBlobActive(false);
          }
        } else {
          setIsBlobActive(false);
        }
      };
      checkBlob();
    } else {
      setIsBlobActive(true);
    }
  }, [track.id, track.source]);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playUISound('click');
    if (isActive) togglePlay();
    else playTrack(track);
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && titleContainerRef.current) {
        setIsTitleOverflowing(titleRef.current.scrollWidth > titleContainerRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [track.title]);

  const ResonanceFallback = () => {
    const gradients = [
      'from-blue-600 via-indigo-600 to-purple-600',
      'from-emerald-500 via-teal-600 to-cyan-600',
      'from-orange-500 via-pink-600 to-rose-600',
      'from-violet-600 via-fuchsia-600 to-pink-600'
    ];
    const colorIndex = (track.id || track.title).length % gradients.length;
    return (
      <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", gradients[colorIndex])}>
        <span className="text-xl font-bold text-white/60">{track.title.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div 
      onClick={onClick}
      id={`track-${track.id}`}
      className={cn(
        "group flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl md:rounded-[2rem] transition-all duration-500 border border-transparent hover:bg-foreground/5 w-full cursor-pointer",
        isActive && "bg-primary/5 border-primary/10 shadow-lg",
        isBlobActive === false && "opacity-50 grayscale-[0.5]"
      )}
    >
      <div className="w-6 md:w-10 text-center text-[10px] md:text-xs font-mono shrink-0">
        {isActive && isPlaying ? (
          <div className="mini-visualizer mx-auto">
            <span style={{ animationDelay: '0.1s' }} />
            <span style={{ animationDelay: '0.3s' }} />
            <span style={{ animationDelay: '0.2s' }} />
          </div>
        ) : (
          <span className={cn("text-muted-foreground md:group-hover:hidden", isActive && "text-primary font-bold")}>
            {(index + 1).toString().padStart(2, '0')}
          </span>
        )}
        <button 
          onClick={handlePlay}
          className="hidden md:group-hover:flex items-center justify-center mx-auto text-primary animate-fade-in transition-transform active:scale-90"
        >
          {isActive && isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
        </button>
      </div>

      <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 shadow-lg md:group-hover:scale-105 transition-transform duration-500">
        {track.coverUrl && !track.coverUrl.includes('archive.org/services/img') ? (
          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
        ) : <ResonanceFallback />}
        
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
             <div className="mini-visualizer">
                <span style={{ animationDelay: '0ms' }} />
                <span style={{ animationDelay: '200ms' }} />
                <span style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div ref={titleContainerRef} className={cn("marquee-container", isTitleOverflowing && "is-overflowing")}>
          <div className="flex items-center gap-2 marquee-content">
            <p ref={titleRef} className={cn(
              "text-sm md:text-base font-bold truncate transition-colors duration-300", 
              isActive ? "text-primary" : "text-foreground"
            )}>
              {track.title}
            </p>
            {isBlobActive === false && <AlertCircle size={10} className="text-destructive shrink-0" />}
            {isBlobActive === true && track.source === 'local' && <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] md:text-sm text-muted-foreground/60 truncate font-medium">
            {track.artist}
          </span>
          {track.source && (
            <span className={cn(
              "text-[6px] md:text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-tighter font-black bg-foreground/5 border border-foreground/5",
              isBlobActive === false ? "text-destructive/60" : "text-muted-foreground/40"
            )}>
              {track.source} {isBlobActive === false ? '• LINK BROKEN' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center shrink-0 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-foreground/10 hover:text-primary transition-all">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 liquid-glass border-foreground/10 rounded-2xl p-2" align="end">
            <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePlay(e as any); }}>
              <Play className="h-4 w-4" /> Play Pattern
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); addToQueue(track); }}>
              <Plus className="h-4 w-4" /> Add to Queue
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-foreground/5" />
            <DropdownMenuItem className="rounded-xl gap-3 text-primary cursor-pointer font-bold" onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>
              <Info className="h-4 w-4" /> Node Intelligence
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
