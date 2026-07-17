
"use client";

import React from 'react';
import { useMusic } from '@/context/music-context';
import { 
  Bell, 
  Trash2, 
  Clock, 
  Sparkles, 
  Zap, 
  Trophy, 
  ShieldCheck, 
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter() {
  const { notifications, markNotificationRead, clearAllNotifications, playUISound } = useMusic();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'frequency': return <Zap className="h-4 w-4 text-primary" />;
      default: return <ShieldCheck className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          onClick={() => playUISound('click')}
          className="relative h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground/10 transition-all group"
        >
          <Bell className={cn("h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors", unreadCount > 0 && "animate-wiggle")} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(162,76,241,1)] animate-pulse" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0 liquid-glass border-border shadow-3xl rounded-3xl overflow-hidden mt-2" align="end">
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-headline font-bold uppercase tracking-widest">Intelligence Feed</h3>
          </div>
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
            >
              <Trash2 size={10} /> Purge All
            </button>
          )}
        </header>

        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
          {notifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    "p-5 flex gap-4 transition-colors cursor-pointer",
                    !n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/5"
                  )}
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={cn("text-xs font-bold truncate", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </h4>
                      {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                       <Clock size={8} className="text-muted-foreground/40" />
                       <span className="text-[8px] text-muted-foreground/40 uppercase font-black">
                         {n.createdAt?.seconds ? formatDistanceToNow(n.createdAt.seconds * 1000) + ' ago' : 'Incoming'}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground/20">
                <Bell size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold">Network Silent</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">"No new neural transmissions recorded in the current session."</p>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 bg-black/40 border-t border-white/5 text-center">
           <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/10">AuraCore Alert Engine v7.0</p>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
