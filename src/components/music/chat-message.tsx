
"use client";

import React, { useState } from 'react';
import { Bot, User, Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
  status?: string;
}

const parseInlineStyles = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-primary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-accent">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-4 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <Terminal size={12} />
          {language || 'terminal'}
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}{copied ? 'Synced' : 'Copy Node'}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-xs md:text-sm font-mono text-white/80 leading-relaxed bg-black/20">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const RichTextRenderer = ({ text }: { text: string }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const content = part.slice(3, -3);
          const firstLineBreak = content.indexOf('\n');
          const language = firstLineBreak > -1 ? content.slice(0, firstLineBreak).trim() : '';
          const code = firstLineBreak > -1 ? content.slice(firstLineBreak + 1) : content;
          return <CodeBlock key={index} code={code} language={language} />;
        }
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-2">
            {lines.map((line, i) => {
              if (!line.trim()) return <div key={i} className="h-2"></div>;
              if (line.match(/^#{1,6}\s/)) {
                const cleanHeader = line.replace(/^#{1,6}\s/, '');
                return <h3 key={i} className="text-lg font-headline font-bold text-foreground mt-6 mb-3">{parseInlineStyles(cleanHeader)}</h3>;
              }
              if (line.match(/^[\*\-]\s/)) {
                const cleanItem = line.replace(/^[\*\-]\s/, '');
                return (
                  <div key={i} className="flex gap-3 ml-2 mb-1">
                    <span className="text-primary mt-1.5 text-[8px]">●</span>
                    <span className="text-foreground/80">{parseInlineStyles(cleanItem)}</span>
                  </div>
                );
              }
              return <p key={i} className="leading-relaxed text-foreground/90">{parseInlineStyles(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export function ChatMessage({ role, content, status }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex items-start gap-4 max-w-4xl w-full",
        role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg transition-colors",
        role === 'user' ? "bg-primary/20 border-primary/20" : "bg-white/5 border-white/10"
      )}>
        {role === 'user' ? <User className="h-5 w-5 text-primary" /> : <Bot className="h-5 w-5 text-accent" />}
      </div>
      <div className="flex flex-col gap-2 max-w-[85%]">
        <div className={cn(
          "p-6 rounded-2xl md:rounded-[2.5rem] text-sm md:text-base leading-relaxed shadow-2xl transition-all",
          role === 'user' 
            ? "bg-primary text-white rounded-tr-none" 
            : "liquid-glass border-white/10 text-foreground rounded-tl-none"
        )}>
          {role === 'model' ? <RichTextRenderer text={content} /> : content}
        </div>
        {status && (
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/5 bg-white/5 w-fit">
            {status}
          </span>
        )}
      </div>
    </motion.div>
  );
}
