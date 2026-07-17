"use client";

import React, { useState } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { useMusic } from '@/context/music-context';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, where } from 'firebase/firestore';
import { 
  Music, Plus, Trash2, ArrowLeft, Loader2, Sparkles, 
  Search, ExternalLink, ShieldCheck, Globe, Database,
  CheckCircle2, XCircle, Clock, Play, ListMusic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GlobalNodesManager() {
  const router = useRouter();
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const { isSidebarCollapsed, playTrack } = useMusic();
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', artist: '', genre: '', audioUrl: '', coverUrl: '', price: '0.99' });

  // Fetch Active Global Nodes
  const nodesQuery = useMemoFirebase(() => query(collection(firestore, 'globalTracks')), [firestore]);
  const { data: nodes, isLoading: isLoadingNodes } = useCollection(nodesQuery);

  // Fetch Pending Artist Submissions
  const submissionsQuery = useMemoFirebase(() => 
    query(collection(firestore, 'artistSubmissions'), where('status', '==', 'pending'))
  , [firestore]);
  const { data: submissions, isLoading: isLoadingSubmissions } = useCollection(submissionsQuery);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.audioUrl) return;

    try {
      await addDoc(collection(firestore, 'globalTracks'), {
        ...formData,
        price: parseFloat(formData.price),
        isVerified: true,
        uploadedBy: user?.uid,
        createdAt: serverTimestamp(),
      });
      setFormData({ title: '', artist: '', genre: '', audioUrl: '', coverUrl: '', price: '0.99' });
      setIsAdding(false);
      toast({ title: "Frequency Synthesized", description: "Node added to global network." });
    } catch (e) {
      toast({ variant: "destructive", title: "Synthesis Failed" });
    }
  };

  const handleDeleteNode = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'globalTracks', id));
      toast({ title: "Node Terminated", description: "Frequency removed from network." });
    } catch (e) {
      toast({ variant: "destructive", title: "Cleanup Error" });
    }
  };

  const handleApproveSubmission = async (sub: any) => {
    try {
      // 1. Create Global Track
      await addDoc(collection(firestore, 'globalTracks'), {
        title: sub.title,
        artist: sub.artistName,
        genre: sub.genre,
        audioUrl: sub.audioUrl,
        coverUrl: sub.coverUrl,
        price: 0.99,
        isVerified: true,
        uploadedBy: sub.userId,
        createdAt: serverTimestamp(),
      });

      // 2. Update Submission Status
      await updateDoc(doc(firestore, 'artistSubmissions', sub.id), {
        status: 'approved',
        updatedAt: serverTimestamp()
      });

      // 3. Notify Architect
      const notifyRef = doc(collection(firestore, 'users', sub.userId, 'notifications'));
      await addDoc(collection(firestore, 'users', sub.userId, 'notifications'), {
        id: notifyRef.id,
        title: "Node Verified",
        message: `Your frequency "${sub.title}" has been approved for Global Hub listing.`,
        type: 'frequency',
        isRead: false,
        createdAt: serverTimestamp()
      });

      toast({ title: "Submission Approved", description: "Frequency synchronized to global network." });
    } catch (e) {
      toast({ variant: "destructive", title: "Verification Error" });
    }
  };

  const handleRejectSubmission = async (id: string) => {
    try {
      await updateDoc(doc(firestore, 'artistSubmissions', id), {
        status: 'rejected',
        updatedAt: serverTimestamp()
      });
      toast({ title: "Submission Rejected", description: "Node removed from pipeline." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed" });
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MainSidebar />
      <main className={cn(
        "flex-1 overflow-y-auto pb-40 transition-all duration-500 scrollbar-hide",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <header className="h-24 flex items-center justify-between px-8 md:px-12 border-b border-border bg-background/40 backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-headline font-bold tracking-tight">Node Hub Manager</h1>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">Admin Synthesis Terminal</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)}
            className="h-12 rounded-2xl bg-primary text-white gap-3 px-8 font-bold uppercase tracking-widest text-[10px] shadow-xl"
          >
            {isAdding ? "Close Terminal" : <><Plus size={16} /> Synthesize Manual node</>}
          </Button>
        </header>

        <div className="px-8 md:px-12 py-10 max-w-7xl mx-auto space-y-12">
          {isAdding && (
            <section className="animate-in slide-in-from-top-4 fade-in duration-500">
              <div className="liquid-glass rounded-[3rem] p-10 border-primary/20 space-y-8 bg-primary/5">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  <h3 className="text-2xl font-headline font-bold">Manual Calibration</h3>
                </div>
                <form onSubmit={handleAddNode} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2">Node Title</label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 px-6" placeholder="Track Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2">Lead Architect</label>
                    <Input value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 px-6" placeholder="Artist Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2">Acoustic Path (Audio URL)</label>
                    <Input value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 px-6" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2">Spectral Pattern (Cover URL)</label>
                    <Input value={formData.coverUrl} onChange={e => setFormData({...formData, coverUrl: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 px-6" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2">Node Genre</label>
                    <Input value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 px-6" placeholder="Techno, Ambient, etc." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground ml-2">Price Point</label>
                    <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="h-14 rounded-2xl bg-black/40 border-white/10 px-6" placeholder="0.99" />
                  </div>
                  <Button type="submit" className="md:col-span-2 h-16 rounded-[2rem] bg-primary text-white font-black uppercase text-xs tracking-widest gap-3 shadow-2xl">
                    Deploy to Global Network
                  </Button>
                </form>
              </div>
            </section>
          )}

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 h-14 rounded-[1.5rem] p-1 mb-8 w-fit">
              <TabsTrigger value="active" className="rounded-xl px-8 h-full font-bold uppercase text-[10px] tracking-widest gap-2">
                <Database size={14} /> Active nodes
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl px-8 h-full font-bold uppercase text-[10px] tracking-widest gap-2">
                <Clock size={14} /> Submission pipeline
                {submissions?.length ? (
                  <span className="ml-2 bg-primary text-white px-2 py-0.5 rounded-full text-[8px]">{submissions.length}</span>
                ) : null}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="animate-in fade-in duration-500 m-0">
              <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-headline font-bold tracking-tight text-foreground">Global Repository</h3>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {nodes?.length || 0} Synchronized nodes
                  </div>
                </div>

                {isLoadingNodes ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-[8px] font-black uppercase tracking-widest">Scanning Repository</p>
                  </div>
                ) : nodes?.length ? (
                  <div className="grid gap-4">
                    {nodes.map(node => (
                      <div key={node.id} className="liquid-glass group rounded-[2rem] p-6 border-white/5 flex items-center justify-between hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500 bg-white/5 flex items-center justify-center">
                            {node.coverUrl ? <img src={node.coverUrl} className="w-full h-full object-cover" alt="" /> : <Music className="text-white/20" />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold">{node.title}</h4>
                              <ShieldCheck size={14} className="text-emerald-400" />
                            </div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{node.artist}</p>
                            <div className="flex gap-2 pt-1">
                              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase border border-white/5">{node.genre}</span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[8px] font-black uppercase text-emerald-400 border border-emerald-500/20">${node.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-foreground/5" onClick={() => playTrack(node)}>
                            <Play size={18} fill="currentColor" />
                          </Button>
                          <Button onClick={() => handleDeleteNode(node.id)} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-foreground/[0.02] border border-dashed border-border text-center opacity-40">
                    <Database className="h-10 w-10 mb-4" />
                    <p className="text-xs uppercase font-bold tracking-widest">No active nodes in network.</p>
                  </div>
                )}
              </section>
            </TabsContent>

            <TabsContent value="pending" className="animate-in fade-in duration-500 m-0">
              <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <ListMusic className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-headline font-bold tracking-tight text-foreground">Submission Pipeline</h3>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {submissions?.length || 0} Pending verification
                  </div>
                </div>

                {isLoadingSubmissions ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-[8px] font-black uppercase tracking-widest">Scanning Pipeline</p>
                  </div>
                ) : submissions?.length ? (
                  <div className="grid gap-4">
                    {submissions.map(sub => (
                      <div key={sub.id} className="liquid-glass group rounded-[2rem] p-6 border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent/20 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="relative h-20 w-20 rounded-2xl overflow-hidden shadow-2xl bg-white/5 shrink-0">
                            <img src={sub.coverUrl || 'https://picsum.photos/seed/sub/400/400'} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-xl font-bold">{sub.title || 'Untitled Node'}</h4>
                              <p className="text-xs font-bold text-accent uppercase tracking-widest">{sub.artistName}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 rounded-full bg-white/5 text-[8px] font-black uppercase border border-white/5">{sub.genre}</span>
                              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-[8px] font-black uppercase text-blue-400 border border-blue-500/20">Pending Sync</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-foreground/5 hover:bg-foreground/10" onClick={() => playTrack({ ...sub, id: sub.id, source: 'local' } as any)}>
                            <Play size={20} fill="currentColor" />
                          </Button>
                          <Button onClick={() => handleApproveSubmission(sub)} className="h-14 px-8 rounded-2xl bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl hover:scale-105 transition-all">
                            <CheckCircle2 size={16} /> Approve Frequency
                          </Button>
                          <Button onClick={() => handleRejectSubmission(sub.id)} variant="ghost" className="h-14 px-6 rounded-2xl bg-destructive/10 text-destructive font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-destructive/20">
                            <XCircle size={16} /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-foreground/[0.02] border border-dashed border-border text-center opacity-40">
                    <Sparkles className="h-10 w-10 mb-4" />
                    <p className="text-xs uppercase font-bold tracking-widest">Pipeline quiet. No pending frequencies.</p>
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
