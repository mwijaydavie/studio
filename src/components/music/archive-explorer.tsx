
"use client";

import React, { useState, useEffect } from 'react';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Music, Play, Loader2, Library, Sparkles } from 'lucide-react';
import { Track } from '@/lib/types';

export function ArchiveExplorer() {
  const [query, setQuery] = useState('Electronic Music');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { playTrack } = useMusic();

  const searchArchive = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}+AND+mediatype:audio&fl[]=identifier,title,creator,date,format&sort[]=downloads+desc&output=json`);
      const data = await res.json();
      setResults(data.response.docs || []);
    } catch (err) {
      console.error("Archive fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchArchive();
  }, []);

  const handlePlay = (item: any) => {
    const track: Track = {
      id: `archive-${item.identifier}`,
      title: item.title || "Untitled Fragment",
      artist: item.creator || 'Historical Archive',
      genre: 'Archive',
      duration: 'Live',
      coverUrl: `https://picsum.photos/seed/${item.identifier}/600/600`,
      audioUrl: `https://archive.org/download/${item.identifier}/${item.identifier}_vbr.mp3`, 
      source: 'archive'
    };
    playTrack(track);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
            <Sparkles className="h-3 w-3" /> internet archive nodes
          </div>
          <h2 className="text-4xl font-headline font-bold flex items-center gap-3 text-white tracking-tighter">
            <Library className="h-8 w-8 text-primary" />
            Archive Explorer
          </h2>
          <p className="text-muted-foreground max-w-md">Query millions of historical audio patterns and live recordings.</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchArchive()}
            placeholder="Search global archives..."
            className="bg-black/20 border-white/10 rounded-2xl h-16 px-6 text-lg focus:ring-primary/20"
          />
          <Button onClick={searchArchive} size="icon" className="rounded-2xl h-16 w-16 bg-primary hover:scale-105 transition-transform shrink-0 shadow-2xl shadow-primary/20">
            <Search className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Library className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-white font-mono uppercase tracking-widest">Querying Starlight Nodes</p>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Synchronizing with Archive.org</p>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {results.map((item) => (
            <div 
              key={item.identifier}
              className="group space-y-4 cursor-pointer"
              onClick={() => handlePlay(item)}
            >
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-3xl bg-white/5 ring-1 ring-white/5 group-hover:scale-105 transition-all duration-700">
                <img 
                  src={`https://picsum.photos/seed/${item.identifier}/600/600`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:rotate-3 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-8 w-8 fill-current text-white translate-x-1" />
                  </div>
                </div>
              </div>
              <div className="px-2 space-y-1">
                <h4 className="text-sm font-bold truncate text-white group-hover:text-primary transition-colors">{item.title || "Unknown Pattern"}</h4>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold opacity-60">{item.creator || "Anonymous Creator"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 liquid-glass rounded-[3rem] border-white/5">
          <Music className="h-12 w-12 text-muted-foreground/20" />
          <p className="text-muted-foreground">No audio patterns found for this query.</p>
        </div>
      )}
    </div>
  );
}
