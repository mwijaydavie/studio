
"use client";

import React, { useState } from 'react';
import { useMusic } from '@/context/music-context';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, Plus, ArrowRight, Radio, Zap, 
  ShieldCheck, Loader2, Globe, X, Disc, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ListeningRoomModal({ onClose }: { onClose: () => void }) {
  const { createRoom, joinRoom, activeRoomId, leaveRoom, isLeader } = useMusic();
  const { firestore, user } = useFirebase();
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const roomsQuery = useMemoFirebase(() => query(collection(firestore, 'listeningRooms'), orderBy('createdAt', 'desc'), limit(10)), [firestore]);
  const { data: rooms, isLoading } = useCollection(roomsQuery);

  const handleCreate = async () => {
    if (!roomName.trim()) return;
    await createRoom(roomName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(162,76,241,0.2)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Network className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-white">Collective Sync</h3>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Bridging neural acoustic nodes</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5">
            <X className="h-6 w-6" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {activeRoomId ? (
            <div className="space-y-8 py-10 text-center animate-fade-in">
               <div className="relative h-32 w-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                     <Radio className="h-12 w-12 text-primary animate-pulse" />
                  </div>
               </div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-headline font-bold">Node Link Active</h4>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest font-black opacity-60">
                    {isLeader ? 'Transmitting Session' : 'Receiving Lead Signal'}
                  </p>
               </div>
               <Button onClick={leaveRoom} variant="destructive" className="h-14 rounded-2xl px-10 font-bold uppercase tracking-widest text-[10px]">
                 Terminate Connection
               </Button>
            </div>
          ) : (
            <>
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Plus className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Initialize New Node</span>
                </div>
                <div className="flex gap-3">
                  <Input 
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Node Designation (e.g. Techno Hub)"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-lg focus:ring-primary/20"
                  />
                  <Button onClick={handleCreate} disabled={!roomName.trim()} className="h-14 w-14 rounded-2xl bg-primary text-white shrink-0 shadow-xl shadow-primary/20">
                    <ArrowRight size={24} />
                  </Button>
                </div>
              </section>

              <div className="h-px bg-white/5 w-full" />

              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Open Frequencies</span>
                  </div>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{rooms?.length || 0} active</span>
                </div>

                <div className="grid gap-3">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                      <Loader2 className="animate-spin text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Scanning Network...</span>
                    </div>
                  ) : rooms?.length ? (
                    rooms.map(room => (
                      <button 
                        key={room.id}
                        onClick={() => { joinRoom(room.id); onClose(); }}
                        className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/40 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Disc className="h-5 w-5 animate-spin-slow" />
                          </div>
                          <div>
                            <h5 className="font-bold text-white">{room.name}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <Users size={10} className="text-primary" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{room.participantCount} Synchronized</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-colors shadow-lg">
                          Bridge Node
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-12 rounded-[2rem] border border-dashed border-white/10 text-center opacity-30 flex flex-col items-center gap-3">
                      <Zap size={24} />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Network Silent.<br/>Initialize first node above.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="p-8 border-t border-white/5 bg-black/40">
          <p className="text-center text-[8px] font-black uppercase tracking-[0.3em] text-white/20">
            Aura Collective Sync v2.1 • Peer-to-Peer Relay
          </p>
        </footer>
      </div>
    </div>
  );
}
