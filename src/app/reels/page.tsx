
"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { useMusic } from '@/context/music-context';
import { 
  Disc, Film, ArrowDown, Loader2, ListMusic, Plus, Maximize2, MessageSquare, Send, Database, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LikeButton } from '@/components/music/like-button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, doc, increment } from 'firebase/firestore';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { motion } from 'framer-motion';

function CommentSection({ reelId, isOpen, onClose }: { reelId: string, isOpen: boolean, onClose: () => void }) {
  const { user, firestore } = useFirebase();
  const [newComment, setNewComment] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentsQuery = useMemoFirebase(() => reelId ? query(collection(firestore, 'reels', reelId, 'comments'), orderBy('createdAt', 'asc')) : null, [firestore, reelId]);
  const { data: comments, isLoading } = useCollection(commentsQuery);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [comments]);

  const handleSend = () => {
    if (!newComment.trim() || !user) return;
    const ref = doc(collection(firestore, 'reels', reelId, 'comments'));
    setDocumentNonBlocking(ref, { id: ref.id, userId: user.uid, userName: user.displayName || "Aura Architect", text: newComment, createdAt: serverTimestamp() }, { merge: true });
    updateDocumentNonBlocking(doc(firestore, 'reels', reelId), { commentCount: increment(1) });
    setNewComment("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background/95 backdrop-blur-3xl border-l border-white/5 p-0 flex flex-col">
        <SheetHeader className="p-8 border-b border-white/5"><div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-primary" /><SheetTitle className="text-xl font-headline font-bold">Neural Feedback</SheetTitle></div></SheetHeader>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {isLoading ? (<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>) : comments?.length ? (
            comments.map((c: any) => (<motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={c.id} className="space-y-1"><div className="flex items-center gap-2"><span className="text-[10px] font-black uppercase text-primary tracking-widest">{c.userName}</span></div><p className="text-sm text-foreground/80 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner">{c.text}</p></motion.div>))
          ) : (<div className="h-full flex items-center justify-center opacity-20 italic">No patterns recorded.</div>)}
        </div>
        <div className="p-8 border-t border-white/5 flex gap-2"><input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Synthesize feedback..." className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6" onKeyDown={e => e.key === 'Enter' && handleSend()} /><Button onClick={handleSend} size="icon" className="h-14 w-14 rounded-2xl bg-primary"><Send size={20} /></Button></div>
      </SheetContent>
    </Sheet>
  );
}

function ReelItem({ reel, isActive, onComplete }: { reel: any, isActive: boolean, onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toggleFavorite, isFavorite, playlists, addTrackToPlaylist, reelsAutoScrollLoops, isDarkMode } = useMusic();
  const { firestore } = useFirebase();
  const [showComments, setShowComments] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const statsRef = useMemoFirebase(() => doc(firestore, 'reels', reel.id), [firestore, reel.id]);
  const { data: stats } = useDoc(statsRef);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) { setLoopCount(0); videoRef.current.play().catch(() => {}); setTimeout(() => updateDocumentNonBlocking(statsRef, { viewCount: increment(1) }), 2000); }
      else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    }
  }, [isActive, statsRef]);

  const handleEnded = () => { const nc = loopCount + 1; setLoopCount(nc); if (reelsAutoScrollLoops > 0 && nc >= reelsAutoScrollLoops) onComplete(); };
  const handleLike = (e: React.MouseEvent) => { e.stopPropagation(); const fav = isFavorite(reel.id); toggleFavorite(reel); updateDocumentNonBlocking(statsRef, { likeCount: increment(fav ? -1 : 1) }); };

  return (
    <div className={cn("h-full w-full snap-start relative flex items-center justify-center overflow-hidden transition-colors", isDarkMode ? "bg-black" : "bg-zinc-100")}>
      <div className="absolute inset-0 opacity-20 blur-[120px] pointer-events-none"><img src={reel.coverUrl} className="w-full h-full object-cover scale-150" alt="" /></div>
      <div className={cn("relative h-full w-full max-w-[500px] md:h-[94%] md:rounded-[3rem] overflow-hidden shadow-2xl border", isDarkMode ? "bg-black border-white/5" : "bg-white border-black/5")}>
        <video ref={videoRef} src={reel.audioUrl} className="w-full h-full object-contain md:object-cover" onEnded={handleEnded} playsInline />
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black via-black/60 to-transparent text-white space-y-4">
          <div className="flex items-center gap-4"><div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center"><Disc className={cn("h-6 w-6 text-primary", isActive && "animate-spin-slow")} /></div><div className="min-w-0 flex-1"><h3 className="text-xl font-bold truncate">{reel.title}</h3><p className="text-sm text-primary font-bold uppercase tracking-widest">{reel.artist}</p></div></div>
          <div className="flex gap-4"><span className="text-[8px] font-black uppercase bg-white/5 px-3 py-1 rounded-full flex items-center gap-1"><Eye size={10} /> {stats?.viewCount || 0}</span><span className="text-[8px] font-black uppercase bg-white/5 px-3 py-1 rounded-full flex items-center gap-1"><MessageSquare size={10} /> {stats?.commentCount || 0}</span></div>
        </div>
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-20">
          <div className="flex flex-col items-center gap-1"><LikeButton isActive={isFavorite(reel.id)} onClick={handleLike} size={56} /><span className="text-[9px] font-black uppercase text-white">{stats?.likeCount || 0}</span></div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setShowComments(true)}><div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:scale-110 transition-all"><MessageSquare className="h-6 w-6 text-white" /></div><span className="text-[9px] font-black text-white">Reply</span></div>
        </div>
      </div>
      <CommentSection reelId={reel.id} isOpen={showComments} onClose={() => setShowComments(false)} />
    </div>
  );
}

export default function ReelsPage() {
  const { localTracks, isSidebarCollapsed } = useMusic();
  const { firestore } = useFirebase();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [view, setView] = useState<'local' | 'global'>('global');
  const [globalReels, setGlobalReels] = useState<any[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const fetchGlobalVideos = async () => {
    setIsLoadingGlobal(true);
    try {
      const q = "subject:(music AND visualization) AND mediatype:movies AND format:MP4";
      const res = await fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier,title,creator&sort[]=downloads+desc&output=json&limit=15`);
      const data = await res.json();
      const items = (data.response.docs || []).map((item: any) => ({
        id: `reel-archive-${item.identifier}`, title: item.title || "Visual Pattern", artist: item.creator || "Archive Node", genre: "Visual Synthesis", duration: "0:00", coverUrl: `https://picsum.photos/seed/${item.identifier}/600/600`, audioUrl: `https://archive.org/download/${item.identifier}/${item.identifier}.mp4`, source: 'archive'
      }));
      setGlobalReels(items);
      items.forEach((item: any) => setDocumentNonBlocking(doc(firestore, 'reels', item.id), { id: item.id, likeCount: 0, viewCount: 0, commentCount: 0 }, { merge: true }));
    } catch (e) { console.error("Global reels fail"); } finally { setIsLoadingGlobal(false); }
  };

  useEffect(() => { if (view === 'global' && globalReels.length === 0) fetchGlobalVideos(); }, [view]);

  const videoReels = useMemo(() => view === 'global' ? globalReels : localTracks.filter(t => t.id?.includes('reel')), [localTracks, view, globalReels]);
  const handleScroll = () => { if (!containerRef.current) return; const idx = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight); if (idx !== activeReelIndex) setActiveReelIndex(idx); };
  const handleNextReel = useCallback(() => { if (containerRef.current && activeReelIndex < videoReels.length - 1) containerRef.current.scrollTo({ top: (activeReelIndex + 1) * containerRef.current.clientHeight, behavior: 'smooth' }); }, [activeReelIndex, videoReels.length]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MainSidebar />
      <main className={cn("flex-1 relative flex flex-col transition-all duration-500", isSidebarCollapsed ? "md:pl-20" : "md:pl-64")}>
        <header className="z-40 bg-background/30 backdrop-blur-3xl border-b border-white/10 px-8 py-4 flex items-center justify-between rounded-3xl liquid-glass m-2 shrink-0">
          <div className="flex items-center gap-3"><Film className="h-6 w-6 text-primary animate-pulse" /><div><h1 className="font-headline font-bold text-xl">Visual Hub</h1></div></div>
          <div className="flex items-center gap-2"><div className="bg-foreground/5 p-1 rounded-xl flex gap-1">{['global', 'local'].map(v => (<button key={v} onClick={() => setView(v as any)} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", view === v ? "bg-primary text-white" : "text-muted-foreground")}>{v}</button>))}</div><Button size="icon" className="h-10 w-10 rounded-xl bg-primary"><Plus size={20} /></Button></div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {isLoadingGlobal ? (<div className="h-full flex flex-col items-center justify-center gap-4"><Loader2 className="animate-spin text-primary" /><p className="text-[10px] font-bold uppercase text-primary animate-pulse">Syncing Video Node</p></div>) : videoReels.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6"><Film className="h-12 w-12 text-muted-foreground/20" /><h2 className="text-3xl font-headline font-bold">Hub Empty</h2><Button className="neon-shimmer">Upload Node</Button></div>
          ) : (
            <div ref={containerRef} onScroll={handleScroll} className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide scroll-smooth">
              {videoReels.map((reel, i) => (<ReelItem key={reel.id} reel={reel} isActive={i === activeReelIndex} onComplete={handleNextReel} />))}
            </div>
          )}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40"><ArrowDown className="h-6 w-6" /></div>
        </div>
      </main>
      <PlayerBar />
    </div>
  );
}
