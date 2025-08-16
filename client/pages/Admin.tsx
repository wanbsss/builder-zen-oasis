import { useState } from "react";
import { 
  Plus, Edit, Trash2, Users, BarChart3, Settings, 
  Upload, Play, Eye, Calendar, Star, Clock
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
import Header from "@/components/Header";
import { sampleAnimes } from "@/components/AnimeCard";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

interface NewAnime {
  title: string;
  description: string;
  year: number;
  episodes: number;
  genre: string[];
  rating: number;
  duration: string;
  poster: string;
  status: 'ongoing' | 'completed' | 'upcoming';
}

interface Episode {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  episodeNumber: number;
}

export default function Admin() {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [animes, setAnimes] = useState(sampleAnimes);
  const [selectedAnime, setSelectedAnime] = useState<string | null>(null);
  const [showAddAnime, setShowAddAnime] = useState(false);
  const [showAddEpisode, setShowAddEpisode] = useState(false);
  
  const [newAnime, setNewAnime] = useState<NewAnime>({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    episodes: 1,
    genre: [],
    rating: 0,
    duration: "24min",
    poster: "",
    status: "ongoing"
  });

  const [newEpisode, setNewEpisode] = useState<Episode>({
    id: 1,
    title: "",
    description: "",
    videoUrl: "",
    duration: "24min",
    episodeNumber: 1
  });

  const availableGenres = [
    "Aksiyon", "Macera", "Komedi", "Drama", "Fantastik", "Korku", 
    "Romantik", "Bilim Kurgu", "Gerilim", "Spor", "Müzikal", "Okul",
    "Doğaüstü", "Psikolojik", "Tarih", "Askeri"
  ];

  // Mock statistics
  const stats = {
    totalAnimes: animes.length,
    totalEpisodes: animes.reduce((sum, anime) => sum + anime.episodes, 0),
    totalUsers: 1247,
    totalViews: 89432,
    newUsersToday: 23,
    watchTimeToday: "2,456 saat"
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
    if (!newAnime.title || !newAnime.description) {
      toast({
        title: "Hata",
        description: "Lütfen tüm zorunlu alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const anime = {
      id: (animes.length + 1).toString(),
      title: newAnime.title,
      poster: newAnime.poster || "https://via.placeholder.com/400x600",
      rating: newAnime.rating,
      year: newAnime.year,
      episodes: newAnime.episodes,
      genre: newAnime.genre,
      duration: newAnime.duration,
    };

    setAnimes([...animes, anime]);
    setNewAnime({
      title: "",
      description: "",
      year: new Date().getFullYear(),
      episodes: 1,
      genre: [],
      rating: 0,
      duration: "24min",
      poster: "",
      status: "ongoing"
    });
    setShowAddAnime(false);

    toast({
      title: "Başarılı",
      description: "Anime başarıyla eklendi!",
    });
  };

  const handleDeleteAnime = (id: string) => {
    setAnimes(animes.filter(anime => anime.id !== id));
    toast({
      title: "Başarılı",
      description: "Anime silindi!",
    });
  };

  const handleGenreChange = (genre: string) => {
    if (newAnime.genre.includes(genre)) {
      setNewAnime({
        ...newAnime,
        genre: newAnime.genre.filter(g => g !== genre)
      });
    } else {
      setNewAnime({
        ...newAnime,
        genre: [...newAnime.genre, genre]
      });
    }
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
            </div>
            <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50">
              Admin
            </Badge>
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
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Toplam Anime</p>
                      <p className="text-2xl font-bold text-white">{stats.totalAnimes}</p>
                    </div>
                    <Play className="h-8 w-8 text-neon-blue" />
                  </div>
                </div>
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Toplam Bölüm</p>
                      <p className="text-2xl font-bold text-white">{stats.totalEpisodes}</p>
                    </div>
                    <Clock className="h-8 w-8 text-neon-purple" />
                  </div>
                </div>
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-neon-pink" />
                  </div>
                </div>
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
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
                      "Yeni kullanıcı kaydı: otaku_2024",
                      "Attack on Titan - Bölüm 5 yüklendi",
                      "Demon Slayer puanı güncellendi: 8.9",
                      "3 yeni yorum eklendi"
                    ].map((activity, index) => (
                      <div key={index} className="text-gray-300 text-sm border-b border-white/10 pb-2 last:border-b-0">
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
                          <p className="text-white font-medium text-sm">{anime.title}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-400 text-xs">{anime.rating}</span>
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
                <Dialog open={showAddAnime} onOpenChange={setShowAddAnime}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Anime Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-anime-card border-white/10 text-white max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Yeni Anime Ekle</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Anime Adı *</Label>
                        <Input
                          id="title"
                          value={newAnime.title}
                          onChange={(e) => setNewAnime({ ...newAnime, title: e.target.value })}
                          className="bg-black/50 border-white/20 text-white"
                          placeholder="Anime adını girin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Açıklama *</Label>
                        <Textarea
                          id="description"
                          value={newAnime.description}
                          onChange={(e) => setNewAnime({ ...newAnime, description: e.target.value })}
                          className="bg-black/50 border-white/20 text-white"
                          placeholder="Anime açıklaması"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
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
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
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
                      <div>
                        <Label>Türler</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {availableGenres.map((genre) => (
                            <Button
                              key={genre}
                              type="button"
                              variant={newAnime.genre.includes(genre) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleGenreChange(genre)}
                              className={newAnime.genre.includes(genre) 
                                ? "bg-neon-blue text-black" 
                                : "border-white/20 text-white hover:bg-white/10"
                              }
                            >
                              {genre}
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

              <div className="grid gap-4">
                {animes.map((anime) => (
                  <div key={anime.id} className="bg-anime-card p-4 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-bold">{anime.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{anime.year}</span>
                          <span>{anime.episodes} bölüm</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{anime.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {anime.genre.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="outline" className="border-white/30 text-gray-300 text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users" className="mt-6">
              <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Kullanıcı Yönetimi</h2>
                <p className="text-gray-400">
                  Kullanıcı yönetimi özellikleri yakında eklenecek. Burada kullanıcıları görüntüleyebilir, 
                  yönetebilir ve istatistiklerini inceleyebilirsiniz.
                </p>
                <div className="mt-4 p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-lg">
                  <p className="text-neon-blue text-sm">
                    💡 Gelecek özellikler: Kullanıcı listesi, yasaklama, yetki verme, aktivite geçmişi
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="mt-6">
              <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Sistem Ayarları</h2>
                <p className="text-gray-400">
                  Site ayarları, güvenlik seçenekleri ve sistem konfigürasyonu burada yönetilecek.
                </p>
                <div className="mt-4 p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-lg">
                  <p className="text-neon-purple text-sm">
                    🔧 Gelecek özellikler: Site ayarları, güvenlik, backup, API ayarları
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
