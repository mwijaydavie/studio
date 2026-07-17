
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Track } from '@/lib/types';
import { useMusic } from '@/context/music-context';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Heart, 
  Play, 
  X, 
  CheckCircle2, 
  Zap, 
  User, 
  Users, 
  ArrowLeft,
  Volume2,
  Music as MusicIcon,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';
import { cn } from '@/lib/utils';

interface MusicQuizProps {
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export function MusicQuiz({ onBack }: MusicQuizProps) {
  const { localTracks, checkAchievement, playUISound } = useMusic();
  const [gameMode, setGameMode] = useState<'solo' | 'versus' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [highScore, setHighScore] = useState(0);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [options, setOptions] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [snippetStart, setSnippetStart] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const snippetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const saved = localStorage.getItem('aura_quiz_highscore_solo');
    if (saved) setHighScore(parseInt(saved, 10));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (snippetTimeoutRef.current) clearTimeout(snippetTimeoutRef.current);
    };
  }, []);

  const level = Math.floor((round - 1) / 5) + 1;

  const startNewRound = () => {
    if (localTracks.length < 4) return;
    
    setIsNewHighScore(false);
    const correctIndex = Math.floor(Math.random() * localTracks.length);
    const correct = localTracks[correctIndex];
    
    const distractors: Track[] = [];
    while (distractors.length < 3) {
      const rand = localTracks[Math.floor(Math.random() * localTracks.length)];
      if (rand.id !== correct.id && !distractors.find(d => d.id === rand.id)) {
        distractors.push(rand);
      }
    }
    
    const allOptions = [...distractors, correct].sort(() => 0.5 - Math.random());
    
    setCurrentTrack(correct);
    setOptions(allOptions);
    setHasGuessed(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    
    if (audioRef.current) {
      audioRef.current.src = correct.audioUrl || '';
      audioRef.current.volume = 1;
      
      let baseDuration = 10;
      if (difficulty === 'easy') baseDuration = 15;
      if (difficulty === 'hard') baseDuration = 5;
      
      const snippetDuration = Math.max(2, baseDuration - (level - 1));
      const randomStart = Math.random() * 30; // Start within first 30s
      setSnippetStart(randomStart);

      audioRef.current.currentTime = randomStart; 
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      
      if (snippetTimeoutRef.current) clearTimeout(snippetTimeoutRef.current);
      snippetTimeoutRef.current = setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      }, snippetDuration * 1000);
    }
  };

  const handleGuess = (trackId: string) => {
    if (hasGuessed || !currentTrack || isGameOver) return;
    
    const correct = trackId === currentTrack.id;
    setHasGuessed(true);
    setIsCorrect(correct);
    
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    if (snippetTimeoutRef.current) clearTimeout(snippetTimeoutRef.current);

    if (correct) {
      playUISound('resonance');
      setScore(prev => {
        const points = 100 + (level * 10);
        const newScore = { ...prev, [turn === 1 ? 'p1' : 'p2']: prev[turn === 1 ? 'p1' : 'p2'] + points };
        
        if (gameMode === 'solo' && newScore.p1 > highScore) {
          setHighScore(newScore.p1);
          setIsNewHighScore(true);
          localStorage.setItem('aura_quiz_highscore_solo', newScore.p1.toString());
        }
        return newScore;
      });
      setFeedbackMessage("Resonance Established! 🎉");
      checkAchievement('quiz_master', true);
    } else {
      playUISound('click');
      setFeedbackMessage(`Neural Mismatch. Source: "${currentTrack.title}"`);
      if (gameMode === 'solo') {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setTimeout(() => setIsGameOver(true), 1500);
          return newLives;
        });
      }
    }
  };

  const nextRound = () => {
    if (gameMode === 'versus') setTurn(prev => prev === 1 ? 2 : 1);
    setRound(r => r + 1);
    startNewRound();
  };
  
  const restartGame = () => {
    setIsGameOver(false);
    setScore({ p1: 0, p2: 0 });
    setLives(3);
    setRound(1);
    setTurn(1);
    startNewRound();
  };

  if (localTracks.length < 4) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-8 animate-fade-in">
        <div className="h-20 w-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center">
          <MusicIcon className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold">Node Library Insufficient</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">You need at least 4 tracks in your repository to synthesize an Acoustic Quiz.</p>
        </div>
        <Button onClick={onBack} className="rounded-2xl px-10 h-14 bg-primary font-bold uppercase tracking-widest text-[10px]">Back to Workspace</Button>
      </div>
    );
  }

  if (!gameMode) {
    return (
      <div className="max-w-xl mx-auto space-y-12 animate-fade-in p-6">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl"><ArrowLeft /></Button>
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tighter">Acoustic Quiz</h1>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Hardware Perception Test</p>
          </div>
        </header>
        
        <div className="liquid-glass rounded-[2.5rem] p-8 flex items-center justify-between border-white/5">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Record</p>
            <p className="text-4xl font-headline font-bold text-primary">{highScore}</p>
          </div>
          <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground ml-4">Calibration Difficulty</p>
          <div className="flex gap-3">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button 
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "flex-1 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                  difficulty === d ? "bg-primary border-primary text-white shadow-xl scale-105" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <button onClick={() => { setGameMode('solo'); setLives(3); startNewRound(); }} className="liquid-glass group rounded-[2.5rem] p-8 border-white/5 hover:border-primary/40 transition-all text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">3 Lives • Score Attack</span>
            </div>
            <h3 className="text-2xl font-headline font-bold">Solo Perception</h3>
            <p className="text-xs text-muted-foreground mt-1">Identify patterns to climb the global node leaderboard.</p>
          </button>

          <button onClick={() => { setGameMode('versus'); startNewRound(); }} className="liquid-glass group rounded-[2.5rem] p-8 border-white/5 hover:border-accent/40 transition-all text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-accent">2 Players • passing mode</span>
            </div>
            <h3 className="text-2xl font-headline font-bold">Versus Sync</h3>
            <p className="text-xs text-muted-foreground mt-1">Challenge a nearby architect. Precision is key.</p>
          </button>
        </div>
      </div>
    );
  }
  
  if (isGameOver) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-10 animate-fade-in">
        <h1 className="text-6xl font-headline font-bold tracking-tighter text-white">Node Failure</h1>
        <p className="text-muted-foreground text-lg italic">"Acoustic synchronization exhausted."</p>
        
        <div className="liquid-glass rounded-[3rem] p-10 w-full max-w-sm border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={40} className="text-primary" /></div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] mb-4">Final Resonance Score</p>
          <p className="text-7xl font-headline font-bold text-primary mb-2">{score.p1}</p>
          {score.p1 >= highScore && score.p1 > 0 && (
            <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold uppercase text-[10px] tracking-widest animate-bounce">
              <Trophy size={14} /> New Global High Score!
            </div>
          )}
        </div>
        
        <div className="flex gap-4 w-full max-w-sm">
          <Button onClick={() => setGameMode(null)} variant="ghost" className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/5 font-bold text-[10px] uppercase tracking-widest">Protocol Menu</Button>
          <button onClick={restartGame} className="neon-shimmer flex-1 h-16 flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Re-Initialize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10 animate-fade-in relative">
      {(isCorrect || isNewHighScore) && <Confetti />}
      
      <header className="flex justify-between items-center bg-black/20 backdrop-blur-xl p-4 rounded-[2rem] border border-white/5">
        <Button variant="ghost" size="icon" onClick={() => setGameMode(null)} className="h-10 w-10 rounded-full"><X size={20} /></Button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Level {level}</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Round {round}</span>
        </div>
        {gameMode === 'solo' ? (
          <div className="flex gap-1.5 px-3">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={16} className={cn(i < lives ? "text-rose-500 fill-current" : "text-white/10")} />
            ))}
          </div>
        ) : <div className="w-10" />}
      </header>

      <div className="flex justify-between px-4">
        <div className="text-center">
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{gameMode === 'versus' ? 'P1 Resonance' : 'Session Score'}</p>
          <p className="text-3xl font-headline font-bold text-primary">{score.p1}</p>
        </div>
        {gameMode === 'versus' && (
          <div className="text-center">
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">P2 Resonance</p>
            <p className="text-3xl font-headline font-bold text-accent">{score.p2}</p>
          </div>
        )}
      </div>

      {gameMode === 'versus' && !hasGuessed && (
        <div className="text-center animate-pulse">
          <span className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white">
            Architect {turn}'s Sequence
          </span>
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center space-y-12 py-10">
        <div className="relative group">
          <div className={cn(
            "h-40 w-40 rounded-[3rem] liquid-glass flex items-center justify-center shadow-3xl transition-all duration-500 border-2",
            isPlaying ? "border-primary/40 scale-110 shadow-primary/20" : "border-white/5 scale-100"
          )}>
            {isPlaying ? <Volume2 size={48} className="text-primary animate-pulse" /> : <MusicIcon size={48} className="text-muted-foreground/20" />}
          </div>
          {isPlaying && (
            <div className="absolute inset-0 rounded-[3rem] border-4 border-primary/20 animate-ping [animation-duration:3s]" />
          )}
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-headline font-bold tracking-tight">Identify Frequency</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Snippet start: {Math.floor(snippetStart)}s</p>
        </div>

        <div className="grid gap-3 w-full max-w-sm">
          {options.map(track => (
            <button
              key={track.id}
              onClick={() => handleGuess(track.id)}
              disabled={hasGuessed}
              className={cn(
                "group relative p-5 rounded-[1.5rem] font-bold text-left transition-all border flex flex-col gap-1 overflow-hidden",
                !hasGuessed 
                  ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-primary/20 active:scale-95" 
                  : track.id === currentTrack?.id 
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                    : isCorrect 
                      ? "opacity-30 border-transparent bg-white/5" 
                      : track.id !== currentTrack?.id && !isCorrect && hasGuessed && "bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60"
              )}
            >
              <div className="flex items-center justify-between relative z-10">
                <span className="truncate text-sm uppercase tracking-widest">{track.title}</span>
                {hasGuessed && track.id === currentTrack?.id && <CheckCircle2 size={16} />}
              </div>
              <span className="text-[10px] font-medium opacity-40 truncate relative z-10">{track.artist}</span>
              {hasGuessed && track.id === currentTrack?.id && (
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {hasGuessed && (
          <div className="w-full max-w-sm space-y-6 animate-fade-in pt-4">
            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 text-center italic text-sm text-muted-foreground leading-relaxed">
              "{feedbackMessage}"
            </div>
            <button onClick={nextRound} className="neon-shimmer w-full h-16 flex items-center justify-center gap-3">
              {gameMode === 'versus' ? `Advance to Architect ${turn === 1 ? '2' : '1'}` : `Continue Session`}
              <Zap size={16} className="fill-current" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
