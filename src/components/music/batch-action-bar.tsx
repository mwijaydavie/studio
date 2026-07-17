"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Plus, 
  Share2, 
  X, 
  ListPlus,
  Zap,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatchActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  onAddToPlaylist: () => void;
  onSync: () => void;
}

export function BatchActionBar({ 
  selectedCount, 
  onClear, 
  onDelete, 
  onAddToPlaylist,
  onSync
}: BatchActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-[60] w-[94%] max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="liquid-glass border-primary/40 bg-primary/20 rounded-[2rem] md:rounded-full px-6 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 md:pr-6 md:border-r border-white/20">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shadow-lg">
            {selectedCount}
          </div>
          <span className="text-sm font-headline font-bold text-white whitespace-nowrap uppercase tracking-tighter">
            Nodes Locked
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 flex-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAddToPlaylist}
            className="rounded-xl h-10 gap-2 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest"
          >
            <ListPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add to Playlist</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSync}
            className="rounded-xl h-10 gap-2 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Sync Offline</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="rounded-xl h-10 gap-2 hover:bg-destructive/30 text-destructive text-[10px] font-black uppercase tracking-widest"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClear}
          className="h-10 w-10 rounded-full hover:bg-white/20 text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}