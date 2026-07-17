
"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMusic } from '@/context/music-context';
import { useFirebase, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { 
  ArrowLeft, 
  Settings2, 
  Type, 
  Palette, 
  ShieldCheck, 
  Trash2, 
  LogOut, 
  Sparkles, 
  Lock,
  Eye,
  AlertTriangle,
  BrainCircuit,
  Music,
  Zap,
  Globe,
  Mic2,
  Cpu,
  Key,
  Bell,
  HardDrive,
  Activity,
  Layers,
  Wind,
  Download,
  Upload,
  Database,
  Smartphone,
  Gauge,
  User,
  Shield,
  FileAudio,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from '@/components/music/theme-toggle';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { 
    fontFamily, setFontFamily, 
    isDarkMode, toggleDarkMode, 
    themeColor, setThemeColor,
    purgeAllData,
    isHighContrast, setHighContrast,
    blurIntensity, setBlurIntensity,
    animationSpeed, setAnimationSpeed,
    apiKeys, setApiKey,
    isHapticsEnabled, setHapticsEnabled,
    isDataSaverMode, setDataSaverMode,
    reelsAutoScrollLoops, setReelsAutoScrollLoops,
    scannerSettings, setScannerSettings,
    aiCoverArtEnabled, setAiCoverArtEnabled,
    aiDjMode, setAiDjMode,
    exportSystemData, importSystemData
  } = useMusic();
  const { user } = useFirebase();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themes = [
    { id: 'purple', label: 'Aura Purple', color: 'bg-[#A24CF1]' },
    { id: 'blue', label: 'Sonic Blue', color: 'bg-blue-500' },
    { id: 'emerald', label: 'Emerald Focus', color: 'bg-emerald-500' },
    { id: 'rose', label: 'Crimson Pulse', color: 'bg-rose-500' },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handlePurge = async () => {
    toast({ title: "Protocol Initiated", description: "Commencing total sonic wipe..." });
    await purgeAllData();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importSystemData(file);
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in relative pb-40">
      <div className="aura-bg">
        <div className="aura-blob bg-primary/10 top-0 left-0" />
        <div className="aura-blob bg-accent/10 bottom-0 right-0" />
      </div>

      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-3xl border-b border-border h-20 flex items-center px-6 md:px-12 justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="rounded-2xl h-12 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Workspace
        </Button>
        <div className="flex items-center gap-3">
          <Settings2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-headline font-bold uppercase tracking-widest">System Configuration</h1>
        </div>
        <div className="w-24" />
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-20">
        
        {/* Knowledge Hub */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Knowledge Hub</h2>
          </div>
          <button 
            onClick={() => router.push('/help')}
            className="w-full text-left p-8 rounded-[2.5rem] liquid-glass border-primary/20 group hover:border-primary transition-all shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-bold text-foreground flex items-center gap-3">
                  System Manual <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                  Deep dive into AuraCore Intelligence, Neural Mood Calibration, and the Sonic Processor (Studio FX).
                </p>
              </div>
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <BookOpen size={32} />
              </div>
            </div>
          </button>
        </section>

        {/* General Protocol */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Smartphone className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">General Protocol</h2>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-6 rounded-3xl liquid-glass border-white/5">
              <div>
                <h4 className="font-bold">Simple Mode</h4>
                <p className="text-xs text-muted-foreground">High-contrast, large-card interface for mobile focus.</p>
              </div>
              <Switch checked={false} onCheckedChange={() => router.push('/drive')} />
            </div>
            <div className="flex items-center justify-between p-6 rounded-3xl liquid-glass border-white/5">
              <div>
                <h4 className="font-bold">Haptic Feedback</h4>
                <p className="text-xs text-muted-foreground">Enable subtle vibrations on UI interactions.</p>
              </div>
              <Switch checked={isHapticsEnabled} onCheckedChange={setHapticsEnabled} />
            </div>
          </div>
        </section>

        {/* Data Architecture */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Database className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Data Architecture</h2>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-6 rounded-3xl liquid-glass border-white/5">
              <div>
                <h4 className="font-bold">Data Saver Mode</h4>
                <p className="text-xs text-muted-foreground">Prioritize bandwidth optimization during sync.</p>
              </div>
              <Switch checked={isDataSaverMode} onCheckedChange={setDataSaverMode} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={exportSystemData} variant="outline" className="h-16 rounded-2xl border-white/10 bg-white/5 gap-3 font-bold uppercase tracking-widest text-[10px]">
                <Download className="h-5 w-5 text-primary" /> Profile Backup
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="h-16 rounded-2xl border-white/10 bg-white/5 gap-3 font-bold uppercase tracking-widest text-[10px]">
                <Upload className="h-5 w-5 text-accent" /> Restore System
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
            </div>
          </div>
        </section>

        {/* Playback Protocol */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Playback Protocol</h2>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-6 rounded-3xl liquid-glass border-white/5">
              <div>
                <h4 className="font-bold">AI DJ Synergy</h4>
                <p className="text-xs text-muted-foreground">Let Aura Core introduce songs and curate your session.</p>
              </div>
              <Switch checked={aiDjMode} onCheckedChange={setAiDjMode} />
            </div>
            
            <div className="space-y-6 p-6 rounded-3xl liquid-glass border-white/5">
              <div className="flex justify-between items-center mb-2">
                <Label className="font-bold">Reels Auto-Scroll</Label>
                <span className="text-xs font-mono text-primary font-bold">{reelsAutoScrollLoops === 0 ? 'Off' : `${reelsAutoScrollLoops} Loop${reelsAutoScrollLoops > 1 ? 's' : ''}`}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Calibrate visual patterns before advancing the sequence.</p>
              <Slider 
                value={[reelsAutoScrollLoops]} 
                onValueChange={(v) => setReelsAutoScrollLoops(v[0])} 
                max={4} 
                step={1} 
              />
            </div>
          </div>
        </section>

        {/* Scanning Node */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <HardDrive className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Scanning Node</h2>
          </div>
          <div className="space-y-10 p-6 rounded-3xl liquid-glass border-white/5">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Min. File Size</Label>
                <span className="text-xs font-mono text-primary font-bold">{scannerSettings.minFileSizeMB} MB</span>
              </div>
              <Slider 
                value={[scannerSettings.minFileSizeMB]} 
                onValueChange={(v) => setScannerSettings({ ...scannerSettings, minFileSizeMB: v[0] })} 
                max={5} 
                min={0.1}
                step={0.1} 
              />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Min. Song Duration</Label>
                <span className="text-xs font-mono text-accent font-bold">{scannerSettings.minSongDurationSeconds} s</span>
              </div>
              <Slider 
                value={[scannerSettings.minSongDurationSeconds]} 
                onValueChange={(v) => setScannerSettings({ ...scannerSettings, minSongDurationSeconds: v[0] })} 
                max={60} 
                min={5}
                step={5} 
              />
            </div>
          </div>
        </section>

        {/* Intelligence Protocol */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Intelligence Protocol</h2>
          </div>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-6 rounded-3xl liquid-glass border-white/5">
              <div>
                <h4 className="font-bold">AI Cover Art Generation</h4>
                <p className="text-xs text-muted-foreground">Enable neural synthesis for missing album patterns.</p>
              </div>
              <Switch checked={aiCoverArtEnabled} onCheckedChange={setAiCoverArtEnabled} />
            </div>
            <div className="space-y-6 p-6 rounded-3xl liquid-glass border-white/5">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Google Gemini Pro Key</Label>
              <Input 
                type="password"
                placeholder="AIza..."
                value={apiKeys.gemini || ""}
                onChange={(e) => setApiKey('gemini', e.target.value)}
                className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-mono"
              />
            </div>
          </div>
        </section>

        {/* Aura Spectrum */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Aura Spectrum</h2>
          </div>
          <div className="grid gap-10">
            <div className="space-y-4">
              <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Neural Theme Synthesis</Label>
              <div className="flex flex-wrap gap-4">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setThemeColor(t.id as any)}
                    className={`group relative h-16 w-32 rounded-2xl border transition-all ${themeColor === t.id ? 'border-primary scale-105 shadow-xl shadow-primary/20' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`absolute inset-2 rounded-xl ${t.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <span className="absolute bottom-[-24px] left-0 right-0 text-center text-[10px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-8 rounded-3xl liquid-glass border-white/5">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-foreground">Ambient Shift</h4>
                <p className="text-sm text-muted-foreground">Toggle between Light and Dark interface modes.</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Danger Protocol */}
        <section className="pt-12 space-y-8">
          <div className="flex items-center gap-3 px-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-[10px] font-bold text-destructive uppercase tracking-[0.4em]">Danger Protocol</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-16 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 gap-3 font-bold uppercase tracking-widest text-[10px]">
                  <Trash2 className="h-5 w-5" /> Purge Sonic Data Node
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="liquid-glass border-destructive/20 rounded-[2.5rem] p-10">
                <AlertDialogHeader className="space-y-4">
                  <AlertDialogTitle className="text-3xl font-headline font-bold text-foreground">Final Confirmation</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground text-lg">
                    This protocol permanently deletes your <span className="text-foreground font-bold">Local Repository</span>, <span className="text-foreground font-bold">Favorites</span>, and <span className="text-foreground font-bold">Playlists</span>. Irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-10">
                  <AlertDialogCancel className="h-14 rounded-2xl">Abort</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePurge} className="h-14 rounded-2xl bg-destructive text-white">Commence Purge</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={handleSignOut} variant="ghost" className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 gap-3 font-bold uppercase tracking-widest text-[10px] text-foreground">
              <LogOut className="h-5 w-5" /> De-authorize Session
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
