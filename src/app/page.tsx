"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Headphones, Music2, Play, Radio, Sparkles, Waves } from 'lucide-react';
import Link from 'next/link';

const bars = [18, 32, 23, 48, 37, 64, 44, 78, 56, 91, 65, 42, 73, 53, 84, 46, 68, 35, 57, 28, 44, 20];

export default function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="landing-shell relative min-h-[100svh] overflow-hidden bg-[#09080d] text-white">
      <div aria-hidden="true" className="landing-glow landing-glow-one" />
      <div aria-hidden="true" className="landing-glow landing-glow-two" />
      <div aria-hidden="true" className="landing-grid" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14 lg:py-7">
        <Link href="/" aria-label="AuraTune home" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.07] shadow-[0_8px_30px_rgba(146,77,255,.16)] transition-transform group-hover:rotate-[-8deg]">
            <Music2 className="h-[19px] w-[19px] text-[#c5a3ff]" strokeWidth={2.1} />
          </span>
          <span className="font-headline text-[17px] font-bold tracking-[-0.05em]">Aura<span className="text-[#b48aff]">Tune</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[13px] font-medium text-white/55 sm:flex">
          <a href="#experience" className="transition-colors hover:text-white">The experience</a>
          <Link href="/discover" className="transition-colors hover:text-white">Discover</Link>
          <Link href="/login" className="transition-colors hover:text-white">Sign in</Link>
        </nav>

        <Link href="/login" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[12px] font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10 active:scale-[.98]">
          Enter studio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <section className="relative z-[1] mx-auto grid min-h-[calc(100svh-92px)] w-full max-w-[1440px] items-center gap-12 px-5 pb-16 pt-8 sm:px-8 md:pt-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-6 lg:px-14 lg:pb-20 lg:pt-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[680px]"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b18aff]/20 bg-[#9e6bff]/[0.09] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#d2bdff] sm:mb-9 sm:text-[11px]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#bd9aff] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#bd9aff]" /></span>
            Your sound. Your space.
          </div>

          <h1 className="max-w-[760px] font-headline text-[clamp(3.45rem,10.5vw,7.5rem)] font-semibold leading-[.91] tracking-[-.075em] text-white">
            Find your
            <span className="landing-heading-line"> own frequency<span className="text-[#b990ff]">.</span></span>
          </h1>
          <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-white/55 sm:mt-8 sm:text-[17px] sm:leading-8">
            One thoughtful home for the music you love. Discover new sounds, build your library, and make every listening session yours.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link href="/login" className="landing-primary-button group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full px-6 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15"><Play className="ml-0.5 h-3 w-3 fill-current" /></span>
              Start listening
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/discover" className="inline-flex min-h-[50px] items-center justify-center gap-2 px-4 text-[13px] font-medium text-white/65 transition-colors hover:text-white">
              Explore as a guest <ArrowDownRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.09] pt-6 text-[11px] font-medium text-white/45 sm:mt-16 sm:gap-x-8 sm:pt-7">
            <span className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-[#b990ff]" /> Made for listening</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#b990ff]" /> Personal discovery</span>
            <span className="inline-flex items-center gap-2"><Radio className="h-4 w-4 text-[#b990ff]" /> Your library, in sync</span>
          </div>
        </motion.div>

        <motion.div
          id="experience"
          initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: .12, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[560px] lg:ml-auto lg:mr-0"
        >
          <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
          <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
          <div className="landing-record" aria-hidden="true">
            <div className="landing-record-groove landing-record-groove-one" />
            <div className="landing-record-groove landing-record-groove-two" />
            <div className="landing-record-groove landing-record-groove-three" />
            <div className="landing-record-center"><Waves className="h-9 w-9 text-white" strokeWidth={1.5} /></div>
          </div>
          <div className="landing-player-card relative z-[2] mx-auto w-full max-w-[470px] rounded-[26px] border border-white/[0.13] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-white/40">Now in your orbit</p>
                <p className="mt-1 text-[12px] font-medium text-white/75">A little room to feel it.</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#a979ff]/20 bg-[#a979ff]/[0.1] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[.14em] text-[#d0b8ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#bd9aff]" /> Aura mix
              </div>
            </div>

            <div className="relative mt-6 flex aspect-[1.2/1] items-center justify-center overflow-hidden rounded-[19px] border border-white/[0.08] bg-[radial-gradient(ellipse_at_50%_45%,rgba(145,86,255,.35),transparent_47%),linear-gradient(135deg,#1b1425,#0e1018_56%,#15101d)] sm:mt-7">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,.07)_50%,transparent_64%)]" />
              <div className="absolute h-[68%] w-[68%] rounded-full border border-white/[0.06]" />
              <div className="absolute h-[53%] w-[53%] rounded-full border border-white/[0.08]" />
              <div className="absolute h-[38%] w-[38%] rounded-full border border-white/[0.1]" />
              <div className="relative flex h-[29%] w-[29%] items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#d8bbff] via-[#8255d7] to-[#2b1b45] shadow-[0_0_80px_rgba(160,106,255,.38)]">
                <div className="h-[38%] w-[38%] rounded-full border border-white/25 bg-[#130d1d]/80" />
              </div>
              <div className="absolute left-[12%] top-[19%] h-2 w-2 rounded-full bg-[#f0b9a4] shadow-[0_0_20px_5px_rgba(240,185,164,.18)]" />
              <div className="absolute bottom-[18%] right-[16%] h-1.5 w-1.5 rounded-full bg-[#b7a0ff] shadow-[0_0_18px_5px_rgba(183,160,255,.35)]" />
              <span className="absolute bottom-4 left-4 text-[9px] font-medium uppercase tracking-[.2em] text-white/35">Take a breath · Press play</span>
            </div>

            <div className="mt-5 flex items-center gap-3 sm:mt-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#b996ff] via-[#7652c8] to-[#32223f] shadow-[0_6px_22px_rgba(127,81,211,.24)]">
                <Music2 className="h-[18px] w-[18px] text-white/90" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">A new kind of quiet</p>
                <p className="mt-1 truncate text-[11px] text-white/45">The AuraTune listening space</p>
              </div>
              <Link href="/discover" aria-label="Explore music discovery" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#17131e] transition-transform hover:scale-105 active:scale-95">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </Link>
            </div>

            <div className="mt-5 flex h-8 items-center justify-center gap-[3px] overflow-hidden" aria-hidden="true">
              {bars.map((height, index) => <span key={index} className="landing-wave-bar w-[3px] rounded-full bg-gradient-to-t from-[#8055d0] to-[#dfcaff] opacity-80" style={{ height: `${height}%`, animationDelay: `${index * -0.09}s` }} />)}
            </div>
            <div className="mt-1 flex justify-between text-[9px] font-medium tabular-nums text-white/35"><span>01:24</span><span>03:48</span></div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 left-[6%] h-14 w-[88%] rounded-full bg-[#8d5bdb]/20 blur-[45px]" />
        </motion.div>
      </section>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </main>
  );
}
