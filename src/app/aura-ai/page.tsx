
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auraChat } from '@/ai/flows/aura-chat-flow';
import { BrainCircuit, Send, Loader2, ArrowLeft, Mic2, MessageSquare, Sparkles, Zap, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatMessage } from '@/components/music/chat-message';
import { TTSStudio } from '@/components/music/tts-studio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMusic } from '@/context/music-context';

export default function AuraAIPage() {
  const [messages, setMessages] = useState<any[]>([{ role: 'model', content: "Aura Core v5.0 initialized. Neural link established. How shall we synthesize your **Soundscape** today?", status: "SYNK_ACTIVE" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSidebarCollapsed, playUISound, nextTrack, prevTrack, togglePlay } = useMusic();

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const userMsg = (customPrompt || input).trim();
    if (!userMsg || isLoading) return;
    playUISound('click');
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const result = await auraChat({ message: userMsg, history: messages.map(m => ({ role: m.role, content: m.content })) });
      playUISound('resonance');
      setMessages(prev => [...prev, { role: 'model', content: result.response, status: result.neuralStatus }]);
      if (result.command === 'NEXT_TRACK') nextTrack();
      if (result.command === 'PREV_TRACK') prevTrack();
      if (result.command === 'TOGGLE_PLAY') togglePlay();
      if (result.suggestedPath && userMsg.toLowerCase().includes('go to')) router.push(result.suggestedPath);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "Neural Link Error: High-frequency collision detected.", status: "ERROR_RECOVERY" }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MainSidebar />
      <main className={cn("flex-1 flex flex-col relative transition-all duration-500 overflow-hidden", isSidebarCollapsed ? "md:ml-20" : "md:ml-64")}>
        <header className="h-20 flex items-center justify-between px-12 border-b border-border bg-background/40 backdrop-blur-3xl z-10 shrink-0">
          <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl"><ArrowLeft /></Button><div><h1 className="text-xl font-headline font-bold flex items-center gap-2 text-gradient"><BrainCircuit className="h-5 w-5 text-primary animate-pulse" />Intelligence Node</h1></div></div>
        </header>
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <div className="px-12 pt-6"><TabsList className="bg-foreground/5 border border-border h-14 rounded-2xl p-1 liquid-glass w-fit"><TabsTrigger value="chat" className="rounded-xl px-8 h-full font-bold uppercase text-[10px] tracking-widest gap-2"><MessageSquare size={14} /> Neural Link</TabsTrigger><TabsTrigger value="tts" className="rounded-xl px-8 h-full font-bold uppercase text-[10px] tracking-widest gap-2"><Mic2 size={14} /> Voice Studio</TabsTrigger></TabsList></div>
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 animate-fade-in">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide"><AnimatePresence initial={false}>{messages.map((m, i) => (<ChatMessage key={i} role={m.role} content={m.content} status={m.status} />))}</AnimatePresence>{isLoading && (<div className="flex items-center gap-4 text-muted-foreground italic text-sm"><Loader2 className="animate-spin text-primary" /> Aura is synthesizing...</div>)}</div>
              <div className="p-12 bg-gradient-to-t from-background via-background/80 to-transparent"><div className="max-w-4xl mx-auto space-y-6"><form onSubmit={handleSend} className="relative group"><div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition" /><div className="relative flex items-center gap-2 bg-background/80 backdrop-blur-2xl border border-border rounded-[2.5rem] p-2 shadow-3xl"><Input value={input} onChange={e => setInput(e.target.value)} placeholder="Message Aura Core..." className="flex-1 bg-transparent border-none h-16 px-6 text-lg focus-visible:ring-0" disabled={isLoading} /><Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-14 w-14 rounded-full bg-primary"><Send /></Button></div></form></div></div>
            </TabsContent>
            <TabsContent value="tts" className="flex-1 overflow-y-auto p-12 scrollbar-hide"><TTSStudio /></TabsContent>
          </Tabs>
        </div>
      </main>
      <PlayerBar />
    </div>
  );
}
