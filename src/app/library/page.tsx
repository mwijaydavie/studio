
"use client";

import React, { useState, useMemo, useRef } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { useMusic } from '@/context/music-context';
import { 
  Plus, 
  Search,
  CheckCircle2,
  Heart,
  Gamepad2,
  LayoutGrid,
  Music as MusicIcon,
  Zap,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocalScanner } from '@/components/music/local-scanner';
import { TrackCard } from '@/components/music/track-card';
import { TrackListItem } from '@/components/music/track-list-item';
import { BatchActionBar } from '@/components/music/batch-action-bar';
import { TrackDetailSheet } from '@/components/music/track-detail-sheet';
import { ScrollToCurrentFab } from '@/components/music/scroll-to-current-fab';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export default function LibraryPage() {
  const { 
    localTracks, isFavorite, removeLocalTrack, 
    playTrack, toggleFavorite, 
    createPlaylist, currentTrack, isSidebarCollapsed
  } = useMusic();
  
  const router = useRouter();
  const [filterQuery, setFilterQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [inspectedTrackId, setInspectedTrackId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const audioTracks = useMemo(() => {
    // Permissive filter: Display everything that is not a video reel
    const combined = [...localTracks]
      .filter((t, i, self) => 
        t && t.id && self.findIndex(s => s.id === t.id) === i &&
        !t.id.includes('reel') && 
        t.genre !== "Video Reel"
      )
      .sort((a, b) => {
        const timeA = a.addedAt?.seconds ? a.addedAt.seconds * 1000 : Date.now();
        const timeB = b.addedAt?.seconds ? b.addedAt.seconds * 1000 : Date.now();
        return timeB - timeA;
      });
    
    if (!filterQuery.trim()) return combined;

    return combined.filter(t => 
      t.title?.toLowerCase().includes(filterQuery.toLowerCase()) || 
      t.artist?.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [localTracks, filterQuery]);

  const handleScrollToCurrent = () => {
    if (currentTrack) {
      const el = document.getElementById(`track-${currentTrack.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 50);
  };

  const toggleSelect = (id: string) => {
    setSelectedTrackIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const inspectedTrack = useMemo(() => 
    audioTracks.find(t => t.id === inspectedTrackId) || null
  , [inspectedTrackId, audioTracks]);

  const ActionCard = ({ label, description, icon: Icon, color, onClick, spotlightColor }: any) => (
    <SpotlightCard 
      onClick={onClick}
      spotlightColor={spotlightColor}
      className={cn(
        "group relative w-full h-32 md:h-40 cursor-pointer hover:scale-[1.02] transition-all duration-500 shadow-2xl overflow-hidden border-none",
        color
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-1000">
        <Icon size={80} className="text-white" />
      </div>

      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end gap-2 z-20">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white drop-shadow-md" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-headline font-bold text-white tracking-tighter uppercase leading-none">
            {label}
          </h3>
          <p className="text-[8px] md:text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] leading-tight mt-1">
            {description}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      <MainSidebar />
      
      <main 
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex-1 flex flex-col h-full relative pb-32 md:pb-0 overflow-y-auto scrollbar-hide transition-all duration-500",
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        <header className={cn(
          "sticky top-0 z-40 transition-all duration-500 px-6 md:px-12 py-4 md:py-6 flex items-center justify-between",
          isScrolled ? "bg-background/90 backdrop-blur-3xl border-b border-border/50 py-4" : "bg-transparent"
        )}>
          <div className="flex flex-col">
            <h1 className="font-headline font-bold tracking-tighter text-foreground text-xl sm:text-2xl">
              Repository
            </h1>
            <p className="text-muted-foreground text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">
              {audioTracks.length} Pattern Nodes Synchronized
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="h-9 w-9 md:h-10 md:w-10 rounded-xl border-border bg-foreground/5 shadow-xl"
            >
              {viewMode === 'table' ? <LayoutGrid size={16} /> : <List size={16} />}
            </Button>
          </div>
        </header>

        <div className="px-6 md:px-12 py-6 space-y-8 md:space-y-10 max-w-7xl w-full mx-auto pb-40">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <ActionCard 
              label="Favorites"
              description="High-Resonance"
              icon={Heart}
              color="bg-rose-600"
              spotlightColor="rgba(255, 255, 255, 0.2)"
              onClick={() => toast({ title: "Resonance Hub Active" })}
            />
            <ActionCard 
              label="New Session"
              description="Pattern Node"
              icon={Plus}
              color="bg-primary"
              spotlightColor="rgba(255, 255, 255, 0.2)"
              onClick={() => { createPlaylist("New Sonic Session"); toast({ title: "Session Initialized" }); }}
            />
            <ActionCard 
              label="Quiz Node"
              description="Hardware Perception"
              icon={Gamepad2}
              color="bg-emerald-600"
              spotlightColor="rgba(255, 255, 255, 0.2)"
              onClick={() => router.push('/library/quiz')}
            />
          </section>

          <LocalScanner />

          <div className="relative group max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Query internal patterns..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="h-11 pl-12 bg-foreground/5 border-none rounded-xl md:rounded-2xl focus:ring-4 focus:ring-primary/10 text-xs md:text-sm text-foreground placeholder:text-muted-foreground/30 shadow-inner"
            />
          </div>

          <div className="animate-fade-in outline-none m-0 pt-4">
            {audioTracks.length > 0 ? (
              viewMode === 'table' ? (
                <div className="space-y-3">
                  {audioTracks.map((track, i) => (
                    <div key={track.id} id={`track-${track.id}`} className="relative flex items-center gap-3">
                       <div 
                         onClick={() => toggleSelect(track.id)}
                         className={cn(
                           "h-5 w-5 rounded-full border-2 border-border/50 flex items-center justify-center cursor-pointer transition-all",
                           selectedTrackIds.includes(track.id) ? "bg-primary border-primary" : "hover:border-primary/40"
                         )}
                       >
                         {selectedTrackIds.includes(track.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                       </div>
                       <TrackListItem 
                         track={track} 
                         index={i} 
                         onClick={() => setInspectedTrackId(track.id)}
                       />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {audioTracks.map(track => (
                    <div key={track.id} id={`track-${track.id}`} className="relative group">
                      <div 
                        onClick={() => toggleSelect(track.id)}
                        className={cn(
                          "absolute top-4 left-4 z-20 h-6 w-6 rounded-full border-2 border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 shadow-xl",
                          selectedTrackIds.includes(track.id) && "opacity-100 bg-primary border-primary"
                        )}
                      >
                        {selectedTrackIds.includes(track.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div onClick={() => setInspectedTrackId(track.id)}>
                        <TrackCard track={track} />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                <div className="h-20 w-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center border border-white/5">
                  <MusicIcon className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground opacity-60">Repository Empty</h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic">"No audio nodes synchronized in current repository."</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ScrollToCurrentFab 
        nowPlaying={currentTrack} 
        onScrollToCurrent={handleScrollToCurrent} 
      />

      <BatchActionBar 
        selectedCount={selectedTrackIds.length}
        onClear={() => setSelectedTrackIds([])}
        onDelete={() => { selectedTrackIds.forEach(removeLocalTrack); setSelectedTrackIds([]); }}
        onSync={() => { toast({ title: "Acoustic Sync Active" }); setSelectedTrackIds([]); }}
        onAddToPlaylist={() => setSelectedTrackIds([])}
      />

      <TrackDetailSheet 
        track={inspectedTrack}
        isOpen={!!inspectedTrackId}
        onClose={() => setInspectedTrackId(null)}
        onPlay={playTrack}
        isFavorite={inspectedTrack ? isFavorite(inspectedTrack.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <PlayerBar />
    </div>
  );
}
