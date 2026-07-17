"use client";

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useMusic, ALL_ACHIEVEMENTS } from '@/context/music-context';
import { 
  ArrowLeft, Trophy, Music2, Zap, Sparkles, Settings, Edit2, CheckCircle2, TrendingUp, BrainCircuit, Download, ShieldCheck, Star, ChevronRight, Lock, Loader2, FileText, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ProfilePage() {
  const { user, firestore } = useFirebase();
  const { localTracks, favorites, unlockedAchievements, playUISound } = useMusic();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user?.uid]);
  const { data: userData } = useDoc(userRef);
  
  const hQuery = useMemoFirebase(() => user ? query(collection(firestore, 'users', user.uid, 'listeningHistory'), orderBy('listenedAt', 'desc')) : null, [user?.uid]);
  const { data: history } = useCollection(hQuery);

  const analytics = useMemo(() => {
    if (!history?.length) return { topGenre: "None", uniquenessScore: 0, chartData: [], genreData: [] };
    const genres: Record<string, number> = {}; const timeBuckets: Record<string, number> = {};
    history.forEach(h => {
      const g = h.genre || "Aura Node"; genres[g] = (genres[g] || 0) + 1;
      if (h.listenedAt?.seconds) { const d = new Date(h.listenedAt.seconds * 1000).toLocaleDateString(); timeBuckets[d] = (timeBuckets[d] || 0) + 1; }
    });
    const genreData = Object.entries(genres).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const chartData = Object.entries(timeBuckets).map(([name, sessions]) => ({ name, sessions })).slice(-7);
    return { topGenre: genreData[0]?.name || "None", uniquenessScore: Math.round((Object.keys(genres).length / history.length) * 100), chartData, genreData };
  }, [history]);

  const handleUpdate = async () => {
    if (!user) return;
    await updateProfile(user, { displayName });
    await setDoc(doc(firestore, 'users', user.uid), { username: displayName, updatedAt: serverTimestamp() }, { merge: true });
    setIsEditing(false);
    toast({ title: "Profile Updated" });
  };

  const handleExport = async () => {
    if (!user || !reportRef.current) return;
    setIsExporting(true); playUISound('resonance');
    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#09080A' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, (canvas.height * pdfW) / canvas.width);
    pdf.save(`AuraReport_${user.displayName}.pdf`);
    setIsExporting(false);
  };

  const COLORS = ['#A24CF1', '#8983f7', '#a3dafb', '#ff4e50', '#10b981'];

  return (
    <div className="min-h-screen bg-background text-foreground relative pb-40 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-3xl border-b border-border h-20 flex items-center px-12 justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-2xl h-12 gap-2"><ArrowLeft /> Dashboard</Button>
        <div className="flex items-center gap-3"><BrainCircuit className="text-primary animate-pulse" /><span className="font-headline font-bold text-xs uppercase tracking-widest">Neural Intel Hub</span></div>
        <Button variant="ghost" onClick={() => router.push('/settings')} className="rounded-2xl h-12 gap-2"><Settings /> System</Button>
      </header>
      <main className="max-w-6xl mx-auto px-12 py-12 space-y-20">
        <section className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-10"><Avatar className="h-48 w-48 border-4 border-primary"><AvatarImage src={user?.photoURL || ""} /><AvatarFallback>ID</AvatarFallback></Avatar>
          <div className="space-y-4"><div>{isEditing ? (<div className="flex gap-2"><Input value={displayName} onChange={e=>setDisplayName(e.target.value)} /><Button onClick={handleUpdate}>Save</Button></div>) : (<h1 className="text-6xl font-headline font-bold tracking-tighter">{user?.displayName}</h1>)}<p className="text-primary font-mono text-xs uppercase tracking-widest">{user?.email}</p></div></div></div>
          <Button onClick={handleExport} disabled={isExporting} className="h-14 px-10 rounded-2xl bg-white/5 border border-white/10 gap-3 font-bold uppercase tracking-widest text-[10px]">{isExporting ? <Loader2 className="animate-spin" /> : <Download />} Synthesis Report</Button>
        </section>
        <section className="grid md:grid-cols-2 gap-8">
          <div className="liquid-glass rounded-[3rem] p-8 space-y-6"><h3 className="text-xl font-headline font-bold">Genre Resonance</h3><div className="h-64"><ResponsiveContainer><PieChart><Pie data={analytics.genreData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{analytics.genreData.map((e,i)=>(<Cell key={i} fill={COLORS[i%5]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>
          <div className="liquid-glass rounded-[3rem] p-8 space-y-6"><h3 className="text-xl font-headline font-bold">Session Intensity</h3><div className="h-64"><ResponsiveContainer><BarChart data={analytics.chartData}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff11"/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={10}/><Tooltip/><Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></div>
        </section>
        <section className="space-y-10"><div className="flex items-center justify-between border-b border-border pb-6"><h2 className="text-3xl font-headline font-bold">Neural Milestones</h2><p className="text-xs font-mono">{unlockedAchievements.length} / {ALL_ACHIEVEMENTS.length}</p></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{ALL_ACHIEVEMENTS.map(ach => { const isU = unlockedAchievements.some(a=>a.achievementId===ach.id); return (<div key={ach.id} className={cn("p-6 rounded-[2rem] border transition-all duration-500 flex gap-4", isU ? "liquid-glass border-primary/30 bg-primary/5 shadow-lg" : "opacity-40 grayscale")}><div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", isU ? "bg-primary text-white" : "bg-white/5")}>{isU ? <Sparkles /> : <Lock />}</div><div><h4 className="font-bold text-sm">{ach.title}</h4><p className="text-[10px] text-muted-foreground italic">{ach.description}</p></div></div>);})}</div></section>
      </main>
      <div className="fixed left-[-9999px] top-0 pointer-events-none"><div ref={reportRef} className="w-[800px] p-20 bg-[#09080A] text-white space-y-16"><h1 className="text-6xl font-headline font-bold text-primary">AURATUNE PRO REPORT</h1><p className="text-xl">Architect: {user?.displayName}</p><p className="text-sm opacity-60">Neural Logic Synchronized on {new Date().toLocaleDateString()}</p></div></div>
    </div>
  );
}
