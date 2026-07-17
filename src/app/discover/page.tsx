
"use client";

import React, { useState } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { RadioDiscovery } from '@/components/music/radio-discovery';
import { ArchiveExplorer } from '@/components/music/archive-explorer';
import { AudiusExplorer } from '@/components/music/audius-explorer';
import { PersonalizedFeed } from '@/components/music/personalized-feed';
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { DiscoveryCategoryCard } from '@/components/music/discovery-category-card';
import { Compass, WifiOff, Zap } from 'lucide-react';
import { useMusic } from '@/context/music-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("trending");
  const { isSidebarCollapsed, isOnline } = useMusic();

  const categories = [
    { id: "trending", label: "Trending", desc: "Acoustic feed", icon: "🔥", color: "radial-gradient(circle at 100% 107%, #ff4e50 0%, #f9d423 90%)", onlineRequired: true },
    { id: "radio", label: "Radio", desc: "Live nodes", icon: "🌍", color: "radial-gradient(circle at 100% 107%, #11998e 0%, #38ef7d 90%)", onlineRequired: true },
    { id: "audius", label: "Audius", desc: "Decentralized", icon: "⚡", color: "radial-gradient(circle at 100% 107%, #00d2ff 0%, #3a7bd5 90%)", onlineRequired: true },
    { id: "archive", label: "Archive", desc: "Historical", icon: "📁", color: "radial-gradient(circle at 100% 107%, #6a11cb 0%, #8e2de2 40%, #2b004f 80%, #14001f 100%)", onlineRequired: true }
  ];

  const OfflineMask = () => (
    <div className="h-96 flex flex-col items-center justify-center p-12 rounded-[3.5rem] liquid-glass border-primary/20 text-center space-y-8 animate-fade-in shadow-[0_0_50px_rgba(162,76,241,0.1)]">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
        <WifiOff className="h-10 w-10 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <h4 className="text-3xl font-headline font-bold text-white tracking-tighter">Node Link Offline</h4>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto italic">
          "Universal frequency sync requires an active connection. Local patterns remain accessible in your Repository."
        </p>
      </div>
      <Button onClick={() => window.location.reload()} className="rounded-2xl h-14 px-10 bg-primary font-bold uppercase text-[10px] tracking-widest">Retry Link</Button>
    </div>
  );

  return (
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden">
      <MainSidebar />
      
      <main className={cn(
        "flex-1 pb-40 overflow-y-auto scrollbar-hide transition-all duration-500",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <div className="px-6 md:px-12 py-8 md:py-12 space-y-10 md:space-y-16 max-w-7xl mx-auto">
          <header className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl liquid-glass flex items-center justify-center animate-float shadow-xl shadow-primary/10">
                <Compass className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-headline font-bold tracking-tighter">Discover</h1>
                <p className="text-muted-foreground text-xs md:text-lg">Venture into the global sound collective.</p>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.map((cat) => (
              <DiscoveryCategoryCard 
                key={cat.id}
                label={cat.label}
                description={cat.desc}
                icon={cat.icon}
                color={cat.color}
                isActive={activeTab === cat.id}
                onClick={() => setActiveTab(cat.id)}
              />
            ))}
          </section>

          <div className="pt-4">
            {!isOnline ? (
              <OfflineMask />
            ) : (
              <Tabs value={activeTab} className="w-full">
                <TabsList className="hidden" />
                <TabsContent value="trending" className="animate-fade-in outline-none m-0"><PersonalizedFeed /></TabsContent>
                <TabsContent value="audius" className="animate-fade-in outline-none m-0"><AudiusExplorer /></TabsContent>
                <TabsContent value="radio" className="animate-fade-in outline-none m-0"><RadioDiscovery /></TabsContent>
                <TabsContent value="archive" className="animate-fade-in outline-none m-0"><ArchiveExplorer /></TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <PlayerBar />
    </div>
  );
}
