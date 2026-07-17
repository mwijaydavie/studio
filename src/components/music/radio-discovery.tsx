
"use client";

import React, { useState, useEffect } from 'react';
import { fetchTrendingStations, fetchRadioStations } from '@/lib/radio-api';
import { RadioStation, Track } from '@/lib/types';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe, Loader2, RefreshCcw, WifiOff } from 'lucide-react';
import { TrackCard } from './track-card';

export function RadioDiscovery() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { playTrack } = useMusic();

  const init = async () => {
    setLoading(true);
    try {
      const trending = await fetchTrendingStations();
      setStations(trending);
    } catch (e) {
      console.error("Radio sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const results = await fetchRadioStations(query);
      setStations(results);
    } catch (e) {
      console.error("Radio search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
            <Globe className="h-3 w-3" /> Global Frequency Nodes
          </div>
          <h2 className="text-4xl font-headline font-bold flex items-center gap-3 text-white tracking-tighter">
            Radio Discovery
          </h2>
          <p className="text-muted-foreground max-w-md">Query 40,000+ live frequencies from around the global node network.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-3 w-full lg:w-auto">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by genre, country..." 
            className="bg-black/20 border-white/10 rounded-2xl h-16 px-6 text-lg focus:ring-primary/20"
          />
          <Button type="submit" size="icon" className="rounded-2xl h-16 w-16 bg-primary hover:scale-105 transition-transform shrink-0 shadow-2xl shadow-primary/20">
            <Search className="h-6 w-6 text-white" />
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-medium animate-pulse uppercase tracking-widest text-xs">Tuning frequencies...</p>
        </div>
      ) : stations.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {stations.map(station => {
            const radioTrack: Track = {
              id: station.id,
              title: station.name,
              artist: station.country || 'Global Radio',
              genre: station.genre,
              duration: 'Live',
              coverUrl: station.logoUrl,
              audioUrl: station.streamUrl,
              source: 'radio'
            };
            return <TrackCard key={station.id} track={radioTrack} />;
          })}
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-center space-y-8 liquid-glass rounded-[3rem] border-white/5 p-12">
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/20">
            <WifiOff size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Node Link Interrupted</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto italic">
              "Unable to synchronize with the global radio mirrors. Check your uplink."
            </p>
          </div>
          <Button onClick={init} className="rounded-2xl h-14 px-8 bg-primary text-white font-bold gap-2">
            <RefreshCcw size={16} /> Retry Neural Sync
          </Button>
        </div>
      )}
    </div>
  );
}
