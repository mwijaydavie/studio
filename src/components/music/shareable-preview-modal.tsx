
"use client";

import React, { useState } from 'react';
import { Track } from '@/lib/types';
import { X, Copy, Share2, Music, Sparkles, Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const cardStyles = [
    { type: 'now_streaming', name: 'Streaming', icon: Music },
    { type: 'artist', name: 'Artist', icon: Sparkles },
    { type: 'brand', name: 'Identity', icon: Smartphone },
];

interface ShareablePreviewModalProps {
    track: Track;
    onClose: () => void;
    showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

/**
 * Aura Shareable Preview Node
 * Synthesizes cinematic social cards for patterns and artists.
 */
export function ShareablePreviewModal({ track, onClose, showNotification }: ShareablePreviewModalProps) {
    const [activeStyle, setActiveStyle] = useState('now_streaming');

    const handleCopyNode = async () => {
        if (!track.coverUrl) return;
        try {
            const response = await fetch(track.coverUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ [blob.type]: blob })
            ]);
            showNotification('Spectral art copied to clipboard!', 'success');
        } catch (err) {
            await navigator.clipboard.writeText(track.coverUrl);
            showNotification('Image link synchronized to clipboard.', 'info');
        }
    };
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Bridging Frequency: ${track.title}`,
                    text: `Synchronize with "${track.title}" by ${track.artist} on AuraTune Pro Workstation.`,
                    url: window.location.href
                });
            } catch (e) {
                console.log('Share Link Offline');
            }
        } else {
            showNotification('Universal Share Node not supported on this hardware.', 'error');
        }
    };

    const CardContent = ({ type }: { type: string }) => {
        switch (type) {
            case 'now_streaming':
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 w-full">
                        <div className="flex items-center gap-3 self-start">
                            <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center font-bold text-primary border border-white/10">A</div>
                            <span className="font-headline font-bold uppercase text-[10px] tracking-widest text-white/60">Now Synchronizing</span>
                        </div>
                        <div className="relative aspect-square w-56 rounded-[2.5rem] overflow-hidden shadow-3xl border border-white/10">
                            <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center space-y-1">
                            <h2 className="text-3xl font-headline font-bold tracking-tighter text-white">{track.title}</h2>
                            <p className="text-primary font-bold uppercase text-[10px] tracking-[0.3em]">{track.artist}</p>
                        </div>
                    </motion.div>
                );
            case 'artist':
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 w-full">
                        <div className="flex items-center gap-3 self-start">
                            <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center font-bold text-primary border border-white/10">A</div>
                            <span className="font-headline font-bold uppercase text-[10px] tracking-widest text-white/60">Artist Focus Node</span>
                        </div>
                        <div className="relative aspect-square w-56 rounded-full overflow-hidden shadow-3xl border-4 border-white/10 ring-4 ring-primary/20">
                            <img src={track.coverUrl} alt={track.artist} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-4xl font-headline font-bold tracking-tighter text-white">{track.artist}</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-2">Verified Aura Node</p>
                        </div>
                    </motion.div>
                );
            case 'brand':
                 return (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 w-full">
                        <div className="flex items-center gap-3 self-start">
                             <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center font-bold text-primary border border-white/10">A</div>
                            <span className="font-headline font-bold uppercase text-[10px] tracking-widest text-white/60">AuraTune Pro</span>
                        </div>
                        <div className="aspect-square w-56 rounded-[2.5rem] shadow-3xl flex flex-col items-center justify-center bg-gradient-to-br from-primary to-accent p-8 text-center border border-white/20">
                             <p className="text-4xl font-headline font-bold text-white leading-none tracking-tighter">Your Sound. <br/><span className="opacity-60">Synthesized.</span></p>
                        </div>
                        <div className="text-center">
                             <h2 className="text-2xl font-bold text-white">{track.title}</h2>
                             <p className="text-white/40 font-bold uppercase text-[8px] tracking-widest mt-1">{track.artist}</p>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-6" onClick={onClose}>
            {/* Immersive Blurred Backdrop */}
            <div 
                className="absolute inset-0 bg-cover bg-center blur-[100px] scale-125 opacity-40 transition-all duration-1000"
                style={{ backgroundImage: `url(${track.coverUrl})` }}
            />
            <div className="absolute inset-0 bg-black/80" />

            <div className="relative z-10 w-full max-w-sm flex flex-col gap-10" onClick={e => e.stopPropagation()}>
                <div className="liquid-glass rounded-[3.5rem] p-10 flex flex-col items-center shadow-3xl border-white/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                    <CardContent type={activeStyle} />
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-1.5 rounded-3xl flex items-center gap-1 shadow-2xl">
                        {cardStyles.map(style => (
                            <button 
                                key={style.type}
                                onClick={() => setActiveStyle(style.type)}
                                className={cn(
                                  "py-3 px-6 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2",
                                  activeStyle === style.type ? "bg-primary text-white shadow-xl scale-105" : "text-white/40 hover:text-white"
                                )}
                            >
                                <style.icon size={12} />
                                {style.name}
                            </button>
                        ))}
                    </div>

                    <div className="w-full flex gap-3">
                        <Button 
                            onClick={handleCopyNode}
                            variant="outline"
                            className="h-16 w-20 rounded-3xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                            title="Copy Spectral Art"
                        >
                            <Copy size={20} />
                        </Button>
                        <Button 
                            onClick={handleShare}
                            className="flex-1 h-16 rounded-3xl bg-primary text-white font-black uppercase text-xs tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            <Share2 size={20} /> Bridge to Social
                        </Button>
                    </div>
                </div>
            </div>

            <button onClick={onClose} className="absolute top-10 right-10 h-14 w-14 rounded-2xl liquid-glass flex items-center justify-center text-white hover:bg-white/10 transition-colors z-[130]">
                <X size={28} />
            </button>
        </div>
    );
}
