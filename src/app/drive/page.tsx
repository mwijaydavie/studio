
"use client";

import React, { useState, useEffect } from 'react';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  ArrowLeft,
  Smartphone,
  Music2,
  Zap,
  PlayCircle,
  BrainCircuit,
  Cpu,
  RefreshCcw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SimpleModePage() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, volume, playUISound } = useMusic();
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [reasoning, setReasoning] = useState("Synchronizing with currently active workstation neural state.");

  const isRadio = currentTrack?.source === 'radio';

  useEffect(() => {
    if (isFlipped) {
      const thoughts = [
        "AuraCore detects high-resonance focus patterns in this node.",
        "Synthesizing acoustic architecture for immersive depth.",
        "Neural sync established. Frequency modulation optimized."
      ];
      setReasoning(thoughts[Math.floor(Math.random() * thoughts.length)]);
    }
  }, [isFlipped]);

  const handleFlip = () => {
    playUISound('switch');
    setIsFlipped(!isFlipped);
  };

  if (!currentTrack) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center p-8 text-center space-y-12">
        <Smartphone className="h-20 w-20 text-primary animate-pulse" />
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tighter">Cockpit Node</h1>
        <Button onClick={() => router.push('/discover')} className="h-20 w-full max-w-sm rounded-[2rem] bg-primary text-xl font-bold">Discover Sounds</Button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col p-6 md:p-12 overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img src={currentTrack.coverUrl} className="w-full h-full object-cover blur-[120px] scale-150" alt="" />
      </div>

      <header className="relative z-10 flex items-center justify-between mb-8 md:mb-12">
        <Button variant="ghost" onClick={() => router.back()} className="h-14 w-14 rounded-2xl bg-foreground/5 border border-border/10 text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="text-right">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
            <Smartphone size={12} /> Cockpit Mode
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-12 md:gap-16">
        <div className="perspective-1000 w-full max-w-2xl h-[400px] md:h-[500px]">
          <div className={cn("relative w-full h-full transition-transform duration-700 preserve-3d", isFlipped && "[transform:rotateY(180deg)]")}>
            
            {/* FRONT SIDE - CINEMATIC COVER */}
            <div className="absolute inset-0 backface-hidden rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-card border-2 border-border shadow-3xl">
              <img src={currentTrack.coverUrl} className="w-full h-full object-cover brightness-[0.8]" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 text-left">
                <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter leading-none mb-2 md:mb-4">{currentTrack.title}</h2>
                <p className="text-xl md:text-2xl text-primary font-bold">{currentTrack.artist}</p>
              </div>
              <button onClick={handleFlip} className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-white backdrop-blur-md"><RefreshCcw size={20} /></button>
            </div>

            {/* BACK SIDE - SYSTEM TELEMETRY */}
            <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] p-10 md:p-16 rounded-[3rem] md:rounded-[4rem] bg-zinc-950 border-2 border-primary/20 shadow-3xl flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary"><Cpu size={32} /><h3 className="text-xl font-headline font-bold uppercase tracking-widest">System Logic</h3></div>
                  <button onClick={handleFlip} className="h-10 w-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground"><RefreshCcw size={18}/></button>
                </div>
                <p className="text-2xl md:text-3xl text-foreground font-medium italic opacity-90 leading-snug">"{reasoning}"</p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div className="space-y-1"><p className="text-[10px] font-black uppercase text-primary tracking-widest">Frequency</p><p className="text-lg md:text-2xl font-mono font-bold truncate text-foreground">{currentTrack.source || 'INTERNAL'}</p></div>
                <div className="space-y-1"><p className="text-[10px] font-black uppercase text-primary tracking-widest">Aura Node</p><p className="text-lg md:text-2xl font-mono font-bold truncate text-foreground">{currentTrack.genre || 'Soundscape'}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* COCKPIT CONTROLS - HIGH CONTRAST BIG BUTTONS */}
        <div className="w-full max-w-2xl space-y-10 md:space-y-12">
          <div className="flex items-center justify-center gap-8 md:gap-16">
            <Button variant="ghost" disabled={isRadio} onClick={prevTrack} className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-foreground/5 border border-border/10 hover:bg-foreground/10 active:scale-90 shadow-xl text-foreground">
              <SkipBack className="h-10 w-10 md:h-14 md:w-14 fill-current" />
            </Button>
            <Button onClick={togglePlay} className="h-28 w-28 md:h-40 md:w-40 rounded-full bg-primary text-primary-foreground shadow-3xl hover:scale-105 active:scale-95 transition-all">
              {isPlaying ? <Pause className="h-14 w-14 md:h-20 md:w-20 fill-current" /> : <Play className="h-14 w-14 md:h-20 md:w-20 fill-current translate-x-1" />}
            </Button>
            <Button variant="ghost" disabled={isRadio} onClick={nextTrack} className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-foreground/5 border border-border/10 hover:bg-foreground/10 active:scale-90 shadow-xl text-foreground">
              <SkipForward className="h-10 w-10 md:h-14 md:w-14 fill-current" />
            </Button>
          </div>
          
          <div className="flex items-center gap-6 px-10 w-full">
            <Volume2 className="h-6 w-6 text-muted-foreground shrink-0" />
            <div className="flex-1 h-4 bg-foreground/10 rounded-full overflow-hidden border border-border/10 shadow-inner">
              <div className="h-full bg-primary transition-all shadow-xl" style={{ width: `${volume}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
