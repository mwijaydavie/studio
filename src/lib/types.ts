
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string;
  isLocal?: boolean;
  source?: 'archive' | 'local' | 'radio' | 'audius' | 'demo';
  releaseDate?: string;
  addedAt?: any;
  updatedAt?: any;
  moodEmoji?: string;
  bpm?: number;
}

export interface ArtistSubmission {
  id: string;
  userId: string;
  title: string;
  artistName: string;
  genre: string;
  audioUrl: string;
  coverUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  trackIds: string[];
  description?: string;
  coverUrl?: string;
  isPublic: boolean;
  createdAt: any;
  updatedAt: any;
  emoji?: string;
  bgColor?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: any;
  title: string;
  description: string;
}

export interface NeonGlowSettings {
  enabled: boolean;
  style: 'rotate' | 'wave' | 'flame';
  speed: number;
}

export interface CustomThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bgColor: string;
  surfaceColor: string;
}

export interface ListeningRoom {
  id: string;
  name: string;
  leaderId: string;
  activeTrackId: string | null;
  currentTime: number;
  isPlaying: boolean;
  participantCount: number;
  isPublic: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface AuraNotification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'frequency' | 'achievement';
  isRead: boolean;
  createdAt: any;
}

export type VisualizerMode = 'wave' | 'pulse' | 'neural' | 'spectrum' | 'nebula';
