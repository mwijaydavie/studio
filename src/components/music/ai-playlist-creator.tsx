
"use client";

import React, { useState } from 'react';
import { playlistFromPrompt } from '@/ai/flows/playlist-from-prompt';
import { searchAudiusTracks } from '@/lib/audius-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, Zap, ArrowRight, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/context/music-context';
import { Track } from '@/lib/types';

export function AIPlaylistCreator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { toast } = useToast();
  const { addToQueue } = useMusic();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setStatus("Synthesizing Mood...");
    try {
      const result = await playlistFromPrompt({ prompt });
      const isFallback = result.playlistName.includes("Backup");

      toast({
        title: isFallback ? "Resilience Mode Active" : `Emanation: ${result.playlistName}`,
        description: `Querying global decentralized nodes...`,
      });

      let activeNodes = 0;
      for (const song of result.songs) {
        setStatus(`Searching: ${song.title}`);
        
        // Phase 1: Audius Primary Node
        let results = await searchAudiusTracks(`${song.title} ${song.artist}`);
        
        // Phase 2: Audius Broad Search Fallback
        if (results.length === 0) {
          results = await searchAudiusTracks(song.title);
        }

        // Phase 3: Internet Archive Fallback (Synthesized directly)
        if (results.length === 0) {
          setStatus(`Scanning Archive: ${song.genre}`);
          const archiveRes = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(song.title)}+AND+mediatype:audio&fl[]=identifier,title,creator&sort[]=downloads+desc&output=json&limit=1`);
          const archiveData = await archiveRes.json();
          if (archiveData.response.docs.length > 0) {
            const item = archiveData.response.docs[0];
            const archiveTrack: Track = {
              id: `archive-${item.identifier}`,
              title: item.title || song.title,
              artist: item.creator || song.artist,
              genre: song.genre,
              duration: 'Archive',
              coverUrl: `https://picsum.photos/seed/${item.identifier}/600/600`,
              audioUrl: `https://archive.org/download/${item.identifier}/${item.identifier}_vbr.mp3`,
              source: 'archive'
            };
            addToQueue(archiveTrack);
            activeNodes++;
            continue;
          }
        }

        // Phase 4: Aura Essential Seed (If prompt matches common genre)
        if (results.length === 0 && (prompt.toLowerCase().includes('jazz') || prompt.toLowerCase().includes('techno') || prompt.toLowerCase().includes('lofi'))) {
           setStatus("Seeding from Aura Core...");
           const demoTrack: Track = {
             id: `aura-seed-${Date.now()}-${activeNodes}`,
             title: `Aura ${song.genre} Fragment`,
             artist: "Aura System",
             genre: song.genre,
             duration: "3:45",
             coverUrl: `https://picsum.photos/seed/aura-${activeNodes}/600/600`,
             audioUrl: "https://archive.org/download/lp_the-future-of-jazz_the-modern-jazz-quartet/lp_the-future-of-jazz_the-modern-jazz-quartet_itemimage.png", // Just a dummy, search fallback is better
             source: 'demo'
           };
           // We only actually add it if we found a broad match earlier or we keep trying
        }

        if (results.length > 0) {
          addToQueue(results[0]);
          activeNodes++;
        }
      }

      if (activeNodes === 0) {
        // Ultimate Fallback: Just search for the prompt itself as a genre
        setStatus(`Final Sync: ${prompt}`);
        const ultimateSearch = await searchAudiusTracks(prompt);
        if (ultimateSearch.length > 0) {
          ultimateSearch.slice(0, 5).forEach(t => addToQueue(t));
          activeNodes = ultimateSearch.length;
        }
      }

      if (activeNodes === 0) {
        toast({ 
          variant: "destructive", 
          title: "Synthesis Exhausted", 
          description: "No real audio nodes found. Try a broader mood like 'Jazz' or 'Techno'." 
        });
      } else {
        toast({ 
          title: "Synthesis Complete", 
          description: `Active Link established for ${activeNodes} patterns.` 
        });
      }

      setPrompt("");
    } catch (error) {
      toast({ variant: "destructive", title: "Synthesis Offline", description: "The AI engine could not resolve your prompt." });
    } finally {
      setIsLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="relative p-8 md:p-10 rounded-[3.5rem] liquid-glass overflow-hidden group shadow-3xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center animate-float shadow-xl shadow-primary/20">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-3xl tracking-tight text-foreground">Mood Synthesis</h3>
            <p className="text-sm text-muted-foreground opacity-60">Describe an atmosphere to synthesize patterns.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="relative">
            <Input 
              placeholder="Describe your sonic destination..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-16 bg-black/40 border-white/10 rounded-2xl px-6 text-lg focus:ring-primary/20 placeholder:text-muted-foreground/30 text-white"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest hidden md:block">{status}</span>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Cyberpunk Neon', 'Deep Focus Lofi', 'Acoustic Soul', 'Melodic Techno'].map(tag => (
              <button key={tag} type="button" onClick={() => setPrompt(tag)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 hover:text-primary transition-all text-foreground/60">{tag}</button>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim()} 
            className="neon-shimmer w-full"
          >
            <span /> <span /> <span /> <span />
            <div className="flex items-center justify-center gap-3">
              {isLoading ? "Synthesizing..." : <>Commence Synthesis <ArrowRight className="h-5 w-5" /></>}
            </div>
          </button>
        </form>

        <div className="flex items-center gap-3 pt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
          <Database className="h-3 w-3" /> Multi-Source Fallback Protocol Active
        </div>
      </div>
    </div>
  );
}
