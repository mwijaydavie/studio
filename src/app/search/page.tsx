
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { Search as SearchIcon, Music, Globe, Library, Sparkles, Filter, Loader2, Database, Zap, HardDrive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { searchAudiusTracks } from '@/lib/audius-api';
import { Track } from '@/lib/types';
import { TrackCard } from '@/components/music/track-card';
import { TrackListItem } from '@/components/music/track-list-item';
import { AnimatedList } from '@/components/ui/animated-list';
import { useMusic } from '@/context/music-context';
import { cn } from '@/lib/utils';
import Fuse from 'fuse.js';

export default function SearchPage() {
  const { isSidebarCollapsed, localTracks } = useMusic();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ audius: Track[], archive: Track[], local: Track[] }>({ 
    audius: [], 
    archive: [],
    local: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const performSearch = async (val: string) => {
    if (!val.trim()) {
      setResults({ audius: [], archive: [], local: [] });
      return;
    }

    setIsLoading(true);
    try {
      // UPGRADE: Neural Fuzzy Search for local repository
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 1.0 },
          { name: 'artist', weight: 0.7 },
          { name: 'genre', weight: 0.4 }
        ],
        threshold: 0.35, // Balance between strict and fuzzy
        ignoreLocation: true
      };

      const fuse = new Fuse(localTracks, fuseOptions);
      const fuseResults = fuse.search(val);
      const localResults = fuseResults.map(r => r.item);

      const audiusPromise = searchAudiusTracks(val);

      const archivePromise = fetch(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(val)}+AND+mediatype:audio&fl[]=identifier,title,creator,format&sort[]=downloads+desc&output=json&limit=15`)
        .then(res => res.json())
        .then(data => (data.response.docs || []).map((item: any) => ({
          id: `archive-${item.identifier}`,
          title: item.title || "Untitled Archive Pattern",
          artist: item.creator || "Archive Node",
          genre: "Historical",
          duration: "Live",
          coverUrl: `https://picsum.photos/seed/${item.identifier}/600/600`,
          audioUrl: `https://archive.org/download/${item.identifier}/${item.identifier}_vbr.mp3`,
          source: 'archive'
        } as Track)));

      const [audiusResults, archiveResults] = await Promise.all([audiusPromise, archivePromise]);
      
      setResults({
        local: localResults,
        audius: audiusResults,
        archive: archiveResults
      });
    } catch (error) {
      console.error("Universal search failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) performSearch(query);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  const allTracks = useMemo(() => [
    ...results.local,
    ...results.audius, 
    ...results.archive
  ], [results]);

  return (
    <div className="flex min-h-screen bg-transparent text-foreground">
      <MainSidebar />
      
      <main className={cn(
        "flex-1 pb-40 overflow-y-auto scrollbar-hide transition-all duration-500",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <header className="h-20 md:h-24 flex items-center px-6 md:px-8 sticky top-0 bg-background/20 backdrop-blur-3xl z-40 border-b border-white/5 mb-6 md:mb-8">
          <div className="relative w-full max-w-4xl mx-auto group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query global & local nodes..."
              className="w-full h-12 md:h-16 bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] pl-14 pr-8 text-sm md:text-lg focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/30 liquid-glass"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-xl text-muted-foreground">
                <Filter className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-8 space-y-10 md:space-y-12 max-w-7xl mx-auto">
          {!query ? (
            <div className="space-y-12 md:space-y-16 animate-fade-in">
              <div className="text-center space-y-4 md:space-y-6 pt-8 md:pt-12">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-[2rem] bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center animate-float shadow-2xl">
                  <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground">Universal Search</h2>
                  <p className="text-muted-foreground text-sm md:text-lg max-w-md mx-auto">Query the collective network and your local repository.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
                {[
                  { label: "Internal", icon: HardDrive, color: "from-emerald-500 to-teal-500", desc: "Local Patterns" },
                  { label: "Audius", icon: Zap, color: "from-primary to-purple-400", desc: "Decentralized Nodes" },
                  { label: "Archive", icon: Library, color: "from-blue-500 to-cyan-500", desc: "Historical Archive" }
                ].map((cat) => (
                  <div key={cat.label} className="group liquid-glass rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center gap-4 md:gap-6 cursor-pointer hover:scale-[1.02] transition-all border border-white/5 hover:border-white/20">
                    <div className={`h-14 w-14 md:h-20 md:w-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                      <cat.icon className="h-6 w-6 md:h-10 md:w-10 text-white" />
                    </div>
                    <div className="text-center space-y-0.5 md:space-y-1">
                      <span className="text-lg md:text-xl font-bold block text-white">{cat.label}</span>
                      <span className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{cat.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12">
                <TabsList className="bg-white/5 border border-white/10 h-12 md:h-14 rounded-xl md:rounded-2xl p-1 liquid-glass w-full md:w-auto overflow-x-auto overflow-y-hidden scrollbar-hide">
                  <TabsTrigger value="all" className="rounded-lg md:rounded-xl px-4 md:px-8 h-full font-bold uppercase text-[8px] md:text-[10px] tracking-widest">Synthesis</TabsTrigger>
                  <TabsTrigger value="local" className="rounded-lg md:rounded-xl px-4 md:px-8 h-full font-bold uppercase text-[8px] md:text-[10px] tracking-widest">Internal</TabsTrigger>
                  <TabsTrigger value="audius" className="rounded-lg md:rounded-xl px-4 md:px-8 h-full font-bold uppercase text-[8px] md:text-[10px] tracking-widest">Audius</TabsTrigger>
                  <TabsTrigger value="archive" className="rounded-lg md:rounded-xl px-4 md:px-8 h-full font-bold uppercase text-[8px] md:text-[10px] tracking-widest">Archive</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-primary/10 rounded-full border border-primary/20 w-fit">
                  <Database className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" />
                  <span className="text-[8px] md:text-[10px] font-bold text-primary uppercase tracking-widest">Triple Nodes Connected</span>
                </div>
              </div>

              <TabsContent value="all" className="animate-fade-in outline-none m-0">
                 {allTracks.length > 0 ? (
                   <div className="min-h-[400px] w-full">
                     <AnimatedList>
                       {allTracks.map((track, i) => (
                         <TrackListItem key={track.id} track={track} index={i} />
                       ))}
                     </AnimatedList>
                   </div>
                 ) : !isLoading && (
                   <div className="h-[200px] md:h-[300px] flex flex-col items-center justify-center gap-3 md:gap-4 liquid-glass rounded-3xl md:rounded-[3rem] p-8 md:p-12 text-center border border-white/5">
                     <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center">
                       <SearchIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                     </div>
                     <p className="text-muted-foreground text-sm md:text-lg">No frequencies matched your query.</p>
                   </div>
                 )}
              </TabsContent>

              <TabsContent value="local" className="animate-fade-in m-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {results.local.map(t => <TrackCard key={t.id} track={t} />)}
                  {results.local.length === 0 && <p className="text-muted-foreground italic col-span-full text-center py-12 text-xs md:text-sm">No internal patterns found.</p>}
                </div>
              </TabsContent>

              <TabsContent value="audius" className="animate-fade-in m-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {results.audius.map(t => <TrackCard key={t.id} track={t} />)}
                </div>
              </TabsContent>

              <TabsContent value="archive" className="animate-fade-in m-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {results.archive.map(t => <TrackCard key={t.id} track={t} />)}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <PlayerBar />
    </div>
  );
}
