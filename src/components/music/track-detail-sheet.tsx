"use client";

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Track } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, Share2, Zap, Music, Check, Clock,
  Edit2, BrainCircuit, FileText, Sparkles, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/context/music-context';
import { ShareablePreviewModal } from './shareable-preview-modal';
import { PyramidLoader } from '@/components/ui/pyramid-loader';

interface TrackDetailSheetProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (track: Track) => void;
  isFavorite: boolean;
  onToggleFavorite: (track: Track) => void;
}

export function TrackDetailSheet({ 
  track, 
  isOpen, 
  onClose, 
  onPlay, 
}: TrackDetailSheetProps) {
  const { toast } = useToast();
  const { updateTrackMetadata, synthesizeTrackCover, isSynthesizingCover } = useMusic();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Track>>({});
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (track) {
      setEditData({ 
        title: track.title, 
        artist: track.artist,
        moodEmoji: track.moodEmoji || "" 
      });
    }
  }, [track]);

  if (!track) return null;

  const handleSave = () => {
    if (track) {
      updateTrackMetadata(track.id, editData);
      setIsEditing(false);
      toast({ title: "Neural Link Updated", description: "Metadata recalibrated." });
    }
  };

  const ResonanceFallback = () => (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-black flex items-center justify-center">
      <span className="text-8xl font-headline font-bold text-white/20 drop-shadow-2xl">{track.title.charAt(0).toUpperCase()}</span>
    </div>
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setIsEditing(false); } }}>
        <SheetContent className="w-full sm:max-w-md bg-background text-foreground border-l border-border p-0 overflow-y-auto scrollbar-hide shadow-3xl">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Zap size={120} className="text-primary" />
          </div>

          <SheetHeader className="px-8 pt-8 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <BrainCircuit size={12} className="text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Acoustic Analysis</span>
            </div>
            <SheetTitle className="text-2xl font-headline font-bold tracking-tighter text-foreground">Pattern Repository</SheetTitle>
          </SheetHeader>

          <div className="relative h-72 w-full mt-6 group overflow-hidden">
            {isSynthesizingCover ? (
              <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center gap-6 animate-in fade-in">
                 <PyramidLoader />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Synthesizing Artwork</p>
              </div>
            ) : null}
            
            {track.coverUrl && !track.coverUrl.includes('archive.org') ? (
              <img src={track.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
            ) : <ResonanceFallback />}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div className="min-w-0 flex-1 mr-4">
                {!isEditing ? (
                  <>
                    <h2 className="text-3xl font-headline font-bold tracking-tight truncate text-foreground drop-shadow-lg">{track.title}</h2>
                    <p className="text-primary font-bold uppercase tracking-widest text-[10px]">{track.artist}</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Input 
                      value={editData.title ?? ""} 
                      onChange={e => setEditData({...editData, title: e.target.value})}
                      className="bg-background/60 border-white/20 font-bold h-12 rounded-xl backdrop-blur-md text-foreground"
                      placeholder="Title"
                    />
                    <Input 
                      value={editData.artist ?? ""} 
                      onChange={e => setEditData({...editData, artist: e.target.value})}
                      className="bg-background/60 border-white/20 text-primary font-medium h-10 rounded-xl"
                      placeholder="Artist"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={cn("h-12 w-12 rounded-2xl shadow-xl transition-all", isEditing ? "bg-emerald-500 text-white" : "bg-white/10 backdrop-blur-md text-white")}
                >
                  {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
                </Button>
                {!isEditing && track.source === 'local' && (
                  <Button 
                    onClick={() => synthesizeTrackCover(track)}
                    disabled={isSynthesizingCover}
                    className="h-12 w-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    {isSynthesizingCover ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 relative z-10">
            <Button 
              onClick={() => onPlay(track)}
              className="w-full h-16 rounded-2xl bg-primary text-white font-bold gap-3 text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              <Play className="h-6 w-6 fill-current" /> Play Session
            </Button>

            {isEditing && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary">
                  <FileText className="h-3 w-3" /> Manual Lyrics Studio
                </div>
                <Textarea 
                  value={editData.moodEmoji ?? ""}
                  onChange={e => setEditData({...editData, moodEmoji: e.target.value})}
                  placeholder="Paste lyrics here for manual scroll mode..."
                  className="min-h-[200px] bg-white/5 border-white/10 rounded-2xl p-4 text-sm leading-relaxed"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <Button onClick={() => setShowShareModal(true)} variant="ghost" className="h-14 rounded-2xl bg-foreground/5 border border-border/50 gap-3 justify-center px-6 hover:bg-foreground/10">
                <Share2 className="h-5 w-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-foreground">Bridge Link</span>
              </Button>
            </div>

            <div className="p-6 rounded-[2.5rem] border border-border/50 space-y-4 bg-foreground/[0.02] liquid-glass">
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground flex items-center gap-2 font-medium"><Music size={14} /> Genre</span>
                <span className="font-bold uppercase text-[10px] text-foreground">{track.genre}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground flex items-center gap-2 font-medium"><Clock size={14} /> Source</span>
                <span className="text-[8px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase border border-primary/20">{track.source || 'LOCAL'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-primary">
                <Zap className="h-3 w-3" /> Neural Insight
              </div>
              <div className="p-6 rounded-[2.5rem] border border-border/50 italic text-[11px] leading-relaxed text-muted-foreground bg-foreground/[0.01]">
                "Spectral analysis suggests this frequency node aligns with high-density focus history. Resonance probability: 94.2%."
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {showShareModal && (
        <ShareablePreviewModal track={track} onClose={() => setShowShareModal(false)} showNotification={(msg) => toast({ title: msg })} />
      )}
    </>
  );
}
