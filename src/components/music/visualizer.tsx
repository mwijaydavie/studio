
"use client";

import React, { useEffect, useRef } from 'react';
import { useMusic } from '@/context/music-context';
import { VisualizerMode } from '@/lib/types';

export function Visualizer({ mode: propMode, color }: { mode?: VisualizerMode, color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, analyserNode, themeColor, visualizerMode: contextMode } = useMusic();
  const mode = propMode || contextMode;

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    let aid: number;
    const particles = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random()-0.5)*0.001, vy: (Math.random()-0.5)*0.001, s: Math.random()*2+1 }));
    
    const render = () => {
      const cvs = canvasRef.current!;
      const parent = cvs.parentElement!;
      if (cvs.width !== parent.clientWidth || cvs.height !== parent.clientHeight) { cvs.width = parent.clientWidth; cvs.height = parent.clientHeight; }
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const c = color || (themeColor === 'blue' ? '#3b82f6' : themeColor === 'emerald' ? '#10b981' : themeColor === 'rose' ? '#f43f5e' : '#A24CF1');

      if (!analyserNode) {
        const bars = 40; const bw = cvs.width / bars;
        for (let i = 0; i < bars; i++) {
          const h = (isPlaying ? Math.random() * cvs.height * 0.8 : 5) + Math.sin(Date.now()*0.01 + i*0.2)*10;
          ctx.fillStyle = c; ctx.globalAlpha = 0.3; ctx.fillRect(i*bw+2, cvs.height-h, bw-4, h);
        }
      } else {
        const data = new Uint8Array(analyserNode.frequencyBinCount); analyserNode.getByteFrequencyData(data);
        if (mode === 'pulse') {
          const bw = (cvs.width / (data.length / 2)) * 2.5;
          for (let i = 0; i < data.length/2; i++) { const h = (data[i]/255)*cvs.height*0.8; ctx.fillStyle = c; ctx.globalAlpha = 0.4+(data[i]/255)*0.6; ctx.fillRect(i*bw, cvs.height-h, bw-1, h); }
        } else if (mode === 'wave') {
          ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = c; ctx.globalAlpha = 0.8;
          const sw = cvs.width / data.length;
          for (let i = 0; i < data.length; i++) { const y = (data[i]/128.0)*cvs.height/2; if (i === 0) ctx.moveTo(i*sw, y); else ctx.lineTo(i*sw, y); }
          ctx.stroke();
        } else if (mode === 'nebula') {
          const bass = data[0]/255;
          particles.forEach((p, i) => {
            p.x += p.vx * (1+bass*10); p.y += p.vy * (1+bass*10);
            if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0; if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x*cvs.width, p.y*cvs.height, p.s*(1+bass*2), 0, Math.PI*2);
            ctx.fillStyle = c; ctx.globalAlpha = 0.1+bass*0.4; ctx.fill();
          });
        } else if (mode === 'neural') {
          const cx = cvs.width/2; const cy = cvs.height/2; const r = Math.min(cx,cy)*0.4;
          ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = c;
          for (let i = 0; i < data.length; i += 8) {
            const a = (i/data.length)*Math.PI*2; const amp = (data[i]/255)*100;
            const x = cx + Math.cos(a)*(r+amp); const y = cy + Math.sin(a)*(r+amp);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.stroke();
        }
      }
      aid = requestAnimationFrame(render);
    };
    render(); return () => cancelAnimationFrame(aid);
  }, [isPlaying, analyserNode, mode, themeColor, color]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
