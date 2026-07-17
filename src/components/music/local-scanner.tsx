
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { HardDrive, Loader2, Plus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/context/music-context';
import { Track } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

export function LocalScanner() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();
  const { applaudTrack } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    setScanning(true);
    const fileList = Array.from(files);
    
    const validFiles = fileList.filter(f => 
      f.type.startsWith('audio/') || 
      f.type.startsWith('video/') ||
      f.name.match(/\.(mp3|mp4|wav|m4a|ogg|flac|aac)$/i)
    );
    
    if (validFiles.length === 0) {
      toast({ variant: "destructive", title: "Format Blocked", description: "No valid workstation nodes identified." });
      setScanning(false);
      return;
    }

    setProgress({ current: 0, total: validFiles.length });

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const objectUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4');
      
      // Dynamic Visual Synthesis for Local Nodes
      // This ensures scanned files have a distinct workstation aesthetic
      const visualSeed = (file.name.length * 7) % 1000;
      const coverUrl = `https://picsum.photos/seed/aura-node-${visualSeed}/600/600`;

      const track: Omit<Track, 'addedAt'> = {
        id: `${isVideo ? 'reel' : 'audio'}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Internal Repository",
        genre: isVideo ? "Video Reel" : "Local Audio",
        duration: "---",
        coverUrl: coverUrl,
        audioUrl: objectUrl,
        isLocal: true,
        source: 'local'
      };
      
      applaudTrack(track);
      setProgress(prev => ({ ...prev, current: i + 1 }));
      if (i % 3 === 0) await new Promise(r => setTimeout(r, 10));
    }

    toast({ title: "Synthesis Complete", description: `Added ${validFiles.length} nodes to Repository.` });
    setScanning(false);
  };

  return (
    <div className="relative group">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept="audio/*,video/*" 
        onChange={(e) => e.target.files && processFiles(e.target.files)} 
      />
      
      <div className="liquid-glass rounded-[2rem] p-6 border-white/5 transition-all hover:border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left flex-1">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <HardDrive className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-primary justify-center md:justify-start">
                <Sparkles className="h-2 w-2 animate-pulse" /> {isMobile ? "Scan Mode" : "Pattern Hub"}
              </div>
              <h3 className="text-lg font-headline font-bold text-foreground tracking-tighter uppercase">
                {isMobile ? "Scan Device Node" : "Upload Local Patterns"}
              </h3>
              <p className="text-muted-foreground text-[10px] max-w-sm font-medium opacity-60">
                Synchronize audio patterns from your {isMobile ? "hardware" : "internal repository"} instantly.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={scanning} 
              className="rounded-xl h-12 px-6 font-black uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10 text-foreground text-[10px]"
            >
              {isMobile ? "Explore Storage" : "Batch Select Music"}
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={scanning} 
              className="rounded-xl h-12 px-8 font-black uppercase tracking-widest bg-primary text-white hover:scale-[1.02] shadow-xl gap-3 text-[10px]"
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {scanning ? `Syncing ${progress.current}/${progress.total}...` : (isMobile ? "Initialize Scan" : "Initialize Upload")}
            </Button>
          </div>
        </div>
        
        {scanning && (
          <div className="mt-6 space-y-2 animate-fade-in">
             <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-primary">
                <span>Calibrating signal...</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
             </div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-[0_0_10px_rgba(162,76,241,0.8)] transition-all duration-300" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }} 
                />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
