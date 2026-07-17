"use client";

import React, { useState, useEffect } from 'react';
import { personalizedContentFeed } from '@/ai/flows/personalized-content-feed-flow';
import { searchAudiusTracks } from '@/lib/audius-api';
import { useMusic } from '@/context/music-context';
import { TrackListItem } from './track-list-item';
import { Track } from '@/lib/types';
import { Sparkles, Globe, BrainCircuit, Clock, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AuraLoader } from '@/components/ui/aura-loader';
import { AnimatedList } from '@/components/ui/animated-list';

export function PersonalizedFeed() {
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const { queue, localTracks } = useMusic();
  const router = useRouter();

  const loadFeed = async () => {
    try {
      setLoading(true);
      // AI Synthesis with strict 2.5s timeout for maximum workstation speed
      const aiPromise = personalizedContentFeed({
        listeningHistory: queue.slice(0, 5).map(t => t.title).length > 0 
          ? queue.slice(0, 5).map(t => t.title) 
          : ["Deep House", "Ambient", "Future Bass"],
        preferences: "Professional workstation audio patterns"
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 2500)
      );

      const result = await Promise.race([aiPromise, timeoutPromise]) as any;

      if (result.recommendations?.length > 0) {
        const synthesisResults = await Promise.all(
          result.recommendations.slice(0, 6).map((rec: any) => 
            searchAudiusTracks(`${rec.name} ${rec.artist}`)
          )
        );
        
        const realTracks: Track[] = [];
        synthesisResults.forEach(res => { if (res.length > 0) realTracks.push(res[0]); });
        
        if (realTracks.length > 0) {
          setRecommendations(realTracks);
          setIsFallback(false);
          setLoading(false);
          return;
        }
      }
      throw new Error("Empty Node");
    } catch (e) {
      // Smart History Fallback: Shuffles history and local tracks to ensure the hub is instant
      const seeds = [...localTracks, ...queue].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      const historySeeds = seeds.sort(() => 0.5 - Math.random()).slice(0, 10);
      setRecommendations(historySeeds);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [localTracks.length]);

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-12 animate-fade-in">
        <AuraLoader text="Synthesizing" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary animate-pulse">Establishing Acoustic Link</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isFallback ? <Clock className="h-6 w-6 text-primary" /> : <BrainCircuit className="h-6 w-6 text-primary animate-pulse" />}
          <div>
            <h3 className="font-headline font-bold text-2xl tracking-tighter text-foreground leading-none">
              {isFallback ? "Smart History Node" : "Neural Intelligence Feed"}
            </h3>
            <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest mt-1">
              {isFallback ? "Local Repository Sync" : "AuraCore Global Network"}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={loadFeed}
          className="h-10 w-10 rounded-full hover:bg-white/5 text-muted-foreground hover:text-primary"
        >
          <RefreshCcw size={16} />
        </Button>
      </div>

      {recommendations.length > 0 ? (
        <div className="w-full">
          <AnimatedList>
            {recommendations.map((track, i) => (
              <TrackListItem key={track.id} track={track} index={i} />
            ))}
          </AnimatedList>
        </div>
      ) : (
        <div className="p-16 rounded-[3.5rem] bg-foreground/[0.03] border border-border text-center space-y-10">
          <div className="h-24 w-24 rounded-[2.5rem] bg-primary/10 mx-auto flex items-center justify-center animate-float">
            <Globe className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-3">
            <h4 className="text-3xl font-headline font-bold text-foreground">Repository Empty</h4>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto italic">
              "No session patterns detected. Venture into discovery to begin."
            </p>
          </div>
          <Button onClick={() => router.push('/library')} className="rounded-2xl h-14 px-8 bg-primary text-white font-bold">
            Enter Repository
          </Button>
        </div>
      )}
    </div>
  );
}
