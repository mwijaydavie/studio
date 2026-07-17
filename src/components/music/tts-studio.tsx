
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic2, Radio, Sparkles, Wand2, Play, Pause, Download, 
  Volume2, History, Trash2, Clock, Gauge, Thermometer, User, UserCheck,
  AudioWaveform, FileText, Edit3, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoicePreset {
  id: string; 
  apiVoiceName: string; 
  stylePrompt?: string; 
  name: string; 
  gender: 'Masculine' | 'Feminine';
  desc: string;
  tags: string[];
}

const VOICE_PRESETS: VoicePreset[] = [
  { id: 'kore_base', apiVoiceName: 'Kore', name: 'Kore (Balanced)', gender: 'Feminine', desc: 'Natural & Soothing', tags: ['Standard'] },
  { id: 'kore_calm', apiVoiceName: 'Kore', stylePrompt: 'Speak in a very calm and meditative voice:', name: 'Kore (Zen)', gender: 'Feminine', desc: 'Deeply Relaxed', tags: ['Meditative'] },
  { id: 'kore_pro', apiVoiceName: 'Kore', stylePrompt: 'Speak in a professional news anchor tone:', name: 'Kore (News)', gender: 'Feminine', desc: 'Professional', tags: ['Broadcast'] },
  { id: 'zephyr_excited', apiVoiceName: 'Zephyr', stylePrompt: 'Speak with high energy and excitement:', name: 'Zephyr (Hype)', gender: 'Feminine', desc: 'Energetic', tags: ['Upbeat'] },
  { id: 'puck_base', apiVoiceName: 'Puck', name: 'Puck (Neutral)', gender: 'Masculine', desc: 'Clear & Direct', tags: ['Standard'] },
  { id: 'puck_story', apiVoiceName: 'Puck', stylePrompt: 'Speak like an engaging storyteller:', name: 'Puck (Story)', gender: 'Masculine', desc: 'Narrative', tags: ['Audiobook'] },
  { id: 'charon_auth', apiVoiceName: 'Charon', stylePrompt: 'Speak with absolute authority and command:', name: 'Charon (Boss)', gender: 'Masculine', desc: 'Authoritative', tags: ['Strong'] },
  { id: 'fenrir_drama', apiVoiceName: 'Fenrir', stylePrompt: 'Speak dramatically like a movie trailer voice:', name: 'Fenrir (Epic)', gender: 'Masculine', desc: 'Cinematic', tags: ['Dramatic'] },
];

type TTSMode = 'single' | 'podcast';

export function TTSStudio() {
  const [mode, setMode] = useState<TTSMode>('single');
  const [text, setText] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState('puck_base');
  const [temperature, setTemperature] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  
  // Podcast State
  const [host1Id, setHost1Id] = useState('puck_base');
  const [host2Id, setHost2Id] = useState('kore_base');
  const [podcastBlocks, setPodcastBlocks] = useState<{ speaker: string, text: string }[]>([]);
  const [isScriptGenerated, setIsScriptGenerated] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim() && !isScriptGenerated) return;
    setIsLoading(true);
    setAudioUrl(null);
    try {
      const preset = VOICE_PRESETS.find(v => v.id === selectedPresetId) || VOICE_PRESETS[0];
      const result = await generateSpeech({
        text: mode === 'single' ? text : podcastBlocks.map(b => `${b.speaker}: ${b.text}`).join('\n'),
        voiceName: preset.apiVoiceName as any,
        stylePrompt: preset.stylePrompt
      });
      setAudioUrl(result.media);
      const newItem = { id: Date.now(), text: text.slice(0, 30), voiceName: preset.name, timestamp: Date.now(), url: result.media };
      setHistoryItems([newItem, ...historyItems]);
      toast({ title: "Neural Sync Complete", description: "Audio node synthesized." });
    } catch (e) {
      toast({ variant: "destructive", title: "Synthesis Failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftScript = () => {
    if (!text.trim()) return;
    setPodcastBlocks([
      { speaker: 'Alex', text: `Welcome to Aura FM. Today we're diving into ${text}.` },
      { speaker: 'Jamie', text: `That's right, Alex. It's a fascinating technical subject.` }
    ]);
    setIsScriptGenerated(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
            {mode === 'single' ? <Mic2 size={28} /> : <Radio size={28} />}
          </div>
          <div>
            <h2 className="text-3xl font-headline font-bold tracking-tighter">
              {mode === 'single' ? 'Voice Studio' : 'Podcast Producer'}
            </h2>
            <p className="text-muted-foreground text-sm">Synthesize high-fidelity vocal patterns.</p>
          </div>
        </div>
        
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit">
          <button onClick={() => setMode('single')} className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", mode === 'single' ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white")}>Single Voice</button>
          <button onClick={() => setMode('podcast')} className={cn("px-6 py-2 rounded-xl text-xs font-bold transition-all", mode === 'podcast' ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white")}>Podcast Duo</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="liquid-glass rounded-[3rem] p-8 border-white/5 relative overflow-hidden h-full flex flex-col">
            {mode === 'podcast' && isScriptGenerated ? (
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><FileText size={12} /> Production Script</span>
                  <button onClick={() => setIsScriptGenerated(false)} className="text-[10px] font-bold text-muted-foreground hover:text-primary">Restart Node</button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {podcastBlocks.map((block, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{block.speaker}</span>
                        <Edit3 size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm leading-relaxed">{block.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-4 flex flex-col">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2"><Sparkles size={12} /> Neural Script</label>
                  <span className="text-[10px] text-muted-foreground font-mono">{text.length} chars</span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={mode === 'single' ? "Enter content to synthesize..." : "Enter topic for Alex & Jamie..."}
                  className="w-full flex-1 min-h-[300px] bg-black/20 border-none outline-none text-lg leading-relaxed placeholder:text-muted-foreground/20 resize-none rounded-2xl p-2"
                />
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {mode === 'podcast' && !isScriptGenerated && (
                <Button variant="outline" onClick={handleDraftScript} className="h-16 rounded-2xl flex-1 border-white/10 font-bold uppercase tracking-widest text-[10px]">Draft Script</Button>
              )}
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || (!text.trim() && !isScriptGenerated)}
                className="h-16 rounded-2xl flex-[2] bg-primary text-white font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {isLoading ? <><Wand2 className="animate-spin" /> Synthesizing...</> : <><Mic2 /> Generate Audio Node</>}
              </Button>
            </div>
          </div>

          {audioUrl && (
            <div className="liquid-glass rounded-[2.5rem] p-8 border-primary/20 animate-in slide-in-from-top-4 shadow-3xl flex items-center gap-8 relative overflow-hidden">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
              <button 
                onClick={togglePlay}
                className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span>Playback Active</span>
                  <div className="flex gap-4">
                    <button className="hover:text-white flex items-center gap-2"><Download size={14} /> WAV</button>
                    <button className="hover:text-white flex items-center gap-2"><Image size={14} /> Visualize</button>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-pulse w-[60%]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="liquid-glass rounded-[3rem] p-8 border-white/5 space-y-8 flex flex-col h-full">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2"><UserCheck size={14} /> Voice Model selection</h3>
              <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {VOICE_PRESETS.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedPresetId(v.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                      selectedPresetId === v.id ? "bg-primary/10 border-primary shadow-lg" : "bg-white/5 border-transparent hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs", selectedPresetId === v.id ? "bg-primary text-white" : "bg-white/5 text-muted-foreground")}>{v.apiVoiceName.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{v.name}</p>
                        <p className="text-[10px] text-muted-foreground italic">{v.desc}</p>
                      </div>
                    </div>
                    {selectedPresetId === v.id && <AudioWaveform size={16} className="text-primary animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 pt-8 border-t border-white/5">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2"><Thermometer size={14} /> Style Strength</span>
                  <span className="text-primary font-mono">{temperature.toFixed(1)}</span>
                </div>
                <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2"><Gauge size={14} /> Playback Rate</span>
                  <span className="text-primary font-mono">{speed}x</span>
                </div>
                <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer" />
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <button onClick={() => setShowHistory(!showHistory)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 text-sm font-bold"><History size={18} /> Generated Nodes</div>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">{historyItems.length}</span>
              </button>
              {showHistory && historyItems.length > 0 && (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide animate-in slide-in-from-top-2">
                  {historyItems.map(item => (
                    <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{item.text}...</p>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold mt-1">{item.voiceName}</p>
                      </div>
                      <button onClick={() => setAudioUrl(item.url)} className="text-primary hover:scale-110 transition-transform"><Play size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
