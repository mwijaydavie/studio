
"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMusic } from '@/context/music-context';
import { App as CapacitorApp } from '@capacitor/app';
import { Power, ShieldAlert } from 'lucide-react';

export function ExitDialog() {
  const { isExitDialogOpen, setExitDialogOpen, playUISound } = useMusic();

  const handleExit = () => {
    playUISound('switch');
    CapacitorApp.exitApp();
  };

  return (
    <AlertDialog open={isExitDialogOpen} onOpenChange={setExitDialogOpen}>
      <AlertDialogContent className="liquid-glass border-primary/20 rounded-[2.5rem] p-10 max-w-sm mx-auto shadow-[0_0_100px_rgba(162,76,241,0.2)] animate-fade-in">
        <AlertDialogHeader className="space-y-6">
          <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
            <Power className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <AlertDialogTitle className="text-3xl font-headline font-bold text-foreground tracking-tighter text-center">
              Terminate Sync?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-center leading-relaxed">
              Confirm node disconnection. Your current acoustic session will be cached for the next initialization.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-10 grid grid-cols-2 gap-4">
          <AlertDialogCancel className="h-14 rounded-2xl bg-white/5 border-white/10 font-bold uppercase tracking-widest text-[10px] m-0">
            Resume Node
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleExit}
            className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] m-0 shadow-xl shadow-primary/20"
          >
            Shutdown
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
