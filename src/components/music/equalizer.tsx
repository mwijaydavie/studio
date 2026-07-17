
"use client";

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Zap, RotateCcw, Volume2, Wind, Activity } from 'lucide-react';
import { useMusic } from '@/context/music-context';

export function Equalizer() {
  const { eqBands, setEqBand, playbackSpeed, setPlaybackSpeed } = useMusic();
  const labels = ["60Hz", "250Hz", "1kHz", "4kHz", "16kHz"];

  const presets = [
    { name: 'Bass Boost', values: [8, 4, 0, -2, -4] },
    { name: 'Clear Vocals', values: [-2, 0, 4, 6, 2] },
    { name: 'Electronic', values: [6, 2, 0, 4, 8] },
    { name: 'Studio', values: [0, 0, 0, 0, 0] }
  ];

  return (
    <div className="space-y-10 w-full animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-xl text-white">Sonic Processor</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Hardware Equalizer active</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-4 rounded-xl text-[10px] uppercase font-bold text-primary/60 hover:text-primary hover:bg-primary/10 transition-all" 
          onClick={() => [0,1,2,3,4].forEach(i => setEqBand(i, 0))}
        >
          <RotateCcw className="h-3 w-3 mr-2" /> Reset
        </Button>
      </div>
      
      <div className="flex justify-between h-64 gap-4 px-2">
        {eqBands.map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-6 flex-1">
            <div className="flex-1 w-full flex justify-center py-4 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-primary/20 transition-all">
              <Slider 
                orientation="vertical"
                value={[val]}
                min={-12}
                max={12}
                step={1}
                onValueChange={(v) => setEqBand(i, v[0])}
                className="h-full"
              />
            </div>
            <div className="text-center space-y-1">
              <span className="text-sm font-mono font-bold text-white block">{val > 0 ? `+${val}` : val}</span>
              <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">{labels[i]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {presets.map(preset => (
          <Button 
            key={preset.name}
            variant="outline" 
            className="rounded-2xl h-14 font-bold border-white/5 bg-white/5 hover:bg-primary/20 hover:text-white transition-all text-xs uppercase tracking-widest"
            onClick={() => {
              preset.values.forEach((v, idx) => setEqBand(idx, v));
            }}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <div className="space-y-8 pt-6 border-t border-white/5">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Tempo Modulation</h4>
            </div>
            <span className="text-xs font-mono font-bold text-primary">{playbackSpeed.toFixed(1)}x</span>
          </div>
          <Slider 
            value={[playbackSpeed]} 
            min={0.5} max={2.0} step={0.1}
            onValueChange={(v) => setPlaybackSpeed(v[0])}
          />
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-accent" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Maximizer</h4>
            </div>
            <div className="flex gap-2">
              {[0, 6, 12].map(v => (
                <Button key={v} variant="ghost" className="flex-1 rounded-xl bg-white/5 h-10 text-[10px] font-bold">+{v}</Button>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <Wind className="h-4 w-4 text-emerald-400" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">Reverb</h4>
            </div>
            <Slider defaultValue={[0]} max={100} step={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
