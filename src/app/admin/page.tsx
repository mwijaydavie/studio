
"use client";

import React from 'react';
import { useMusic } from '@/context/music-context';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { 
  Users, Music, Zap, BarChart3, ShieldCheck, 
  Settings, Database, RefreshCcw, ArrowRight, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const { firestore } = useFirebase();
  const { isSidebarCollapsed } = useMusic();

  const usersQuery = useMemoFirebase(() => query(collection(firestore, 'users'), limit(5)), [firestore]);
  const { data: users } = useCollection(usersQuery);

  const globalTracksQuery = useMemoFirebase(() => query(collection(firestore, 'globalTracks'), limit(5)), [firestore]);
  const { data: globalTracks } = useCollection(globalTracksQuery);

  const stats = [
    { label: "Syncing Architects", value: users?.length || 0, icon: Users, color: "text-blue-400" },
    { label: "Global Frequencies", value: globalTracks?.length || 0, icon: Music, color: "text-emerald-400" },
    { label: "Active Nodes", value: 14, icon: Zap, color: "text-yellow-400" },
    { label: "System Load", value: "2.4ms", icon: BarChart3, color: "text-primary" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MainSidebar />
      <main className={cn(
        "flex-1 overflow-y-auto pb-40 transition-all duration-500 scrollbar-hide",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        <header className="h-24 flex items-center justify-between px-8 md:px-12 border-b border-border bg-background/40 backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-headline font-bold tracking-tight">System Core</h1>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">Admin Intelligence Hub v6.4</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 rounded-xl bg-white/5 border-white/10 gap-2 font-bold uppercase text-[9px] tracking-widest">
              <RefreshCcw size={12} /> Sync Check
            </Button>
            <Button className="h-10 rounded-xl bg-primary text-white gap-2 font-bold uppercase text-[9px] tracking-widest px-6 shadow-xl shadow-primary/20">
              <Settings size={12} /> Maintenance
            </Button>
          </div>
        </header>

        <div className="px-8 md:px-12 py-10 space-y-12 max-w-7xl mx-auto">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="liquid-glass rounded-[2.5rem] p-8 border-white/5 group hover:border-primary/20 transition-all">
                <div className={cn("h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", s.color)}>
                  <s.icon size={20} />
                </div>
                <div>
                  <p className="text-4xl font-headline font-bold mb-1">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{s.label}</p>
                </div>
              </div>
            ))}
          </section>

          <div className="grid lg:grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                  <UserCheck className="text-primary h-5 w-5" /> Recent Architects
                </h3>
                <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary">Manage All <ArrowRight size={12} className="ml-2" /></Button>
              </div>
              <div className="space-y-3">
                {users?.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/20">
                        <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{u.username}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{u.email}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      u.role === 'admin' ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 text-muted-foreground border border-white/5"
                    )}>
                      {u.role || 'Architect'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                  <Database className="text-accent h-5 w-5" /> Premium Frequencies
                </h3>
                <Button onClick={() => router.push('/admin/nodes')} variant="link" className="text-[10px] font-black uppercase tracking-widest text-accent">Node Hub <ArrowRight size={12} className="ml-2" /></Button>
              </div>
              <div className="space-y-3">
                {globalTracks?.length ? globalTracks.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg">
                        <img src={t.coverUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{t.artist}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-400 font-mono">${t.price || '0.00'}</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">Verified</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-40 flex flex-col items-center justify-center p-8 rounded-3xl bg-foreground/[0.02] border border-dashed border-border text-center">
                    <Music className="h-8 w-8 text-muted-foreground/20 mb-3" />
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">No global frequencies synthesized yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
