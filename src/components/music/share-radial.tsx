"use client";

import React from 'react';
import { Share2, Send, MessageSquare, Twitter, Instagram, Github, Youtube, MessageCircle } from 'lucide-react';

interface ShareRadialProps {
  onShare?: (platform: string) => void;
}

export function ShareRadial({ onShare }: ShareRadialProps) {
  const platforms = [
    { id: 'discord', icon: MessageSquare, color: '#5865F2' },
    { id: 'twitter', icon: Twitter, color: '#1CA1F1' },
    { id: 'reddit', icon: MessageCircle, color: '#FF4500' },
    { id: 'messenger', icon: Send, color: '#0093FF' },
    { id: 'youtube', icon: Youtube, color: '#FF0000' },
    { id: 'instagram', icon: Instagram, color: '#F914AF' },
    { id: 'github', icon: Github, color: '#333' },
    { id: 'whatsapp', icon: MessageCircle, color: '#25D366' },
  ];

  return (
    <div className="share-radial-container">
      <button className="share-radial-main">
        <Share2 className="h-5 w-5" />
      </button>
      
      {platforms.map((p, i) => (
        <button 
          key={p.id}
          onClick={() => onShare?.(p.id)}
          className={`share-radial-node node-${i + 1}`}
          title={`Share to ${p.id}`}
        >
          <p.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}