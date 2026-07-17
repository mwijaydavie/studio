
"use client";

import React, { useState, useEffect } from 'react';
import { fetchTrendingAudiusTracks, searchAudiusTracks } from '@/lib/audius-api';
import { Track } from '@/lib/types';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Search, Play, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function AudiusExplorer() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { playTrack } = useMusic();

  useEffect(() => {
    async function init() {
      const trending = await fetchTrendingAudiusTracks();
      setTracks(trending);
      setLoading(false);
    }
    init();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const results = await searchAudiusTracks(query);
    setTracks(results);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-headline font-bold flex items-center gap-3 text-white">
            <Sparkles className="h-7 w-7 text-primary animate-pulse" />
            Audius Collective
          </h2>
          <p className="text-sm text-muted-foreground">Venture into decentralized high-fidelity sound.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search decentralized tracks..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/5 border-white/10 rounded-full h-12 px-6"
          />
          <Button type="submit" size="icon" className="rounded-full h-12 w-12 shrink-0 bg-primary hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-medium animate-pulse">Syncing with Audius nodes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {tracks.map(track => (
            <div 
              key={track.id} 
              className="group relative liquid-glass rounded-3xl p-4 hover:bg-white/10 transition-all cursor-pointer overflow-hidden border-white/5 hover:border-white/20"
              onClick={() => playTrack(track)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-xl">
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-sm truncate text-white">{track.title}</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
