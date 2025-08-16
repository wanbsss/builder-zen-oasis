import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Calendar, Play, Plus, Heart, Share, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import { sampleAnimes } from "@/components/AnimeCard";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function AnimeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Get anime data (in real app, this would be from API)
  const anime = sampleAnimes.find(a => a.id === id) || sampleAnimes[0];
  
  // Mock episode data
  const episodes = Array.from({ length: anime.episodes }, (_, i) => ({
    id: i + 1,
    title: `Bölüm ${i + 1}`,
    description: `${anime.title} - ${i + 1}. bölüm. Hikaye devam ediyor...`,
    duration: anime.duration,
    thumbnail: anime.poster,
    videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, // Demo video
  }));

  // Mock video URL for demo
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-anime-dark">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">
              {t.loginRequired}
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              {t.mustLoginToWatch}
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              {t.backToHome}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleNextEpisode = () => {
    if (currentEpisode < anime.episodes) {
      setCurrentEpisode(currentEpisode + 1);
    }
  };

  const handlePreviousEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
    }
  };

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />
      
      {showPlayer ? (
        /* Video Player */
        <div className="pt-16">
          <div className="container mx-auto px-4 py-4">
            <Button
              onClick={() => setShowPlayer(false)}
              className="btn-secondary mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anime Detaylarına Dön
            </Button>
            
            <VideoPlayer
              src={videoSrc}
              title={anime.title}
              episode={currentEpisode}
              poster={anime.poster}
              onNext={handleNextEpisode}
              onPrevious={handlePreviousEpisode}
              hasNext={currentEpisode < anime.episodes}
              hasPrevious={currentEpisode > 1}
            />

            {/* Episode Info */}
            <div className="mt-6 p-6 bg-anime-card rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">
                Bölüm {currentEpisode}: {episodes[currentEpisode - 1]?.title}
              </h3>
              <p className="text-gray-400">
                {episodes[currentEpisode - 1]?.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Anime Details */
        <div className="pt-16">
          {/* Hero Section */}
          <div className="relative h-96 overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-hero-gradient" />
            </div>
            
            <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-8">
              <div className="flex items-end space-x-6">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-32 h-48 object-cover rounded-lg border-2 border-white/20"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-4">{anime.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-neon-blue text-neon-blue" />
                      <span className="text-white font-semibold">{anime.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{anime.year}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{anime.episodes} {t.episodes}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genre.map((genre) => (
                      <Badge key={genre} variant="outline" className="border-white/30 text-gray-300">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button 
                      onClick={() => setShowPlayer(true)}
                      className="btn-primary"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {t.watchNow}
                    </Button>
                    <Button
                      onClick={() => setIsInWatchlist(!isInWatchlist)}
                      className={`btn-secondary ${isInWatchlist ? 'bg-neon-blue/20 border-neon-blue' : ''}`}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      {isInWatchlist ? 'Listeden Çıkar' : 'Listeme Ekle'}
                    </Button>
                    <Button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`btn-secondary ${isLiked ? 'text-red-500 border-red-500' : ''}`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      Beğen
                    </Button>
                    <Button className="btn-secondary">
                      <Share className="h-5 w-5 mr-2" />
                      Paylaş
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="episodes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-anime-card border border-white/10">
                <TabsTrigger value="episodes" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                  Bölümler
                </TabsTrigger>
                <TabsTrigger value="details" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                  Detaylar
                </TabsTrigger>
                <TabsTrigger value="comments" className="text-white data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                  Yorumlar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="episodes" className="mt-6">
                <div className="grid gap-4">
                  {episodes.slice(0, 12).map((episode) => (
                    <div
                      key={episode.id}
                      className="flex items-center space-x-4 p-4 bg-anime-card rounded-lg border border-white/10 hover:border-neon-blue/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setCurrentEpisode(episode.id);
                        setShowPlayer(true);
                      }}
                    >
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{episode.title}</h4>
                        <p className="text-gray-400 text-sm">{episode.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">{episode.duration}</span>
                        </div>
                      </div>
                      <Button size="sm" className="btn-primary">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Anime Hakkında</h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <strong className="text-white">Özet:</strong>
                      <p className="mt-2">
                        {anime.title} - Aksiyon dolu sahneler, derin karakter gelişimi ve sürükleyici hikayesi ile izleyicilerini 
                        ekran başından ayırmayan bir anime serisi. Her bölümde artan gerilim ve beklenmedik olaylar sizleri bekliyor.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong className="text-white">Yıl:</strong> {anime.year}
                      </div>
                      <div>
                        <strong className="text-white">Bölüm Sayısı:</strong> {anime.episodes}
                      </div>
                      <div>
                        <strong className="text-white">Süre:</strong> {anime.duration}
                      </div>
                      <div>
                        <strong className="text-white">Puan:</strong> {anime.rating}/10
                      </div>
                      <div>
                        <strong className="text-white">Türler:</strong> {anime.genre.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <div className="bg-anime-card p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Yorumlar</h3>
                  <div className="space-y-4">
                    {[
                      { user: "AnimeSevenXXX", comment: "Bu anime gerçekten muhteşem! Her bölümü sabırsızlıkla bekliyorum.", rating: 9 },
                      { user: "OtakuGirl92", comment: "Animasyon kalitesi çok iyi, hikaye çok sürükleyici. Kesinlikle tavsiye ederim.", rating: 10 },
                      { user: "MangaLover", comment: "Mangayı okumuştum, anime uyarlaması da çok başarılı olmuş.", rating: 8 },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-white/10 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-white">{review.user}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-white">{review.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
