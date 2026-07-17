
"use client";

import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { 
  Music, 
  Search, 
  Plus, 
  Settings, 
  User, 
  Library, 
  Play, 
  Zap, 
  Globe 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMusic } from "@/context/music-context";

export function CommandK() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { queue, togglePlay, createPlaylist } = useMusic();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="bg-background/80 backdrop-blur-xl border-t border-white/5">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Library className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/discover"))}>
            <Globe className="mr-2 h-4 w-4" />
            <span>Discover Frequencies</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => togglePlay())}>
            <Play className="mr-2 h-4 w-4" />
            <span>Toggle Playback</span>
            <CommandShortcut>Space</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => createPlaylist("New Sonic Session"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Playlist</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Search Tracks">
          {queue.slice(0, 5).map((track) => (
            <CommandItem key={track.id} onSelect={() => runCommand(() => router.push(`/search?q=${track.title}`))}>
              <Music className="mr-2 h-4 w-4" />
              <span>{track.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">{track.artist}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Configuration</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
