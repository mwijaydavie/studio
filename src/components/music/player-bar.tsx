
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { Visualizer } from './visualizer';
import { AudioFxModal } from './audio-fx-modal';
import { MoodModal } from './mood-modal';
import { LyricsViewer } from './lyrics-viewer';
import { ElasticSlider } from '@/components/ui/elastic-slider';
import { 
  Play, Pause, ChevronDown, Maximize2, Minimize2, Zap, Heart, Smile, SlidersHorizontal, SkipBack, SkipForward, FileText, Volume2, Activity, VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

export function PlayerBar() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, currentTime, duration, seekTo, toggleFavorite, isFavorite, playUISound, isSidebarCollapsed, volume, setVolume, cycleVisualizer } = useMusic();
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showFxModal, setShowFxModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const lastTapRef = useRef<number>(0);
  const isRadio = currentTrack?.source === 'radio';

  const formatTime = (time: number) => { if (!isFinite(time)) return "0:00"; const m = Math.floor(time / 60); const s = Math.floor(time % 60); return `${m}:${s.toString().padStart(2, '0')}`; };

  if (!currentTrack || pathname === '/') return null;

  return (
    <>
      <AnimatePresence>
        {isFullPlayer && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed inset-0 z-[200] bg-background flex flex-col shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-20"><img src={currentTrack.coverUrl} className="w-full h-full object-cover blur-[140px] scale-150" alt="" /><div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" /><Visualizer /></div>
            <header className="relative flex items-center justify-between p-8 shrink-0"><Button variant="ghost" onClick={() => setIsFullPlayer(false)}><ChevronDown /></Button><div className="text-center"><h2 className="text-xl font-headline font-bold truncate">{currentTrack.title}</h2><p className="text-primary font-black uppercase tracking-widest text-[9px]">{currentTrack.artist}</p></div><Button variant="ghost" onClick={cycleVisualizer}><Activity className="text-primary" /></Button></header>
            <main className="relative flex-1 flex flex-col items-center justify-center p-8 gap-10 max-w-2xl mx-auto w-full">
              <div className="relative w-full aspect-square max-h-[45vh] shrink-0" onClick={() => { const now = Date.now(); if (now - lastTapRef.current < 300) togglePlay(); lastTapRef.current = now; }}>
                <AnimatePresence mode="wait">{!showLyrics ? (<motion.div key="c" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full rounded-[3rem] overflow-hidden shadow-3xl border-2 border-white/5 bg-black/20"><img src={currentTrack.coverUrl} className="w-full h-full object-contain" /></motion.div>) : (<motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full liquid-glass rounded-[3rem] p-6"><LyricsViewer /></motion.div>)}</AnimatePresence>
              </div>
              <div className="w-full space-y-10">
                <div className={cn("space-y-4", isRadio && "opacity-20 pointer-events-none")}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono"><span>{formatTime(currentTime)}</span><span>{isRadio ? 'LIVE NODE' : formatTime(duration)}</span></div>
                  <ElasticSlider maxValue={duration || 1} value={currentTime} onValueChange={seekTo} />
                  <div className="flex items-center justify-between px-2">
                    <div className="flex gap-3"><Button variant="ghost" onClick={() => setShowMoodModal(true)}><Smile /></Button><Button variant="ghost" onClick={() => setShowFxModal(true)}><SlidersHorizontal /></Button></div>
                    <div className="flex items-center gap-8"><Button variant="ghost" disabled={isRadio} onClick={prevTrack}><SkipBack className="fill-current"/></Button><Button onClick={togglePlay} className="h-20 w-20 rounded-full bg-primary text-white shadow-xl">{isPlaying ? <Pause className="fill-current"/> : <Play className="fill-current translate-x-1"/>}</Button><Button variant="ghost" disabled={isRadio} onClick={nextTrack}><SkipForward className="fill-current"/></Button></div>
                    <div className="flex gap-3"><Button variant="ghost" onClick={() => setShowLyrics(!showLyrics)} className={cn(showLyrics && "text-primary")}><FileText /></Button><Button variant="ghost" onClick={() => toggleFavorite(currentTrack)} className={cn(isFavorite(currentTrack.id) && "text-rose-500")}><Heart fill={isFavorite(currentTrack.id) ? "currentColor" : "none"}/></Button></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.03] border border-border/50"><Volume2 size={16} className="text-muted-foreground" /><ElasticSlider value={volume} onValueChange={setVolume} className="flex-1" /><span className="text-[9px] font-mono font-bold text-primary">{volume}%</span></div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={cn("fixed bottom-8 z-[100] transition-all duration-700 h-14 liquid-glass rounded-2xl px-4 flex items-center justify-between shadow-3xl max-w-3xl mx-auto", isFullPlayer ? "opacity-0 translate-y-10" : "opacity-100", !isMobile ? (isSidebarCollapsed ? "left-[100px] right-[20px]" : "left-[280px] right-[24px]") : "left-[5%] right-[5%]")} onDoubleClick={() => setIsFullPlayer(true)}>
        <div className="flex items-center gap-3 w-1/2 cursor-pointer" onClick={() => setIsFullPlayer(true)}><div className="h-10 w-10 rounded-lg overflow-hidden shrink-0"><img src={currentTrack.coverUrl} className="w-full h-full object-cover" /></div><div className="min-w-0"><h4 className="font-headline font-bold text-[11px] truncate">{currentTrack.title}</h4><p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest truncate">{currentTrack.artist}</p></div></div>
        <div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={() => setIsFullPlayer(true)}><Maximize2 size={14} /></Button><Button size="icon" onClick={togglePlay} className="h-9 w-9 rounded-xl bg-primary">{isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}</Button></div>
      </div>
      {showFxModal && <AudioFxModal onClose={() => setShowFxModal(false)} />}
      {showMoodModal && <MoodModal onClose={() => setShowMoodModal(false)} />}
    </>
  );
}
