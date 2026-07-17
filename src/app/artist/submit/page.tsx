
"use client";

import React, { useState } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, ArrowLeft, ArrowRight, Music, 
  Image as ImageIcon, Globe, Loader2, CheckCircle2, Zap 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, title: 'Identity', desc: 'Node Metadata' },
  { id: 2, title: 'Signal', desc: 'Acoustic Path' },
  { id: 3, title: 'Deploy', desc: 'Review Node' }
];

export default function ArtistSubmissionPage() {
  const { firestore, user } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artistName: '',
    genre: '',
    audioUrl: '',
    coverUrl: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'artistSubmissions'), {
        ...formData,
        userId: user.uid,
        status: 'pending',
        submittedAt: serverTimestamp()
      });
      
      toast({
        title: "Frequency Transmitted",
        description: "Your node has been queued for verification."
      });
      router.push('/dashboard');
    } catch (e) {
      toast({ variant: "destructive", title: "Transmission Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MainSidebar />
      
      <main className="flex-1 flex flex-col transition-all duration-500 overflow-y-auto scrollbar-hide md:ml-64">
        <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-border bg-background/40 backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-headline font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                Frequency Submission
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60">Global Node Pipeline v7.0</p>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
          {/* Stepper Node */}
          <div className="flex justify-between items-center px-4 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -z-10" />
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 border",
                  step >= s.id ? "bg-primary border-primary text-white shadow-xl scale-110" : "bg-zinc-900 border-white/5 text-muted-foreground"
                )}>
                  {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                </div>
                <div className="text-center">
                  <p className={cn("text-[10px] font-black uppercase tracking-widest", step >= s.id ? "text-primary" : "text-muted-foreground")}>{s.title}</p>
                  <p className="text-[8px] text-muted-foreground opacity-40 uppercase">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="liquid-glass rounded-[3rem] p-8 md:p-12 border-white/5 relative overflow-hidden min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Zap size={120} className="text-primary" />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">Identity Calibration</h3>
                    <p className="text-muted-foreground text-sm">Define the metadata for your acoustic pattern.</p>
                  </div>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Node Title</label>
                      <Input 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="h-14 bg-black/40 border-white/10 rounded-2xl px-6 text-lg" 
                        placeholder="e.g. Spectral Resonance"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Architect Name</label>
                      <Input 
                        value={formData.artistName} 
                        onChange={e => setFormData({...formData, artistName: e.target.value})}
                        className="h-14 bg-black/40 border-white/10 rounded-2xl px-6 text-lg" 
                        placeholder="Your producer alias"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Node Genre</label>
                      <Input 
                        value={formData.genre} 
                        onChange={e => setFormData({...formData, genre: e.target.value})}
                        className="h-14 bg-black/40 border-white/10 rounded-2xl px-6 text-lg" 
                        placeholder="Techno, Ambient, etc."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">Signal Link</h3>
                    <p className="text-muted-foreground text-sm">Synchronize the acoustic path and visual pattern.</p>
                  </div>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Audio Frequency (URL)</label>
                      <div className="relative">
                        <Music className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          value={formData.audioUrl} 
                          onChange={e => setFormData({...formData, audioUrl: e.target.value})}
                          className="h-14 bg-black/40 border-white/10 rounded-2xl pl-14 pr-6" 
                          placeholder="https://...mp3"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Spectral Pattern (Cover URL)</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                          value={formData.coverUrl} 
                          onChange={e => setFormData({...formData, coverUrl: e.target.value})}
                          className="h-14 bg-black/40 border-white/10 rounded-2xl pl-14 pr-6" 
                          placeholder="https://...jpg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex gap-4 items-center">
                    <Globe className="h-8 w-8 text-primary" />
                    <p className="text-xs text-muted-foreground leading-relaxed italic">"Ensure your URLs are public. Private nodes will fail verification sync."</p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10 flex-1"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-headline font-bold">Final Synthesis</h3>
                    <p className="text-muted-foreground text-sm">Review your node before transmitting to System Core.</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-10 items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                    <div className="h-48 w-48 rounded-[2rem] overflow-hidden shadow-2xl border-2 border-primary/20 shrink-0">
                      <img src={formData.coverUrl || 'https://picsum.photos/seed/placeholder/400/400'} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="space-y-4 text-center md:text-left flex-1">
                      <div>
                        <h4 className="text-4xl font-headline font-bold tracking-tighter text-white">{formData.title || 'Untitled'}</h4>
                        <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">{formData.artistName || 'Anonymous Architect'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest">{formData.genre}</span>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-400">Verified Path</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] text-muted-foreground uppercase text-center font-bold tracking-[0.3em]">Neural Verification in Progress</p>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-pulse w-full" />
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex gap-4">
              {step > 1 && (
                <Button 
                  onClick={handleBack} 
                  variant="outline" 
                  className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 font-bold uppercase tracking-widest text-[10px]"
                >
                  Recalibrate
                </Button>
              )}
              <Button 
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={loading}
                className="h-16 flex-1 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    {step === 3 ? 'Commence Transmission' : 'Advance Node'}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </div>

          <footer className="text-center space-y-4 opacity-40">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">Workstation Pipeline • Secure Node</p>
          </footer>
        </div>
      </main>

      <PlayerBar />
    </div>
  );
}
