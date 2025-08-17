import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sampleAnimes } from '@/components/AnimeCard';

export interface AnimeData {
  id: string;
  title: string;
  titleEn: string;
  poster: string;
  rating: number;
  year: number;
  episodes: number;
  genre: string[];
  genreEn: string[];
  duration: string;
  description: string;
  descriptionEn: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  category: 'anime' | 'movie';
}

export interface Episode {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  videoUrl: string;
  duration: string;
  episodeNumber: number;
  airDate: string;
  animeId: string;
}

export interface WatchProgress {
  animeId: string;
  episodeId: number;
  progress: number;
  lastWatched: string;
}

export interface UserList {
  userId: string;
  animeId: string;
  addedAt: string;
  type: 'watchlist' | 'favorites' | 'completed';
}

interface AnimeStoreContextType {
  // Anime data
  animes: AnimeData[];
  episodes: Episode[];
  addAnime: (anime: Omit<AnimeData, 'id'>) => string;
  updateAnime: (id: string, anime: Partial<AnimeData>) => void;
  deleteAnime: (id: string) => void;
  getAnimeById: (id: string) => AnimeData | undefined;
  
  // Episode data
  addEpisode: (episode: Omit<Episode, 'id'>) => string;
  updateEpisode: (id: number, episode: Partial<Episode>) => void;
  deleteEpisode: (id: number) => void;
  getEpisodesByAnimeId: (animeId: string) => Episode[];
  
  // User progress
  watchProgress: WatchProgress[];
  updateWatchProgress: (animeId: string, episodeId: number, progress: number) => void;
  getUserProgress: (userId: string) => WatchProgress[];
  
  // User lists
  userLists: UserList[];
  addToList: (userId: string, animeId: string, type: UserList['type']) => void;
  removeFromList: (userId: string, animeId: string, type: UserList['type']) => void;
  getUserList: (userId: string, type: UserList['type']) => string[];
  
  // Admin notifications
  notifications: AdminNotification[];
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const AnimeStoreContext = createContext<AnimeStoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  animes: 'animewa_animes',
  episodes: 'animewa_episodes',
  watchProgress: 'animewa_watch_progress',
  userLists: 'animewa_user_lists',
  notifications: 'animewa_notifications'
};

export function AnimeStoreProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or defaults
  const [animes, setAnimes] = useState<AnimeData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.animes);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved animes:', e);
      }
    }
    return sampleAnimes as AnimeData[];
  });

  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.episodes);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved episodes:', e);
      }
    }
    return [];
  });

  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.watchProgress);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved watch progress:', e);
      }
    }
    return [];
  });

  const [userLists, setUserLists] = useState<UserList[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.userLists);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user lists:', e);
      }
    }
    return [];
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.notifications);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications:', e);
      }
    }
    return [];
  });

  // Auto-save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.animes, JSON.stringify(animes));
  }, [animes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.episodes, JSON.stringify(episodes));
  }, [episodes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.watchProgress, JSON.stringify(watchProgress));
  }, [watchProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.userLists, JSON.stringify(userLists));
  }, [userLists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  // Anime CRUD operations
  const addAnime = (animeData: Omit<AnimeData, 'id'>): string => {
    const id = `anime_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAnime: AnimeData = { ...animeData, id };
    setAnimes(prev => [...prev, newAnime]);
    
    // Add notification
    addNotification({
      title: 'Yeni Anime Eklendi',
      message: `${animeData.title} başarıyla eklendi`,
      type: 'success'
    });
    
    return id;
  };

  const updateAnime = (id: string, animeData: Partial<AnimeData>) => {
    setAnimes(prev => prev.map(anime => 
      anime.id === id ? { ...anime, ...animeData } : anime
    ));
    
    addNotification({
      title: 'Anime Güncellendi',
      message: `Anime bilgileri başarıyla güncellendi`,
      type: 'info'
    });
  };

  const deleteAnime = (id: string) => {
    const anime = animes.find(a => a.id === id);
    setAnimes(prev => prev.filter(anime => anime.id !== id));
    setEpisodes(prev => prev.filter(episode => episode.animeId !== id));
    
    if (anime) {
      addNotification({
        title: 'Anime Silindi',
        message: `${anime.title} silindi`,
        type: 'warning'
      });
    }
  };

  const getAnimeById = (id: string): AnimeData | undefined => {
    return animes.find(anime => anime.id === id);
  };

  // Episode CRUD operations
  const addEpisode = (episodeData: Omit<Episode, 'id'>): string => {
    const id = Date.now();
    const newEpisode: Episode = { ...episodeData, id };
    setEpisodes(prev => [...prev, newEpisode]);
    
    const anime = getAnimeById(episodeData.animeId);
    addNotification({
      title: 'Yeni Bölüm Eklendi',
      message: `${anime?.title} - Bölüm ${episodeData.episodeNumber} eklendi`,
      type: 'success'
    });
    
    return id.toString();
  };

  const updateEpisode = (id: number, episodeData: Partial<Episode>) => {
    setEpisodes(prev => prev.map(episode => 
      episode.id === id ? { ...episode, ...episodeData } : episode
    ));
  };

  const deleteEpisode = (id: number) => {
    setEpisodes(prev => prev.filter(episode => episode.id !== id));
  };

  const getEpisodesByAnimeId = (animeId: string): Episode[] => {
    return episodes.filter(episode => episode.animeId === animeId)
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  };

  // Watch progress
  const updateWatchProgress = (animeId: string, episodeId: number, progress: number) => {
    setWatchProgress(prev => {
      const existing = prev.find(p => p.animeId === animeId && p.episodeId === episodeId);
      if (existing) {
        return prev.map(p => 
          p.animeId === animeId && p.episodeId === episodeId
            ? { ...p, progress, lastWatched: new Date().toISOString() }
            : p
        );
      } else {
        return [...prev, {
          animeId,
          episodeId,
          progress,
          lastWatched: new Date().toISOString()
        }];
      }
    });
  };

  const getUserProgress = (userId: string): WatchProgress[] => {
    return watchProgress.filter(p => p.animeId.includes(userId));
  };

  // User lists
  const addToList = (userId: string, animeId: string, type: UserList['type']) => {
    const listItem: UserList = {
      userId,
      animeId,
      type,
      addedAt: new Date().toISOString()
    };
    setUserLists(prev => [...prev.filter(item => 
      !(item.userId === userId && item.animeId === animeId && item.type === type)
    ), listItem]);
  };

  const removeFromList = (userId: string, animeId: string, type: UserList['type']) => {
    setUserLists(prev => prev.filter(item => 
      !(item.userId === userId && item.animeId === animeId && item.type === type)
    ));
  };

  const getUserList = (userId: string, type: UserList['type']): string[] => {
    return userLists
      .filter(item => item.userId === userId && item.type === type)
      .map(item => item.animeId);
  };

  // Notifications
  const addNotification = (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => {
    const newNotification: AdminNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: AnimeStoreContextType = {
    animes,
    episodes,
    addAnime,
    updateAnime,
    deleteAnime,
    getAnimeById,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    getEpisodesByAnimeId,
    watchProgress,
    updateWatchProgress,
    getUserProgress,
    userLists,
    addToList,
    removeFromList,
    getUserList,
    notifications,
    addNotification,
    markNotificationRead,
    clearNotifications
  };

  return (
    <AnimeStoreContext.Provider value={value}>
      {children}
    </AnimeStoreContext.Provider>
  );
}

export function useAnimeStore() {
  const context = useContext(AnimeStoreContext);
  if (context === undefined) {
    throw new Error('useAnimeStore must be used within an AnimeStoreProvider');
  }
  return context;
}
