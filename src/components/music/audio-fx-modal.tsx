
"use client";

import React, { useRef } from 'react';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, SlidersHorizontal, Zap, Wind, Wand2, Clock, 
  HandMetal, Check, RotateCcw, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function AudioFxModal({ onClose }: { onClose: () => void }) {
  const { 
    currentTrack, eqBands, setEqBand, playbackSpeed, setPlaybackSpeed,
    playUISound, pitch, setPitch, reverbLevel, setReverbLevel,
    metronomeBpm, setMetronomeBpm, isMetronomeEnabled, toggleMetronome
  } = useMusic();
  const { toast } = useToast();
  const tapTimestamps = useRef<number[]>([]);

  const handleTapBpm = () => {
    playUISound('click');
    const now = performance.now();
    tapTimestamps.current.push(now);
    if (tapTimestamps.current.length > 4) tapTimestamps.current.shift();
    if (tapTimestamps.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimestamps.current.length; i++) {
        intervals.push(tapTimestamps.current[i] - tapTimestamps.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm > 40 && calculatedBpm < 300) setMetronomeBpm(calculatedBpm);
    }
  };

  const handleResetEq = () => {
    [0, 1, 2, 3, 4].forEach(i => setEqBand(i, 0));
    setPlaybackSpeed(1.0);
    setPitch(0);
    setReverbLevel(0);
    toast({ title: "Signal Linearized", description: "Acoustic path reset." });
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-background border border-border rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="text-base font-headline font-bold text-foreground leading-none">Sonic Processor</h3>
              <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest mt-1">Automatic Signal Calibration</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-foreground/5 h-8 w-8">
            <X size={16} />
          </Button>
        </header>

        <Tabs defaultValue="eq" className="flex-1 overflow-hidden flex flex-col">
          <div className="px-5 pt-4">
            <TabsList className="bg-foreground/5 border border-border h-10 rounded-xl p-1 w-full flex">
              <TabsTrigger value="eq" className="flex-1 rounded-lg font-bold uppercase text-[8px] tracking-widest gap-1.5">EQ</TabsTrigger>
              <TabsTrigger value="creative" className="flex-1 rounded-lg font-bold uppercase text-[8px] tracking-widest gap-1.5">FX Studio</TabsTrigger>
              <TabsTrigger value="metronome" className="flex-1 rounded-lg font-bold uppercase text-[8px] tracking-widest gap-1.5">Rhythm</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
            <TabsContent value="eq" className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between h-40 gap-2">
                {eqBands.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 flex-1">
                    <div className="flex-1 w-full flex justify-center py-2 bg-foreground/5 rounded-2xl border border-border/20">
                      <Slider 
                        orientation="vertical"
                        value={[val]}
                        min={-12} max={12} step={1}
                        onValueChange={(v) => setEqBand(i, v[0])}
                        className="h-full"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] font-mono font-bold text-primary block">{val > 0 ? `+${val}` : val}</span>
                      <span className="text-[7px] text-muted-foreground uppercase font-black tracking-tighter">
                        {['60', '250', '1k', '4k', '16k'][i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleResetEq} variant="outline" className="w-full rounded-xl h-10 border-border bg-foreground/5 font-bold uppercase text-[8px] tracking-widest gap-2">
                <RotateCcw size={12} /> Reset Signal
              </Button>
            </TabsContent>

            <TabsContent value="creative" className="m-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid gap-4">
                <section className="space-y-3 p-4 rounded-2xl bg-foreground/5 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity size={12} className="text-primary" />
                      <h4 className="text-[8px] font-black uppercase tracking-widest">Tempo Modulation</h4>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-primary">{playbackSpeed.toFixed(1)}x</span>
                  </div>
                  <Slider value={[playbackSpeed]} min={0.5} max={2.0} step={0.1} onValueChange={(v) => setPlaybackSpeed(v[0])} />
                </section>

                <section className="space-y-3 p-4 rounded-2xl bg-foreground/5 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wand2 size={12} className="text-accent" />
                      <h4 className="text-[8px] font-black uppercase tracking-widest">Pitch Detune</h4>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-primary">{pitch > 0 ? `+${pitch}` : pitch}st</span>
                  </div>
                  <Slider value={[pitch]} min={-12} max={12} step={1} onValueChange={(v) => setPitch(v[0])} />
                </section>

                <section className="space-y-3 p-4 rounded-2xl bg-foreground/5 border border-border/20">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Wind size={12} className="text-emerald-400" />
                      <h4 className="text-[8px] font-black uppercase tracking-widest">Aura Depth (Reverb)</h4>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-400">{reverbLevel}%</span>
                  </div>
                  <Slider value={[reverbLevel]} max={100} step={1} onValueChange={(v) => setReverbLevel(v[0])} />
                </section>
              </div>
            </TabsContent>

            <TabsContent value="metronome" className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center">
              <button 
                onClick={handleTapBpm}
                className={cn(
                  "h-28 w-28 rounded-full flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-xl",
                  isMetronomeEnabled ? "bg-primary/20 border-2 border-primary animate-pulse" : "bg-foreground/5 border-2 border-border/20"
                )}
              >
                <HandMetal className="h-5 w-5 text-primary" />
                <span className="text-2xl font-mono font-black text-foreground">{metronomeBpm}</span>
                <span className="text-[7px] font-black uppercase tracking-widest opacity-40">Tap Rhythm</span>
              </button>

              <div className="w-full space-y-5">
                <Slider value={[metronomeBpm]} min={40} max={240} onValueChange={(v) => setMetronomeBpm(v[0])} />
                <Button 
                  onClick={toggleMetronome}
                  className={cn(
                    "w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg",
                    isMetronomeEnabled ? "bg-emerald-600 text-white" : "bg-foreground/10"
                  )}
                >
                  {isMetronomeEnabled ? <Check size={14} /> : null}
                  {isMetronomeEnabled ? 'Link Active' : 'Initialize Metronome'}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
