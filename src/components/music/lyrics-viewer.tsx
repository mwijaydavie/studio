
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useMusic } from '@/context/music-context';
import { transcribeLyrics } from '@/ai/flows/lyric-transcription-flow';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles, Download, Zap, Clock, Save, Edit3, Radio, Upload, FileText } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

export function LyricsViewer() {
  const { currentTrack, currentTime, isPlaying, lyricScrollSpeed, setLyricScrollSpeed, updateTrackMetadata, playUISound } = useMusic();
  const [lyricsData, setLyricsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [manualText, setManualText] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isRadio = currentTrack?.source === 'radio';

  useEffect(() => {
    if (currentTrack) {
      setManualText(currentTrack.moodEmoji || "");
    }
  }, [currentTrack?.id]);

  const handleScanAI = async () => {
    if (!currentTrack || isRadio) return;
    setLoading(true);
    playUISound('resonance');
    try {
      const result = await transcribeLyrics({
        audioTitle: currentTrack.title,
        artistName: currentTrack.artist,
        targetLanguage: "English"
      });
      setLyricsData(result);
    } catch (e) {
      console.error("Transcription failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setManualText(text);
        setMode('manual');
        toast({ title: "Lyrics Imported", description: "Synchronized from local file node." });
      };
      reader.readAsText(file);
    }
  };

  const handleExportPDF = () => {
    if (!currentTrack) return;
    const doc = new jsPDF();
    
    doc.setFillColor(15, 13, 20);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(162, 76, 241);
    doc.text("AURATUNE SYNC REPORT", 20, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`SESSION ID: ${Date.now()}`, 20, 42);
    
    doc.setDrawColor(162, 76, 241);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Track Intelligence", 20, 65);
    
    doc.setFontSize(11);
    doc.setTextColor(180, 180, 180);
    doc.text(`Node: ${currentTrack.title}`, 25, 75);
    doc.text(`Architect: ${currentTrack.artist}`, 25, 82);
    
    doc.setFillColor(30, 25, 45);
    doc.roundedRect(20, 95, 170, 160, 5, 5, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(162, 76, 241);
    doc.text("Synchronized Lyrics / Notes", 30, 110);
    
    const content = mode === 'manual' ? manualText : (lyricsData?.lyrics?.map((l: any) => l.text).join('\n') || "No data synthesized.");
    const split = doc.splitTextToSize(content, 150);
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(split, 35, 125);
    
    doc.save(`AuraTune_Node_${currentTrack.title.replace(/\s+/g, '_')}.pdf`);
    toast({ title: "Synthesis Exported", description: "Node report synthesized to PDF." });
  };

  const activeIndex = useMemo(() => {
    if (!lyricsData?.lyrics || mode === 'manual') return -1;
    const idx = lyricsData.lyrics.findIndex((l: any, i: number) => {
      const next = lyricsData.lyrics[i + 1];
      return currentTime >= l.time && (!next || currentTime < next.time);
    });
    return idx === -1 ? 0 : idx;
  }, [currentTime, lyricsData, mode]);

  useEffect(() => {
    if (!isPlaying || !scrollRef.current) return;
    const interval = setInterval(() => {
      if (scrollRef.current) scrollRef.current.scrollTop += lyricScrollSpeed;
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, lyricScrollSpeed]);

  const toggleTimer = () => {
    if (isTimerActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTimerActive(false);
    } else {
      setIsTimerActive(true);
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const handleSaveManual = () => {
    if (currentTrack) {
      updateTrackMetadata(currentTrack.id, { moodEmoji: manualText });
      playUISound('resonance');
      toast({ title: "Node Saved", description: "Manual data synchronized to repository." });
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="h-full w-full flex flex-col items-center relative">
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        <button 
          onClick={toggleTimer}
          className={cn(
            "px-3 h-8 rounded-lg border flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all",
            isTimerActive ? "bg-primary/20 border-primary text-primary" : "bg-foreground/5 border-border/10 text-muted-foreground"
          )}
        >
          <Clock size={10} className={isTimerActive ? "animate-pulse" : ""} /> {formatTimer(timerSeconds)}
        </button>
        <Button variant="ghost" size="icon" onClick={handleExportPDF} className="h-8 w-8 rounded-lg bg-foreground/5 border border-border/10 text-muted-foreground">
          <Download size={14} />
        </Button>
        <div className="flex bg-foreground/10 border border-border/10 rounded-lg p-0.5">
          <button onClick={() => setMode('ai')} className={cn("px-3 py-1 rounded-md text-[7px] font-black uppercase tracking-widest transition-all", mode === 'ai' ? "bg-primary text-white shadow-lg" : "text-muted-foreground")}>AI Scan</button>
          <button onClick={() => setMode('manual')} className={cn("px-3 py-1 rounded-md text-[7px] font-black uppercase tracking-widest transition-all", mode === 'manual' ? "bg-primary text-white shadow-lg" : "text-muted-foreground")}>Manual Write</button>
        </div>
      </div>

      <div className="w-full h-full overflow-y-auto scrollbar-hide scroll-smooth" ref={scrollRef}>
        <div className="flex flex-col items-center gap-4 py-20">
          {mode === 'ai' ? (
            loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-40" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 animate-pulse">Syncing Neural Lines...</p>
              </div>
            ) : lyricsData?.lyrics ? (
              lyricsData.lyrics.map((line: any, i: number) => (
                <div key={i} className="text-center space-y-1 px-6 max-w-lg">
                  <p className={cn("text-lg md:text-2xl font-headline font-bold transition-all duration-700", i === activeIndex ? "text-foreground scale-105" : "text-foreground/10")}>{line.text}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-6 py-12">
                <div className={cn("h-16 w-16 rounded-3xl liquid-glass flex items-center justify-center animate-float", isRadio ? "opacity-20 grayscale" : "border-primary/20 shadow-3xl")}>
                  {isRadio ? <Radio size={24} className="text-muted-foreground" /> : <Zap size={24} className="text-primary" />}
                </div>
                <div className="text-center space-y-2">
                  <h4 className="font-headline font-bold text-foreground">Neural Pattern Scanning</h4>
                  <p className="text-[10px] text-muted-foreground max-w-[240px] uppercase font-bold tracking-widest">
                    {isRadio ? "Dynamic Frequency detected. Live Radio streams cannot be stationary scanned." : "System ready to analyze acoustic patterns from online nodes or local repository."}
                  </p>
                </div>
                {!isRadio && (
                  <div className="flex gap-3">
                    <Button onClick={handleScanAI} className="rounded-xl h-12 px-8 bg-primary text-white font-bold uppercase tracking-widest text-[10px] shadow-xl">Initialize Scan</Button>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-xl h-12 px-8 border-white/10 bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                      <Upload size={14} className="mr-2" /> Upload LRC
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.lrc" onChange={handleFileUpload} />
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="w-full max-w-lg flex flex-col items-center gap-6 px-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 text-primary">
                  <Edit3 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Manual Studio</span>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                  <FileText size={10} /> Import TXT
                </button>
              </div>
              <textarea 
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Synthesize manual lyrics or acoustic notes here..."
                className="w-full min-h-[350px] bg-foreground/5 border border-border/10 rounded-2xl p-6 text-lg text-foreground leading-relaxed outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <Button onClick={handleSaveManual} className="rounded-xl h-14 px-12 bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] gap-2 shadow-xl hover:scale-[1.02] transition-transform">
                <Save size={14} /> Synchronize Node
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-36 bg-background/60 backdrop-blur-3xl border border-border/10 rounded-xl p-2 space-y-1.5 z-30 pointer-events-auto">
        <div className="flex justify-between items-center text-[6px] font-black uppercase tracking-widest text-primary">
          <span>Velocity</span>
          <span>{lyricScrollSpeed.toFixed(1)}x</span>
        </div>
        <Slider value={[lyricScrollSpeed]} min={0.5} max={3.0} step={0.1} onValueChange={(v) => setLyricScrollSpeed(v[0])} className="h-1" />
      </div>
    </div>
  );
}
