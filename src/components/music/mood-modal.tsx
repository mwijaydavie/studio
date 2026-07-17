"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { detectMood } from '@/ai/flows/detect-mood-flow';
import { 
  X, Camera, Sparkles, Loader2, RefreshCcw, 
  Smile, Frown, Zap, BrainCircuit, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_MOODS = [
  { emoji: '🔥', name: 'Hype' },
  { emoji: '🌿', name: 'Chill' },
  { emoji: '🎧', name: 'Focus' },
  { emoji: '✨', name: 'Magic' },
  { emoji: '🌊', name: 'Flow' },
  { emoji: '🌙', name: 'Deep' },
  { emoji: '🎸', name: 'Rock' },
  { emoji: '⚡', name: 'Energy' },
];

export function MoodModal({ onClose }: { onClose: () => void }) {
  const { currentTrack, updateTrackMetadata, playUISound } = useMusic();
  const { toast } = useToast();
  
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSetMood = (emoji: string) => {
    if (!currentTrack) return;
    playUISound('resonance');
    updateTrackMetadata(currentTrack.id, { genre: `${emoji} Session` });
    toast({ title: "Mood Calibrated", description: `Session aura updated to ${emoji}.` });
    onClose();
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setHasCameraPermission(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setHasCameraPermission(false);
      toast({ variant: "destructive", title: "Camera Denied", description: "Authorization required for facial sync." });
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const dataUri = canvasRef.current.toDataURL('image/jpeg');
      stopCamera();
      setIsScanning(true);
      playUISound('click');

      try {
        const result = await detectMood({ photoDataUri: dataUri });
        handleSetMood(result.emoji);
      } catch (e) {
        toast({ variant: "destructive", title: "Analysis Failed", description: "AI engine could not resolve facial aura." });
      } finally {
        setIsScanning(false);
      }
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-white">Neural Mood Sync</h3>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest truncate max-w-[180px]">
                {currentTrack.title}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5">
            <X className="h-6 w-6" />
          </Button>
        </header>

        <div className="p-8 space-y-8">
          {showCamera ? (
            <div className="space-y-6">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-black border border-primary/20 shadow-inner">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="flex gap-3">
                <Button onClick={stopCamera} variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 font-bold uppercase text-[10px] tracking-widest">
                  Abort
                </Button>
                <Button onClick={handleCapture} className="flex-[2] h-14 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest gap-2">
                  <Camera size={16} /> Snap & Analyze
                </Button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={startCamera}
                disabled={isScanning}
                className="w-full group relative aspect-video rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/40 transition-all overflow-hidden"
              >
                {isScanning ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Scanning Aura...</span>
                  </div>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-bold text-sm text-white">Biometric Mood Scan</p>
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Detect mood from facial expression</p>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Manual Calibration</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {DEFAULT_MOODS.map(mood => (
                    <button 
                      key={mood.emoji}
                      onClick={() => handleSetMood(mood.emoji)}
                      className="aspect-square rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
                      title={mood.name}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/40">
          <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
            Aura Biometric Protocol v4.2 • Secured Encryption
          </p>
        </footer>
      </div>
      <style jsx global>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
}
