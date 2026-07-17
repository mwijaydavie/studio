
"use client";

import React from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { PlayerBar } from '@/components/music/player-bar';
import { MusicQuiz } from '@/components/music/music-quiz';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-transparent text-foreground">
      <MainSidebar />
      <main className="flex-1 pb-40 overflow-y-auto scrollbar-hide">
        <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
          <MusicQuiz onBack={() => router.push('/library')} />
        </div>
      </main>
      <PlayerBar />
    </div>
  );
}
