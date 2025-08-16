import { useState, useEffect } from "react";
import { Play, Info, ChevronLeft, ChevronRight, TrendingUp, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import AnimeCard, { sampleAnimes } from "@/components/AnimeCard";
import AuthModal from "@/components/AuthModal";

export default function Index() {
  const [currentHero, setCurrentHero] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Featured anime for hero section
  const featuredAnimes = [
    {
      id: "hero-1",
      title: "Attack on Titan Final Season",
      description: "Humanity's last stand against the titans. The truth behind the walls is finally revealed in this epic conclusion to the legendary series.",
      poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
      rating: 9.0,
      year: 2023,
      genres: ["Action", "Drama", "Fantasy"],
      episodes: 87,
      duration: "24min",
    },
    {
      id: "hero-2", 
      title: "Jujutsu Kaisen Shibuya Arc",
      description: "The most intense arc yet. Follow Yuji and friends as they face their greatest challenge in the heart of Shibuya during Halloween night.",
      poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1920&h=1080&fit=crop",
      rating: 8.9,
      year: 2023,
      genres: ["Action", "Supernatural", "School"],
      episodes: 24,
      duration: "23min",
    },
    {
      id: "hero-3",
      title: "Demon Slayer: Hashira Training Arc", 
      description: "The Hashira prepare for the final battle. Witness intense training sequences and character development in this thrilling arc.",
      poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&h=1080&fit=crop",
      rating: 8.8,
      year: 2024,
      genres: ["Action", "Historical", "Supernatural"],
      episodes: 11,
      duration: "23min",
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
  const newReleases = sampleAnimes.slice(2, 8);
  const topRated = sampleAnimes.filter(anime => anime.rating >= 8.5);
  const continueWatching = sampleAnimes.slice(0, 4).map(anime => ({
    ...anime,
    progress: Math.floor(Math.random() * 80) + 10,
  }));

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
                Featured
              </Badge>
              <div className="flex items-center space-x-2 text-gray-300">
                <Star className="h-4 w-4 fill-neon-blue text-neon-blue" />
                <span className="font-semibold">{currentFeature.rating}</span>
                <span>•</span>
                <span>{currentFeature.year}</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{currentFeature.episodes} episodes</span>
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
              <Button size="lg" className="btn-primary">
                <Play className="h-5 w-5 mr-2" />
                Watch Now
              </Button>
              <Button size="lg" className="btn-secondary">
                <Info className="h-5 w-5 mr-2" />
                More Info
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
        {/* Continue Watching */}
        <section>
          <h2 className="section-title flex items-center">
            <Clock className="h-8 w-8 mr-3 text-neon-blue" />
            Continue Watching
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

        {/* Trending Now */}
        <section>
          <h2 className="section-title flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-neon-purple" />
            Trending Now
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
              N
            </span>
            New Releases
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
            Top Rated
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topRated.map((anime) => (
              <AnimeCard key={anime.id} {...anime} size="md" />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold neon-text mb-4">AnimeStream</div>
              <p className="text-gray-400">
                The ultimate destination for anime streaming. Watch your favorite shows in HD quality.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Browse</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-blue transition-colors">Popular</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">New Releases</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Top Rated</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Genres</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-blue transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-neon-blue transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Reddit</a></li>
                <li><a href="#" className="hover:text-neon-blue transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AnimeStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
