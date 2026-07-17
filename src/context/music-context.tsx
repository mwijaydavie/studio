
"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Track, Playlist, Achievement, NeonGlowSettings, CustomThemeColors, ListeningRoom, AuraNotification, VisualizerMode } from '@/lib/types';
import { useFirestore, useUser, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, doc, deleteDoc, serverTimestamp, query, where, updateDoc, onSnapshot, orderBy, limit, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import * as idb from 'idb-keyval';
import { generateTrackCover } from '@/ai/flows/generate-cover-flow';

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playbackSpeed: number;
  pitch: number;
  setPitch: (p: number) => void;
  reverbLevel: number;
  setReverbLevel: (val: number) => void;
  queue: Track[];
  localTracks: Track[];
  favorites: string[];
  playlists: Playlist[];
  unlockedAchievements: Achievement[];
  notifications: AuraNotification[];
  analyserNode: AnalyserNode | null;
  isShuffled: boolean;
  repeatMode: 'none' | 'all' | 'one';
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
  createPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  applaudTrack: (track: Omit<Track, 'addedAt'>) => void;
  removeLocalTrack: (trackId: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  eqBands: number[];
  setEqBand: (index: number, value: number) => void;
  updateTrackMetadata: (trackId: string, updates: Partial<Track>) => void;
  purgeAllData: () => Promise<void>;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  isDarkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  themeColor: 'purple' | 'blue' | 'emerald' | 'rose' | 'custom';
  setThemeColor: (color: 'purple' | 'blue' | 'emerald' | 'rose' | 'custom') => void;
  playUISound: (type: 'click' | 'resonance' | 'switch' | 'tick') => void;
  isHighContrast: boolean;
  setHighContrast: (val: boolean) => void;
  blurIntensity: number;
  setBlurIntensity: (val: number) => void;
  animationSpeed: number;
  setAnimationSpeed: (val: number) => void;
  apiKeys: Record<string, string>;
  setApiKey: (provider: string, key: string) => void;
  dynamicThemeMode: 'off' | 'cover' | 'time' | 'mood' | 'spectral';
  setDynamicThemeMode: (mode: 'off' | 'cover' | 'time' | 'mood' | 'spectral') => void;
  customThemeColors: CustomThemeColors;
  setCustomThemeColors: (colors: CustomThemeColors) => void;
  nameplateAnimation: string;
  setNameplateAnimation: (anim: string) => void;
  neonGlow: NeonGlowSettings;
  setNeonGlow: (settings: NeonGlowSettings) => void;
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (val: number) => void;
  checkAchievement: (id: string, condition: boolean) => void;
  startAiDjSession: () => Promise<void>;
  isDjSessionStarting: boolean;
  aiDjReasoning: string;
  isHapticsEnabled: boolean;
  setHapticsEnabled: (val: boolean) => void;
  isDataSaverMode: boolean;
  setDataSaverMode: (val: boolean) => void;
  reelsAutoScrollLoops: number;
  setReelsAutoScrollLoops: (val: number) => void;
  scannerSettings: { minFileSizeMB: number; minSongDurationSeconds: number };
  setScannerSettings: (val: { minFileSizeMB: number; minSongDurationSeconds: number }) => void;
  aiCoverArtEnabled: boolean;
  setAiCoverArtEnabled: (val: boolean) => void;
  aiDjMode: boolean;
  setAiDjMode: (val: boolean) => void;
  isExitDialogOpen: boolean;
  setExitDialogOpen: (val: boolean) => void;
  isFullPlayer: boolean;
  setIsFullPlayer: (val: boolean) => void;
  visualizerMode: VisualizerMode;
  cycleVisualizer: () => void;
  isOnline: boolean;
  exportSystemData: () => void;
  importSystemData: (file: File) => void;
  activeRoomId: string | null;
  isLeader: boolean;
  createRoom: (name: string) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  metronomeBpm: number;
  setMetronomeBpm: (bpm: number) => void;
  isMetronomeEnabled: boolean;
  toggleMetronome: () => void;
  lyricScrollSpeed: number;
  setLyricScrollSpeed: (speed: number) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  synthesizeTrackCover: (track: Track) => Promise<void>;
  isSynthesizingCover: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const ALL_ACHIEVEMENTS = [
  { id: 'start_seed', title: 'Sound Seed', description: 'Initialize your first audio frequency.' },
  { id: 'visualist', title: 'Visualist', description: 'Synthesize your first Video Reel.' },
  { id: 'dj_active', title: 'AI DJ Link', description: 'Initialize your first AI DJ curated session.' },
  { id: 'appearance_pro', title: 'Appearance Pro', description: 'Custom calibrate your workstation interface.' },
  { id: 'ai_theme', title: 'AI Theme Synth', description: 'Generate a spectral palette via AI prompt.' },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Establish perfect resonance in the acoustic quiz.' },
  { id: 'shared_node', title: 'Collective Sync', description: 'Initialize or join a shared listening room.' },
];

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const uiSoundsRef = useRef<Record<string, HTMLAudioElement>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const reverbGainRef = useRef<GainNode | null>(null);
  const crossfadeTimer = useRef<NodeJS.Timeout | null>(null);
  const metronomeInterval = useRef<NodeJS.Timeout | null>(null);

  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  // States
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0); 
  const [reverbLevel, setReverbLevel] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [optimisticTracks, setOptimisticTracks] = useState<Track[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [eqBands, setEqBands] = useState([0, 0, 0, 0, 0]);
  const [fontFamily, setFontFamily] = useState('Space Grotesk');
  const [isDarkMode, setDarkMode] = useState(true);
  const [themeColor, setThemeColor] = useState<'purple' | 'blue' | 'emerald' | 'rose' | 'custom'>('purple');
  const [dynamicThemeMode, setDynamicThemeMode] = useState<'off' | 'cover' | 'time' | 'mood' | 'spectral'>('off');
  const [isHapticsEnabled, setHapticsEnabled] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('wave');
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [isMetronomeEnabled, setIsMetronomeEnabled] = useState(false);
  const [isSynthesizingCover, setIsSynthesizingCover] = useState(false);
  const [isExitDialogOpen, setExitDialogOpen] = useState(false);
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [lyricScrollSpeed, setLyricScrollSpeed] = useState(1.0);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [neonGlow, setNeonGlow] = useState<NeonGlowSettings>({ enabled: false, style: 'rotate', speed: 5 });
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
  const [isHighContrast, setHighContrast] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState(60);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [isDataSaverMode, setDataSaverMode] = useState(false);
  const [reelsAutoScrollLoops, setReelsAutoScrollLoops] = useState(1);
  const [scannerSettings, setScannerSettings] = useState({ minFileSizeMB: 0.1, minSongDurationSeconds: 5 });
  const [aiCoverArtEnabled, setAiCoverArtEnabled] = useState(true);
  const [aiDjMode, setAiDjMode] = useState(true);
  const [isDjSessionStarting, setIsDjSessionStarting] = useState(false);

  // Queries
  const localTracksQuery = useMemoFirebase(() => user ? query(collection(firestore, 'users', user.uid, 'localTracks')) : null, [firestore, user?.uid]);
  const { data: localTracksData } = useCollection<Track>(localTracksQuery);
  
  const playlistsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'playlists'), where('userId', '==', user.uid)) : null, [firestore, user?.uid]);
  const { data: playlistsData } = useCollection<Playlist>(playlistsQuery);

  const favQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'favorites') : null, [firestore, user?.uid]);
  const { data: favDocs } = useCollection(favQuery);

  const achievementsQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'achievements') : null, [firestore, user?.uid]);
  const { data: achievementsData } = useCollection<Achievement>(achievementsQuery);

  const notificationsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'users', user.uid, 'notifications'), orderBy('createdAt', 'desc'), limit(50)) : null, [firestore, user?.uid]);
  const { data: notificationsData } = useCollection<AuraNotification>(notificationsQuery);

  // Audio Logic
  const seekTo = useCallback((t: number) => { 
    if (audioRef.current && Number.isFinite(t)) { 
      try { audioRef.current.currentTime = t; setCurrentTime(t); } catch (e) {} 
    } 
  }, []);

  const playUISound = useCallback((type: 'click' | 'resonance' | 'switch' | 'tick') => {
    if (isHapticsEnabled && typeof window !== 'undefined') {
      const hapticStyle = type === 'click' ? ImpactStyle.Light : type === 'switch' ? ImpactStyle.Heavy : ImpactStyle.Medium;
      Haptics.impact({ style: hapticStyle });
    }
    const sound = uiSoundsRef.current[type];
    if (sound) { sound.volume = 0.5; sound.currentTime = 0; sound.play().catch(() => {}); }
  }, [isHapticsEnabled]);

  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      const source = ctx.createMediaElementSource(audioRef.current);
      const filters = [60, 250, 1000, 4000, 16000].map(f => {
        const filter = ctx.createBiquadFilter(); filter.type = 'peaking'; filter.frequency.value = f; filter.gain.value = 0; return filter;
      });
      const reverbGain = ctx.createGain(); reverbGain.gain.value = 0;
      let lastNode: AudioNode = source;
      filters.forEach(f => { lastNode.connect(f); lastNode = f; });
      lastNode.connect(reverbGain); lastNode.connect(analyser);
      analyser.connect(ctx.destination);
      audioContextRef.current = ctx; filtersRef.current = filters; reverbGainRef.current = reverbGain; setAnalyserNode(analyser);
    } catch (e) { console.error("AuraCore: Signal Error", e); }
  }, []);

  const crossfadeVolume = useCallback((targetVolume: number, durationMs: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (crossfadeTimer.current) clearInterval(crossfadeTimer.current);
    const startVolume = audioRef.current.volume;
    const steps = 20; const stepTime = durationMs / steps; const volumeStep = (targetVolume - startVolume) / steps;
    let currentStep = 0;
    crossfadeTimer.current = setInterval(() => {
      if (!audioRef.current) { clearInterval(crossfadeTimer.current!); return; }
      currentStep++; const nextVolume = startVolume + (volumeStep * currentStep);
      audioRef.current.volume = Math.max(0, Math.min(1, nextVolume));
      if (currentStep >= steps) { clearInterval(crossfadeTimer.current!); if (onComplete) onComplete(); }
    }, stepTime);
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    if (!audioRef.current || !track?.id) return;
    initAudioContext();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    const startPlayback = async () => {
      try {
        setCurrentTrack(track);
        audioRef.current!.pause();
        let finalUrl = track.audioUrl;
        if (track.source === 'local') { const cached = await idb.get(`aura_blob_${track.id}`); if (cached) finalUrl = cached; }
        audioRef.current!.crossOrigin = (finalUrl?.startsWith('blob:') || track.isLocal) ? null : "anonymous";
        audioRef.current!.src = finalUrl || '';
        audioRef.current!.load();
        const targetVol = Math.pow(volume / 100, 2);
        audioRef.current!.volume = 0; audioRef.current!.playbackRate = playbackSpeed;
        await audioRef.current!.play(); setIsPlaying(true); crossfadeVolume(targetVol, 800);
      } catch (e: any) { if (e.name !== 'AbortError') { setIsPlaying(false); toast({ variant: "destructive", title: "Link Failure" }); } }
      if (user) {
        const hRef = doc(collection(firestore, 'users', user.uid, 'listeningHistory'));
        setDocumentNonBlocking(hRef, { userId: user.uid, trackId: track.id, trackTitle: track.title, artist: track.artist, genre: track.genre, listenedAt: serverTimestamp() }, { merge: true });
      }
      setQueue(prev => prev.find(t => t.id === track.id) ? prev : [track, ...prev]);
    };
    if (isPlaying) crossfadeVolume(0, 300, startPlayback); else await startPlayback();
  }, [user, firestore, initAudioContext, isPlaying, volume, playbackSpeed, crossfadeVolume, toast]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    initAudioContext();
    if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    if (isPlaying) { crossfadeVolume(0, 300, () => { audioRef.current?.pause(); setIsPlaying(false); }); }
    else { if (audioRef.current.src) audioRef.current.play().then(() => { setIsPlaying(true); crossfadeVolume(Math.pow(volume/100,2), 500); }).catch(()=>{}); }
  }, [isPlaying, volume, initAudioContext, crossfadeVolume]);

  const nextTrack = useCallback(() => { 
    if (queue.length) { const idx = queue.findIndex(t => t.id === currentTrack?.id); playTrack(queue[(idx + 1) % queue.length]); } 
  }, [queue, currentTrack, playTrack]);

  const prevTrack = useCallback(() => { 
    if (queue.length) { const idx = queue.findIndex(t => t.id === currentTrack?.id); playTrack(queue[(idx - 1 + queue.length) % queue.length]); } 
  }, [queue, currentTrack, playTrack]);

  const updateTrackMetadata = useCallback((trackId: string, updates: Partial<Track>) => {
    if (user) updateDocumentNonBlocking(doc(firestore, 'users', user.uid, 'localTracks', trackId), { ...updates, updatedAt: serverTimestamp() });
  }, [user, firestore]);

  const synthesizeTrackCover = async (track: Track) => {
    if (!track || isSynthesizingCover) return;
    setIsSynthesizingCover(true);
    playUISound('resonance');
    try {
      const result = await generateTrackCover({
        title: track.title,
        artist: track.artist,
        genre: track.genre
      });
      if (result.imageUrl) {
        updateTrackMetadata(track.id, { coverUrl: result.imageUrl });
        toast({ title: "Synthesis Complete", description: "Spectral artwork recalibrated." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Synthesis Failed", description: "Neural image link unstable." });
    } finally {
      setIsSynthesizingCover(false);
    }
  };

  const exportSystemData = () => {
    const data = {
      localTracks: localTracksData,
      favorites: favDocs?.map(d => d.data()),
      playlists: playlistsData,
      settings: { themeColor, isDarkMode, fontSizeMultiplier, neonGlow, fontFamily }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraTune_Backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Backup Synthesized", description: "System state exported to local node." });
  };

  const importSystemData = async (file: File) => {
    if (!user) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const batch = writeBatch(firestore);
      
      if (data.localTracks) {
        data.localTracks.forEach((t: any) => {
          const ref = doc(firestore, 'users', user.uid, 'localTracks', t.id);
          batch.set(ref, { ...t, userId: user.uid, updatedAt: serverTimestamp() }, { merge: true });
        });
      }
      
      await batch.commit();
      toast({ title: "System Restored", description: "Workstation node recalibrated from backup." });
      window.location.reload();
    } catch (e) {
      toast({ variant: "destructive", title: "Import Failed", description: "Corrupted or invalid system node." });
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const contextValue: MusicContextType = {
    currentTrack, isPlaying, volume, playbackSpeed, pitch,
    setPitch: (p) => { setPitch(p); if (audioRef.current) (audioRef.current as any).preservesPitch = false; },
    reverbLevel, setReverbLevel: (v) => { setReverbLevel(v); if (reverbGainRef.current) reverbGainRef.current.gain.value = v / 100; },
    queue, localTracks: optimisticTracks.concat(localTracksData || []).filter((t, i, a) => t && t.id && a.findIndex(s => s.id === t.id) === i),
    favorites: favDocs?.map(d => d.get('entityId')) || [], playlists: playlistsData || [], unlockedAchievements: achievementsData || [], notifications: notificationsData || [],
    analyserNode, isShuffled, repeatMode, toggleShuffle: () => setIsShuffled(!isShuffled), cycleRepeat: () => { const ms: any[] = ['none', 'all', 'one']; setRepeatMode(ms[(ms.indexOf(repeatMode)+1)%ms.length]); },
    playTrack, togglePlay, setVolume: (v) => { setVolume(v); if (audioRef.current) audioRef.current.volume = Math.pow(v / 100, 2); }, 
    setPlaybackSpeed: (s) => { setPlaybackSpeed(s); if (audioRef.current) audioRef.current.playbackRate = s; }, 
    nextTrack, prevTrack, addToQueue: (t) => setQueue(p => p.find(x => x.id === t.id) ? p : [...p, t]), removeFromQueue: (id) => setQueue(p => p.filter(x => x.id !== id)), 
    toggleFavorite: (t) => { if (!user) return; const fav = contextValue.isFavorite(t.id); if (fav) deleteDoc(doc(firestore, 'users', user.uid, 'favorites', `${user.uid}_${t.id}`)); else setDocumentNonBlocking(doc(firestore, 'users', user.uid, 'favorites', `${user.uid}_${t.id}`), { userId: user.uid, entityId: t.id, favoritedAt: serverTimestamp(), title: t.title, artist: t.artist, coverUrl: t.coverUrl }, { merge: true }); },
    isFavorite: (id) => contextValue.favorites.includes(id),
    createPlaylist: (n) => { if (!user) return; const id = doc(collection(firestore, 'playlists')).id; setDocumentNonBlocking(doc(firestore, 'playlists', id), { id, userId: user.uid, name: n, trackIds: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true }); },
    addTrackToPlaylist: (pid, tid) => { const pl = playlistsData?.find(p => p.id === pid); if (pl) updateDoc(doc(firestore, 'playlists', pid), { trackIds: [...new Set([...pl.trackIds, tid])], updatedAt: serverTimestamp() }); },
    applaudTrack: (t) => { const nt = { ...t, addedAt: { seconds: Date.now()/1000 }, userId: user?.uid || 'guest' }; setOptimisticTracks(p => [nt as Track, ...p]); if (user) { setDocumentNonBlocking(doc(firestore, 'users', user.uid, 'localTracks', t.id), { ...t, addedAt: serverTimestamp(), userId: user.uid }, { merge: true }); if (t.audioUrl?.startsWith('blob:')) idb.set(`aura_blob_${t.id}`, t.audioUrl); } },
    removeLocalTrack: (id) => { setOptimisticTracks(p => p.filter(t => t.id !== id)); if (user) { deleteDocumentNonBlocking(doc(firestore, 'users', user.uid, 'localTracks', id)); idb.del(`aura_blob_${id}`); } },
    isSidebarCollapsed, toggleSidebar: () => setIsSidebarCollapsed(!isSidebarCollapsed),
    currentTime, duration, seekTo, eqBands, setEqBand: (i, v) => { const b = [...eqBands]; b[i] = v; setEqBands(b); if (filtersRef.current[i]) filtersRef.current[i].gain.value = v; },
    updateTrackMetadata, purgeAllData: async () => { if (!user) return; await signOut(auth); window.location.href = '/login'; },
    fontFamily, setFontFamily, isDarkMode, setDarkMode, toggleDarkMode: () => setDarkMode(!isDarkMode), themeColor, setThemeColor, playUISound, isHighContrast, setHighContrast, blurIntensity, setBlurIntensity, animationSpeed, setAnimationSpeed, apiKeys, setApiKey: (p, k) => setApiKeys(prev => ({ ...prev, [p]: k })), dynamicThemeMode, setDynamicThemeMode, customThemeColors: {} as any, setCustomThemeColors: () => {}, nameplateAnimation: 'none', setNameplateAnimation: (anim) => setNameplateAnimation(anim), neonGlow, setNeonGlow, fontSizeMultiplier, setFontSizeMultiplier, checkAchievement: (id, cond) => { if (user && cond && achievementsData && !achievementsData.find(a => a.achievementId === id)) { const ach = ALL_ACHIEVEMENTS.find(a => a.id === id); if (!ach) return; const ref = doc(collection(firestore, 'users', user.uid, 'achievements')); setDocumentNonBlocking(ref, { id: ref.id, userId: user.uid, achievementId: id, title: ach.title, description: ach.description, unlockedAt: serverTimestamp() }, { merge: true }); window.dispatchEvent(new CustomEvent('aura-achievement', { detail: ach })); playUISound('resonance'); } },
    startAiDjSession: async () => { if (contextValue.localTracks.length) { const p = contextValue.localTracks[Math.floor(Math.random()*contextValue.localTracks.length)]; playTrack(p); } },
    isDjSessionStarting, aiDjReasoning: "", isHapticsEnabled, setHapticsEnabled, isDataSaverMode, setDataSaverMode, reelsAutoScrollLoops, setReelsAutoScrollLoops, scannerSettings, setScannerSettings, aiCoverArtEnabled, setAiCoverArtEnabled, aiDjMode, setAiDjMode, isExitDialogOpen, setExitDialogOpen, isFullPlayer, setIsFullPlayer, visualizerMode, cycleVisualizer: () => { const modes: VisualizerMode[] = ['wave', 'pulse', 'neural', 'spectrum', 'nebula']; setVisualizerMode(modes[(modes.indexOf(visualizerMode) + 1) % modes.length]); },
    isOnline, exportSystemData, importSystemData, activeRoomId, isLeader, createRoom: async (n) => { if (!user) return; const id = doc(collection(firestore, 'listeningRooms')).id; await setDoc(doc(firestore, 'listeningRooms', id), { id, name: n, leaderId: user.uid, activeTrackId: currentTrack?.id || null, currentTime: currentTime, isPlaying, participantCount: 1, isPublic: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); setActiveRoomId(id); setIsLeader(true); }, joinRoom: async (id) => { setActiveRoomId(id); setIsLeader(false); }, leaveRoom: async () => { if (activeRoomId && isLeader) deleteDoc(doc(firestore, 'listeningRooms', activeRoomId)); setActiveRoomId(null); setIsLeader(false); },
    metronomeBpm, setMetronomeBpm, isMetronomeEnabled, toggleMetronome: () => setIsMetronomeEnabled(!isMetronomeEnabled), lyricScrollSpeed, setLyricScrollSpeed, markNotificationRead: (id) => { if (user) updateDocumentNonBlocking(doc(firestore, 'users', user.uid, 'notifications', id), { isRead: true }); }, clearAllNotifications: () => {}, synthesizeTrackCover, isSynthesizingCover
  };

  return (
    <MusicContext.Provider value={contextValue}>
      <audio 
        ref={audioRef} 
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={nextTrack}
        className="hidden"
      />
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
