import { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Users, BarChart3, Settings, 
  Upload, Play, Eye, Calendar, Star, Clock, Video,
  Save, X, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Header from "@/components/Header";
import { useAnimeStore } from "@/lib/animeStore";
import type { AnimeData } from "@/lib/animeStore";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

interface NewAnime {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  year: number;
  episodes: number;
  genre: string[];
  genreEn: string[];
  rating: number;
  duration: string;
  poster: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  category: 'anime' | 'movie';
}

interface NewEpisode {
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

export default function Admin() {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const {
    animes,
    addAnime: storeAddAnime,
    updateAnime: storeUpdateAnime,
    deleteAnime: storeDeleteAnime,
    episodes,
    addEpisode: storeAddEpisode,
    getEpisodesByAnimeId,
    notifications,
    addNotification
  } = useAnimeStore();

  const [selectedAnime, setSelectedAnime] = useState<string | null>(null);
  const [editingAnime, setEditingAnime] = useState<string | null>(null);
  const [showAddAnime, setShowAddAnime] = useState(false);
  const [showAddEpisode, setShowAddEpisode] = useState(false);
  const [expandedAnimes, setExpandedAnimes] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [newAnime, setNewAnime] = useState<NewAnime>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    year: new Date().getFullYear(),
    episodes: 1,
    genre: [],
    genreEn: [],
    rating: 0,
    duration: "24min",
    poster: "",
    status: "ongoing",
    category: "anime"
  });

  const [editAnime, setEditAnime] = useState<AnimeData | null>(null);

  const [newEpisode, setNewEpisode] = useState<NewEpisode>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    videoUrl: "",
    duration: "24min",
    episodeNumber: 1,
    airDate: new Date().toISOString().split('T')[0],
    animeId: ""
  });

  const availableGenres = [
    { tr: "Aksiyon", en: "Action" },
    { tr: "Macera", en: "Adventure" },
    { tr: "Komedi", en: "Comedy" },
    { tr: "Drama", en: "Drama" },
    { tr: "Fantastik", en: "Fantasy" },
    { tr: "Korku", en: "Horror" },
    { tr: "Romantik", en: "Romance" },
    { tr: "Bilim Kurgu", en: "Sci-Fi" },
    { tr: "Gerilim", en: "Thriller" },
    { tr: "Spor", en: "Sports" },
    { tr: "Müzikal", en: "Musical" },
    { tr: "Okul", en: "School" },
    { tr: "Doğaüstü", en: "Supernatural" },
    { tr: "Psikolojik", en: "Psychological" },
    { tr: "Tarihi", en: "Historical" },
    { tr: "Askeri", en: "Military" }
  ];

  // Auto-refresh data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate real-time data updates
      setAnimes(prev => [...prev]);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Mock statistics with real-time updates
  const stats = {
    totalAnimes: animes.length,
    totalEpisodes: animes.reduce((sum, anime) => sum + anime.episodes, 0),
    totalUsers: 1247 + Math.floor(Math.random() * 10), // Simulate user growth
    totalViews: 89432 + Math.floor(Math.random() * 100),
    newUsersToday: 23 + Math.floor(Math.random() * 5),
    watchTimeToday: `${2456 + Math.floor(Math.random() * 100)} saat`,
    lastUpdate: lastUpdate.toLocaleTimeString('tr-TR')
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-anime-dark">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Yetkisiz Erişim</h1>
            <p className="text-gray-400 mb-6">Bu sayfaya erişim yetkiniz yok.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Ana Sayfaya Git
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddAnime = () => {
    if (!newAnime.title || !newAnime.titleEn || !newAnime.description || !newAnime.descriptionEn) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const animeData = {
      title: newAnime.title,
      titleEn: newAnime.titleEn,
      poster: newAnime.poster || "https://via.placeholder.com/400x600",
      rating: newAnime.rating,
      year: newAnime.year,
      episodes: newAnime.episodes,
      genre: newAnime.genre,
      genreEn: newAnime.genreEn,
      duration: newAnime.duration,
      description: newAnime.description,
      descriptionEn: newAnime.descriptionEn,
      status: newAnime.status,
      category: newAnime.category
    };

    storeAddAnime(animeData);
    setNewAnime({
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      year: new Date().getFullYear(),
      episodes: 1,
      genre: [],
      genreEn: [],
      rating: 0,
      duration: "24min",
      poster: "",
      status: "ongoing",
      category: "anime"
    });
    setShowAddAnime(false);

    toast({
      title: "Başarılı",
      description: "Anime başarıyla eklendi!",
    });
  };

  const handleEditAnime = (anime: AnimeData) => {
    setEditAnime(anime);
    setEditingAnime(anime.id);
  };

  const handleSaveEdit = () => {
    if (!editAnime) return;

    storeUpdateAnime(editAnime.id, editAnime);
    setEditingAnime(null);
    setEditAnime(null);

    toast({
      title: "Başarılı",
      description: "Anime başarıyla güncellendi!",
    });
  };

  const handleCancelEdit = () => {
    setEditingAnime(null);
    setEditAnime(null);
  };

  const handleDeleteAnime = (id: string) => {
    storeDeleteAnime(id);
    toast({
      title: "Başarılı",
      description: "Anime silindi!",
    });
  };

  const handleGenreChange = (genre: { tr: string; en: string }, isNew = true) => {
    const target = isNew ? newAnime : editAnime;
    const setter = isNew ? setNewAnime : setEditAnime;

    if (!target || !setter) return;

    if (target.genre.includes(genre.tr)) {
      setter({
        ...target,
        genre: target.genre.filter(g => g !== genre.tr),
        genreEn: target.genreEn.filter(g => g !== genre.en)
      });
    } else {
      setter({
        ...target,
        genre: [...target.genre, genre.tr],
        genreEn: [...target.genreEn, genre.en]
      });
    }
  };

  const handleAddEpisode = () => {
    if (!selectedAnime || !newEpisode.title || !newEpisode.titleEn) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const existingEpisodes = getEpisodesByAnimeId(selectedAnime);
    const episodeData = {
      ...newEpisode,
      animeId: selectedAnime,
      episodeNumber: existingEpisodes.length + 1
    };

    storeAddEpisode(episodeData);

    setNewEpisode({
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      videoUrl: "",
      duration: "24min",
      episodeNumber: 1,
      airDate: new Date().toISOString().split('T')[0],
      animeId: ""
    });
    setShowAddEpisode(false);

    toast({
      title: "Başarılı",
      description: "Bölüm başarıyla eklendi!",
    });
  };

  const toggleExpanded = (animeId: string) => {
    setExpandedAnimes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(animeId)) {
        newSet.delete(animeId);
      } else {
        newSet.add(animeId);
      }
      return newSet;
    });
  };

  const refreshData = () => {
    setLastUpdate(new Date());
    toast({
      title: "Güncellendi",
      description: "Veriler başarıyla güncellendi!",
    });
  };

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">{t.adminPanel}</h1>
              <p className="text-gray-400">Hoş geldiniz, {user?.username}</p>
              <p className="text-xs text-gray-500 mt-1">Son güncelleme: {stats.lastUpdate}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Yenile
              </Button>
              <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50">
                Admin
              </Badge>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-anime-card border border-white/10">
              <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="animes" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                <Play className="h-4 w-4 mr-2" />
                Anime Yönetimi
              </TabsTrigger>
              <TabsTrigger value="users" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" />
                Kullanıcılar
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-anime-card p-6 rounded-lg border border-white/10 hover:border-neon-blue/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Toplam Anime</p>
                      <p className="text-2xl font-bold text-white">{stats.totalAnimes}</p>
                    </div>
                    <Play className="h-8 w-8 text-neon-blue" />
                  </div>
                </div>
                <div className="bg-anime-card p-6 rounded-lg border border-white/10 hover:border-neon-purple/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Toplam Bölüm</p>
                      <p className="text-2xl font-bold text-white">{stats.totalEpisodes}</p>
                    </div>
                    <Clock className="h-8 w-8 text-neon-purple" />
                  </div>
                </div>
                <div className="bg-anime-card p-6 rounded-lg border border-white/10 hover:border-neon-pink/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-neon-pink" />
                  </div>
                </div>
                <div className="bg-anime-card p-6 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Bugün İzleme</p>
                      <p className="text-2xl font-bold text-white">{stats.watchTimeToday}</p>
                    </div>
                    <Eye className="h-8 w-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Son Aktiviteler</h3>
                  <div className="space-y-3">
                    {[
                      `Yeni kullanıcı kaydı: otaku_${Math.floor(Math.random() * 1000)}`,
                      `${animes[Math.floor(Math.random() * animes.length)]?.title} - Bölüm ${Math.floor(Math.random() * 10) + 1} yüklendi`,
                      `${animes[Math.floor(Math.random() * animes.length)]?.title} puanı güncellendi: ${(Math.random() * 2 + 8).toFixed(1)}`,
                      `${Math.floor(Math.random() * 10) + 1} yeni yorum eklendi`
                    ].map((activity, index) => (
                      <div key={index} className="text-gray-300 text-sm border-b border-white/10 pb-2 last:border-b-0">
                        <span className="text-neon-blue text-xs mr-2">{new Date().toLocaleTimeString('tr-TR')}</span>
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Popüler Animeler</h3>
                  <div className="space-y-3">
                    {animes.slice(0, 4).map((anime) => (
                      <div key={anime.id} className="flex items-center space-x-3">
                        <img
                          src={anime.poster}
                          alt={anime.title}
                          className="w-10 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{language === 'en' ? anime.titleEn : anime.title}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-400 text-xs">{anime.rating}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 text-xs">{anime.episodes} bölüm</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Anime Management */}
            <TabsContent value="animes" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Anime Yönetimi</h2>
                <div className="flex space-x-2">
                  <Dialog open={showAddEpisode} onOpenChange={setShowAddEpisode}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-white/20 text-white hover:bg-white/10"
                        disabled={!selectedAnime}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Bölüm Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-anime-card border-white/10 text-white max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Yeni Bölüm Ekle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="episode-title">Bölüm Adı (Türkçe) *</Label>
                            <Input
                              id="episode-title"
                              value={newEpisode.title}
                              onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Bölüm başlığı"
                            />
                          </div>
                          <div>
                            <Label htmlFor="episode-title-en">Bölüm Adı (İngilizce) *</Label>
                            <Input
                              id="episode-title-en"
                              value={newEpisode.titleEn}
                              onChange={(e) => setNewEpisode({ ...newEpisode, titleEn: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Episode title"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="episode-desc">Açıklama (Türkçe)</Label>
                            <Textarea
                              id="episode-desc"
                              value={newEpisode.description}
                              onChange={(e) => setNewEpisode({ ...newEpisode, description: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Bölüm açıklaması"
                            />
                          </div>
                          <div>
                            <Label htmlFor="episode-desc-en">Açıklama (İngilizce)</Label>
                            <Textarea
                              id="episode-desc-en"
                              value={newEpisode.descriptionEn}
                              onChange={(e) => setNewEpisode({ ...newEpisode, descriptionEn: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Episode description"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="video-url">Video URL *</Label>
                            <Input
                              id="video-url"
                              value={newEpisode.videoUrl}
                              onChange={(e) => setNewEpisode({ ...newEpisode, videoUrl: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="https://example.com/video.mp4"
                            />
                          </div>
                          <div>
                            <Label htmlFor="episode-duration">Süre</Label>
                            <Input
                              id="episode-duration"
                              value={newEpisode.duration}
                              onChange={(e) => setNewEpisode({ ...newEpisode, duration: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="24min"
                            />
                          </div>
                          <div>
                            <Label htmlFor="air-date">Yayın Tarihi</Label>
                            <Input
                              id="air-date"
                              type="date"
                              value={newEpisode.airDate}
                              onChange={(e) => setNewEpisode({ ...newEpisode, airDate: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddEpisode(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            İptal
                          </Button>
                          <Button onClick={handleAddEpisode} className="btn-primary">
                            Bölüm Ekle
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showAddAnime} onOpenChange={setShowAddAnime}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Anime Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-anime-card border-white/10 text-white max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Yeni Anime Ekle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Anime Adı (Türkçe) *</Label>
                            <Input
                              id="title"
                              value={newAnime.title}
                              onChange={(e) => setNewAnime({ ...newAnime, title: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Anime adını girin"
                            />
                          </div>
                          <div>
                            <Label htmlFor="title-en">Anime Adı (İngilizce) *</Label>
                            <Input
                              id="title-en"
                              value={newAnime.titleEn}
                              onChange={(e) => setNewAnime({ ...newAnime, titleEn: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Enter anime title"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="description">Açıklama (Türkçe) *</Label>
                            <Textarea
                              id="description"
                              value={newAnime.description}
                              onChange={(e) => setNewAnime({ ...newAnime, description: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Anime açıklaması"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description-en">Açıklama (İngilizce) *</Label>
                            <Textarea
                              id="description-en"
                              value={newAnime.descriptionEn}
                              onChange={(e) => setNewAnime({ ...newAnime, descriptionEn: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="Anime description"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="year">Yıl</Label>
                            <Input
                              id="year"
                              type="number"
                              value={newAnime.year}
                              onChange={(e) => setNewAnime({ ...newAnime, year: parseInt(e.target.value) })}
                              className="bg-black/50 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="episodes">Bölüm Sayısı</Label>
                            <Input
                              id="episodes"
                              type="number"
                              value={newAnime.episodes}
                              onChange={(e) => setNewAnime({ ...newAnime, episodes: parseInt(e.target.value) })}
                              className="bg-black/50 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="rating">Puan (0-10)</Label>
                            <Input
                              id="rating"
                              type="number"
                              step="0.1"
                              min="0"
                              max="10"
                              value={newAnime.rating}
                              onChange={(e) => setNewAnime({ ...newAnime, rating: parseFloat(e.target.value) })}
                              className="bg-black/50 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Süre</Label>
                            <Input
                              id="duration"
                              value={newAnime.duration}
                              onChange={(e) => setNewAnime({ ...newAnime, duration: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="24min"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="poster">Poster URL</Label>
                            <Input
                              id="poster"
                              value={newAnime.poster}
                              onChange={(e) => setNewAnime({ ...newAnime, poster: e.target.value })}
                              className="bg-black/50 border-white/20 text-white"
                              placeholder="https://example.com/poster.jpg"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="status">Durum</Label>
                              <Select value={newAnime.status} onValueChange={(value: any) => setNewAnime({ ...newAnime, status: value })}>
                                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-anime-card border-white/10">
                                  <SelectItem value="ongoing" className="text-white">Devam Ediyor</SelectItem>
                                  <SelectItem value="completed" className="text-white">Tamamlandı</SelectItem>
                                  <SelectItem value="upcoming" className="text-white">Yakında</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="category">Kategori</Label>
                              <Select value={newAnime.category} onValueChange={(value: any) => setNewAnime({ ...newAnime, category: value })}>
                                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-anime-card border-white/10">
                                  <SelectItem value="anime" className="text-white">Anime</SelectItem>
                                  <SelectItem value="movie" className="text-white">Film</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Türler</Label>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {availableGenres.map((genre) => (
                              <Button
                                key={genre.tr}
                                type="button"
                                variant={newAnime.genre.includes(genre.tr) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleGenreChange(genre, true)}
                                className={newAnime.genre.includes(genre.tr) 
                                  ? "bg-neon-blue text-black" 
                                  : "border-white/20 text-white hover:bg-white/10"
                                }
                              >
                                {genre.tr}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddAnime(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            İptal
                          </Button>
                          <Button onClick={handleAddAnime} className="btn-primary">
                            Anime Ekle
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="grid gap-4">
                {animes.map((anime) => (
                  <div key={anime.id} className="bg-anime-card rounded-lg border border-white/10">
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={anime.poster}
                          alt={anime.title}
                          className="w-16 h-20 object-cover rounded cursor-pointer"
                          onClick={() => setSelectedAnime(selectedAnime === anime.id ? null : anime.id)}
                        />
                        <div className="flex-1">
                          {editingAnime === anime.id && editAnime ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={editAnime.title}
                                  onChange={(e) => setEditAnime({ ...editAnime, title: e.target.value })}
                                  className="bg-black/50 border-white/20 text-white text-sm"
                                  placeholder="Türkçe başlık"
                                />
                                <Input
                                  value={editAnime.titleEn}
                                  onChange={(e) => setEditAnime({ ...editAnime, titleEn: e.target.value })}
                                  className="bg-black/50 border-white/20 text-white text-sm"
                                  placeholder="English title"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  value={editAnime.year}
                                  onChange={(e) => setEditAnime({ ...editAnime, year: parseInt(e.target.value) })}
                                  className="bg-black/50 border-white/20 text-white text-sm w-20"
                                />
                                <Input
                                  type="number"
                                  value={editAnime.episodes}
                                  onChange={(e) => setEditAnime({ ...editAnime, episodes: parseInt(e.target.value) })}
                                  className="bg-black/50 border-white/20 text-white text-sm w-20"
                                />
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={editAnime.rating}
                                  onChange={(e) => setEditAnime({ ...editAnime, rating: parseFloat(e.target.value) })}
                                  className="bg-black/50 border-white/20 text-white text-sm w-20"
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-white font-bold">{language === 'en' ? anime.titleEn : anime.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{anime.year}</span>
                                <span>{anime.episodes} bölüm</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{anime.rating}</span>
                                </div>
                                <Badge variant="outline" className={`text-xs ${
                                  anime.status === 'ongoing' ? 'border-green-500 text-green-400' :
                                  anime.status === 'completed' ? 'border-blue-500 text-blue-400' :
                                  'border-yellow-500 text-yellow-400'
                                }`}>
                                  {anime.status === 'ongoing' ? 'Devam Ediyor' : 
                                   anime.status === 'completed' ? 'Tamamlandı' : 'Yakında'}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {(language === 'en' ? anime.genreEn : anime.genre).slice(0, 3).map((genre) => (
                                  <Badge key={genre} variant="outline" className="border-white/30 text-gray-300 text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {editingAnime === anime.id ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleSaveEdit}
                                className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCancelEdit}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditAnime(anime)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDeleteAnime(anime.id)}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Collapsible 
                                open={expandedAnimes.has(anime.id)} 
                                onOpenChange={() => toggleExpanded(anime.id)}
                              >
                                <CollapsibleTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    {expandedAnimes.has(anime.id) ? 
                                      <ChevronUp className="h-4 w-4" /> : 
                                      <ChevronDown className="h-4 w-4" />
                                    }
                                  </Button>
                                </CollapsibleTrigger>
                              </Collapsible>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Collapsible open={expandedAnimes.has(anime.id)}>
                      <CollapsibleContent className="border-t border-white/10 p-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Açıklama</h4>
                            <p className="text-gray-300 text-sm">
                              {language === 'en' ? anime.descriptionEn : anime.description}
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-semibold">
                                Bölümler ({animeEpisodes[anime.id]?.length || 0})
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAnime(anime.id);
                                  setShowAddEpisode(true);
                                }}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Bölüm Ekle
                              </Button>
                            </div>
                            
                            {animeEpisodes[anime.id]?.length ? (
                              <div className="grid gap-2">
                                {animeEpisodes[anime.id].map((episode) => (
                                  <div key={episode.id} className="bg-black/30 p-3 rounded border border-white/10">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h5 className="text-white font-medium text-sm">
                                          Bölüm {episode.episodeNumber}: {language === 'en' ? episode.titleEn : episode.title}
                                        </h5>
                                        <p className="text-gray-400 text-xs">
                                          {episode.duration} • {new Date(episode.airDate).toLocaleDateString('tr-TR')}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="border-white/20 text-white hover:bg-white/10 h-6 w-6 p-0"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-6 w-6 p-0"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm italic">Henüz bölüm eklenmemiş</p>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users" className="mt-6">
              <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Kullanıcı Yönetimi</h2>
                <p className="text-gray-400 mb-4">
                  Kullanıcı yönetimi özellikleri yakında eklenecek. Burada kullanıcıları görüntüleyebilir, 
                  yönetebilir ve istatistiklerini inceleyebilirsiniz.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
                    <h3 className="text-neon-blue font-semibold mb-2">Aktif Kullanıcılar</h3>
                    <p className="text-neon-blue text-sm">
                      💡 Gelecek özellikler: Online kullanıcı listesi, aktivite izleme
                    </p>
                  </div>
                  <div className="p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-lg">
                    <h3 className="text-neon-purple font-semibold mb-2">Kullanıcı Yönetimi</h3>
                    <p className="text-neon-purple text-sm">
                      🔧 Gelecek özellikler: Yasaklama, yetki verme, profil düzenleme
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="mt-6">
              <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Sistem Ayarları</h2>
                <p className="text-gray-400 mb-4">
                  Site ayarları, güvenlik seçenekleri ve sistem konfigürasyonu burada yönetilecek.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-neon-pink/10 border border-neon-pink/20 rounded-lg">
                    <h3 className="text-neon-pink font-semibold mb-2">Site Ayarları</h3>
                    <p className="text-neon-pink text-sm">
                      ⚙️ Gelecek özellikler: Genel ayarlar, tema seçenekleri, dil ayarları
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                    <h3 className="text-yellow-400 font-semibold mb-2">Güvenlik</h3>
                    <p className="text-yellow-400 text-sm">
                      🔒 Gelecek özellikler: Güvenlik ayarları, backup yönetimi, API ayarları
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
