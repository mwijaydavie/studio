
"use client";

import React from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { 
  BookOpen, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  Bot, 
  Smartphone,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Globe,
  Settings2,
  HardDrive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from 'next/navigation';
import { useMusic } from '@/context/music-context';
import { cn } from '@/lib/utils';

export default function HelpPage() {
  const router = useRouter();
  const { isSidebarCollapsed } = useMusic();

  const sections = [
    {
      id: "ai-intelligence",
      title: "AuraCore v5.0 Intelligence",
      icon: <BrainCircuit className="h-5 w-5 text-primary" />,
      content: "AuraCore is the neural backbone of the workstation. It analyzes your patterns to provide predictive search results and synthesized responses in the Intelligence Node. You can converse with it to gain technical insights into genres, mixing, or workstation navigation."
    },
    {
      id: "mood-calibration",
      title: "Neural Mood Calibration",
      icon: <Sparkles className="h-5 w-5 text-accent" />,
      content: "Calibrate your workstation aura using facial resonance. By activating the Mood Node, AuraTune uses your camera to identify your emotional state and recalibrate the system's spectral palette and recommended patterns accordingly."
    },
    {
      id: "sonic-processor",
      title: "Sonic Processor (Studio FX)",
      icon: <Layers className="h-5 w-5 text-rose-400" />,
      content: "Access professional acoustic tools within the player workspace. The Sonic Processor features a 5-band hardware-calibrated Equalizer, Tempo Modulation (Playback Speed), and a Neural Metronome for pattern analysis."
    },
    {
      id: "apk-synthesis",
      title: "High-Quality APK Synthesis",
      icon: <Settings2 className="h-5 w-5 text-blue-400" />,
      content: "To generate a production-ready APK: 1. Run 'npm run mobile:build' in the terminal. 2. Use 'npx cap open android' to launch Android Studio. 3. In Android Studio, ensure 'AndroidManifest.xml' has Foreground Service permissions. 4. Go to 'Build > Build Bundle(s) / APK(s) > Build APK(s)'. This packages all assets for 100% offline workstation reliability."
    },
    {
      id: "visual-sync",
      title: "Visual Pattern Hub (Reels)",
      icon: <Zap className="h-5 w-5 text-primary" />,
      content: "Upload or discover visual soundscapes in the Reels hub. Patterns can be calibrated to loop multiple times before the system automatically advances to the next neural node in the sequence."
    },
    {
      id: "achievements",
      title: "Neural Milestones",
      icon: <Trophy className="h-5 w-5 text-yellow-400" />,
      content: "Your progress through the soundscape is recorded via 60 unique milestones. Unlock achievements by synthesizing voice nodes, mastering the acoustic quiz, or discovering historical global frequencies."
    }
  ];

  return (
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden">
      <MainSidebar />
      
      <main className={cn(
        "flex-1 pb-40 overflow-y-auto scrollbar-hide transition-all duration-500",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
          <header className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-[2rem] liquid-glass flex items-center justify-center animate-float shadow-3xl shadow-primary/20">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-5xl font-headline font-bold tracking-tighter">System Manual</h1>
                <p className="text-muted-foreground text-lg uppercase tracking-widest font-bold opacity-60">Workstation User Guide v6.4</p>
              </div>
            </div>
          </header>

          <section className="space-y-8">
            <h2 className="text-3xl font-headline font-bold flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              Core Protocols
            </h2>
            <div className="grid gap-4">
              {sections.map(section => (
                <Accordion type="single" collapsible key={section.id}>
                  <AccordionItem value={section.id} className="border-none liquid-glass rounded-[2rem] px-8 py-2 mb-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        {section.icon}
                        <span className="font-bold text-lg">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </section>

          <section className="p-10 rounded-[3rem] liquid-glass border-primary/20 space-y-6 bg-primary/5">
            <div className="flex items-center gap-4">
              <HardDrive className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-headline font-bold">Offline Resilience</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              AuraTune is architected for total offline reliability. Once your device node is scanned, all acoustic patterns and metadata are cached locally. The workstation landing page and UI tiles are pre-packaged within the hardware APK, ensuring an instant, network-independent launch.
            </p>
          </section>

          <footer className="pt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-muted-foreground/20">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-[8px] font-black uppercase tracking-[0.5em]">AuraTune Pro • Hardware Synthesis Ready</span>
            </div>
          </footer>
        </div>
      </main>

      <PlayerBar />
    </div>
  );
}
