
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Palette, Sparkles, Wand2, Type, 
  Eye, Zap, Activity, Waves, Flame, Box, Maximize2,
  ChevronRight, Layout, Monitor, Smartphone, Moon, Sun, AudioWaveform
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const FONTS = [
  { name: 'Space Grotesk', family: 'var(--font-headline)' },
  { name: 'Inter', family: 'var(--font-body)' },
  { name: 'JetBrains Mono', family: 'monospace' },
  { name: 'Syne', family: 'sans-serif' },
];

const ANIMATIONS = [
  { id: 'none', name: 'None' },
  { id: 'shimmer', name: 'Spectral Shimmer' },
  { id: 'glitch', name: 'Neural Glitch' },
  { id: 'pulse', name: 'Acoustic Pulse' },
];

export default function AppearancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    isDarkMode, setDarkMode,
    themeColor, setThemeColor,
    dynamicThemeMode, setDynamicThemeMode,
    fontFamily, setFontFamily,
    nameplateAnimation, setNameplateAnimation,
    neonGlow, setNeonGlow,
    fontSizeMultiplier, setFontSizeMultiplier,
    checkAchievement
  } = useMusic();

  const [themePrompt, setThemePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTheme = async () => {
    if (!themePrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setThemeColor('custom');
      setDynamicThemeMode('off');
      checkAchievement('ai_theme', true);
      toast({ title: "Theme Synthesized", description: "Neural palette applied to workstation." });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in pb-40">
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-3xl border-b border-border h-20 flex items-center px-6 md:px-12 justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-2xl h-12 gap-2">
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <Palette className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-headline font-bold uppercase tracking-widest">Spectral Editor</h1>
        </div>
        <div className="w-24" />
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Dynamic Theming Node */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold">Dynamic Protocol</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'off', label: 'Manual', icon: Sun },
              { id: 'spectral', label: 'Spectral', icon: AudioWaveform },
              { id: 'cover', label: 'Cover Art', icon: Monitor },
              { id: 'time', label: 'Time Node', icon: Waves },
              { id: 'mood', label: 'Mood Sync', icon: Zap },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setDynamicThemeMode(opt.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border transition-all aspect-square",
                  dynamicThemeMode === opt.id 
                    ? "bg-primary/10 border-primary text-primary shadow-xl shadow-primary/10 scale-105" 
                    : "bg-white/5 border-white/5 hover:border-white/10"
                )}
              >
                <opt.icon className={cn("h-6 w-6", dynamicThemeMode === opt.id && "animate-pulse")} />
                <span className="text-[9px] font-bold uppercase tracking-widest">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Theme Synth */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Wand2 className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-headline font-bold">AI Palette Synth</h2>
          </div>
          <div className="liquid-glass rounded-[2.5rem] p-8 border-white/5 space-y-6">
            <p className="text-xs text-muted-foreground">Describe an atmosphere to synthesize a custom spectral resonance.</p>
            <div className="flex gap-3">
              <Input 
                value={themePrompt}
                onChange={e => setThemePrompt(e.target.value)}
                placeholder="e.g. Cyberpunk Rain, Deep Jungle, Minimalist White..."
                className="h-14 rounded-2xl bg-white/5 border-white/10"
              />
              <Button 
                onClick={handleGenerateTheme}
                disabled={isGenerating || !themePrompt.trim()}
                className="h-14 px-8 rounded-2xl bg-primary text-white gap-2 shadow-xl shadow-primary/20"
              >
                {isGenerating ? <Activity className="animate-spin" /> : <Sparkles />}
                Synthesize
              </Button>
            </div>
          </div>
        </section>

        {/* Nameplate Protocol */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Type className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-headline font-bold">Nameplate Protocol</h2>
          </div>
          <div className="grid gap-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Header Font</Label>
              <div className="flex flex-wrap gap-2">
                {FONTS.map(f => (
                  <button
                    key={f.name}
                    onClick={() => { setFontFamily(f.name); checkAchievement('appearance_pro', true); }}
                    className={cn(
                      "px-6 py-3 rounded-xl border text-sm transition-all",
                      fontFamily === f.name ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-white/5 border-white/5"
                    )}
                    style={{ fontFamily: f.family }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural Animation</Label>
              <div className="flex flex-wrap gap-2">
                {ANIMATIONS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setNameplateAnimation(a.id)}
                    className={cn(
                      "px-6 py-3 rounded-xl border text-xs font-bold transition-all",
                      nameplateAnimation === a.id ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-white/5 border-white/5"
                    )}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Effects Engine */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Box className="h-6 w-6 text-rose-500" />
            <h2 className="text-2xl font-headline font-bold">Effects Engine</h2>
          </div>
          <div className="grid gap-8">
            <div className="flex items-center justify-between p-8 rounded-[2.5rem] liquid-glass border-white/5">
              <div className="space-y-1">
                <h4 className="font-bold">Neon Glow Protocol</h4>
                <p className="text-xs text-muted-foreground">Add reactive light borders to workstation modules.</p>
              </div>
              <Switch 
                checked={neonGlow.enabled} 
                onCheckedChange={v => setNeonGlow({ ...neonGlow, enabled: v })} 
              />
            </div>
            
            {neonGlow.enabled && (
              <div className="p-8 rounded-[2.5rem] liquid-glass border-rose-500/20 space-y-8 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'rotate', icon: Activity, label: 'Rotation' },
                    { id: 'wave', icon: Waves, label: 'Pulse Wave' },
                    { id: 'flame', icon: Flame, label: 'Neural Flux' },
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => setNeonGlow({ ...neonGlow, style: style.id as any })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                        neonGlow.style === style.id ? "bg-rose-500/10 border-rose-500 text-rose-500" : "bg-white/5 border-white/5"
                      )}
                    >
                      <style.icon className="h-5 w-5" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">{style.label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Glow Frequency</Label>
                    <span className="text-xs font-mono text-rose-500">{neonGlow.speed}Hz</span>
                  </div>
                  <Slider 
                    value={[neonGlow.speed]} 
                    min={1} max={10} step={0.5} 
                    onValueChange={v => setNeonGlow({ ...neonGlow, speed: v[0] })} 
                  />
                </div>
              </div>
            )}

            <div className="p-8 rounded-[2.5rem] liquid-glass border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Layout className="h-5 w-5 text-primary" />
                  <Label className="font-bold">Global UI Scale</Label>
                </div>
                <span className="text-xs font-mono text-primary">{Math.round(fontSizeMultiplier * 100)}%</span>
              </div>
              <Slider 
                value={[fontSizeMultiplier]} 
                min={0.8} max={1.3} step={0.05} 
                onValueChange={v => setFontSizeMultiplier(v[0])} 
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
