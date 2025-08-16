import { useState, useEffect } from "react";
import { Play, Info, ChevronLeft, ChevronRight, TrendingUp, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import AnimeCard, { sampleAnimes } from "@/components/AnimeCard";
import AuthModal from "@/components/AuthModal";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Index() {
  const [currentHero, setCurrentHero] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Featured anime for hero section
  const featuredAnimes = [
    {
      id: "hero-1",
      title: "Attack on Titan Final Season",
      description: "İnsanlığın titanlara karşı son duruşu. Duvarların arkasındaki gerçek, bu efsanevi serinin destansı finalinde sonunda ortaya çıkıyor.",
      poster: "https://wallpaperaccess.com/full/1088163.jpg",
      rating: 9.0,
      year: 2023,
      genres: ["Aksiyon", "Drama", "Fantastik"],
      episodes: 87,
      duration: "24dk",
    },
    {
      id: "hero-2", 
      title: "Jujutsu Kaisen Shibuya Arc",
      description: "Şimdiye kadarki en yoğun bölüm. Yuji ve arkadaşlarının Cadılar Bayramı gecesi Shibuya'nın kalbinde karşılaştıkları en büyük meydan okumayı takip edin.",
      poster: "https://wallpaperaccess.com/full/2792930.jpg",
      rating: 8.9,
      year: 2023,
      genres: ["Aksiyon", "Doğaüstü", "Okul"],
      episodes: 24,
      duration: "23dk",
    },
    {
      id: "hero-3",
      title: "Demon Slayer: Hashira Training Arc", 
      description: "Hashira'lar son savaşa hazırlanıyor. Bu heyecan verici bölümde yoğun antrenman sahneleri ve karakter gelişimi izleyin.",
      poster: "https://wallpaperaccess.com/full/2532191.jpg",
      rating: 8.8,
      year: 2024,
      genres: ["Aksiyon", "Tarihi", "Doğaüstü"],
      episodes: 11,
      duration: "23dk",
    },
  ];

  // Auto-rotate hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % featuredAnimes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredAnimes.length]);

  const currentFeature = featuredAnimes[currentHero];

  const nextHero = () => {
    setCurrentHero((prev) => (prev + 1) % featuredAnimes.length);
  };

  const prevHero = () => {
    setCurrentHero((prev) => (prev - 1 + featuredAnimes.length) % featuredAnimes.length);
  };

  // Sample data for different sections
  const trendingAnimes = sampleAnimes.slice(0, 6);
  const newReleases = sampleAnimes.slice(3, 9);
  const topRated = sampleAnimes.filter(anime => anime.rating >= 8.5);
  const continueWatching = sampleAnimes.slice(0, 4).map(anime => ({
    ...anime,
    progress: Math.floor(Math.random() * 80) + 10,
  }));

  const handleWatchClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to watch page
  };

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header onAuthClick={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={currentFeature.poster}
            alt={currentFeature.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6 animate-slide-up">
            <div className="flex items-center space-x-4 mb-4">
              <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50">
                {t.featured}
              </Badge>
              <div className="flex items-center space-x-2 text-gray-300">
                <Star className="h-4 w-4 fill-neon-blue text-neon-blue" />
                <span className="font-semibold">{currentFeature.rating}</span>
                <span>•</span>
                <span>{currentFeature.year}</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{currentFeature.episodes} {t.episodes}</span>
              </div>
            </div>

            <h1 className="hero-text">
              {currentFeature.title}
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
              {currentFeature.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {currentFeature.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="border-white/30 text-gray-300">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                size="lg" 
                className="btn-primary"
                onClick={handleWatchClick}
              >
                <Play className="h-5 w-5 mr-2" />
                {t.watchNow}
              </Button>
              <Button size="lg" className="btn-secondary">
                <Info className="h-5 w-5 mr-2" />
                {t.moreInfo}
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center space-x-2">
            {featuredAnimes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentHero
                    ? "bg-neon-blue shadow-neon-blue"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevHero}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextHero}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Continue Watching - Only show for authenticated users */}
        {isAuthenticated && (
          <section>
            <h2 className="section-title flex items-center">
              <Clock className="h-8 w-8 mr-3 text-neon-blue" />
              {t.continueWatching}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {continueWatching.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  {...anime}
                  size="sm"
                  showProgress={true}
                  progress={anime.progress}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending Now */}
        <section>
          <h2 className="section-title flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-neon-purple" />
            {t.trendingNow}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trendingAnimes.map((anime) => (
              <AnimeCard key={anime.id} {...anime} size="md" />
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section>
          <h2 className="section-title flex items-center">
            <span className="w-8 h-8 mr-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded flex items-center justify-center text-black font-bold">
              Y
            </span>
            {t.newReleases}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {newReleases.map((anime) => (
              <AnimeCard key={anime.id} {...anime} size="md" />
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section>
          <h2 className="section-title flex items-center">
            <Star className="h-8 w-8 mr-3 text-yellow-400 fill-current" />
            {t.topRated}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topRated.map((anime) => (
              <AnimeCard key={anime.id} {...anime} size="md" />
            ))}
          </div>
        </section>

        {/* Login Prompt for Unauthenticated Users */}
        {!isAuthenticated && (
          <section className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">
                {t.mustLoginToWatch}
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Binlerce anime ve film için giriş yapın. Kaldığınız yerden devam edin, favorilerinizi kaydedin.
              </p>
              <Button 
                size="lg" 
                className="btn-primary text-xl px-8 py-4"
                onClick={() => setShowAuthModal(true)}
              >
                {t.signIn}
              </Button>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold neon-text mb-4">Animewa</div>
              <p className="text-gray-400">
                Anime izleme deneyimi için en iyi destinasyon. Favori dizilerinizi HD kalitede izleyin.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t.browse}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.popular}</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.newReleases}</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.topRated}</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.genres}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t.support}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.helpCenter}</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.contactUs}</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.termsOfService}</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.privacyPolicy}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">{t.connect}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-blue transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Reddit</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">{t.newsletter}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Animewa. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}
