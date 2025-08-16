import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import AnimeCard, { sampleAnimes, getAnimeByCategory } from "@/components/AnimeCard";
import { useLanguage } from "@/lib/i18n";

export default function Browse() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");

  // Get category from URL parameters
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    // Update page title based on category
    const categoryTitles = {
      'anime': language === 'en' ? 'Anime Series' : 'Anime Serileri',
      'movie': language === 'en' ? 'Anime Movies' : 'Anime Filmleri',
      'trending': language === 'en' ? 'Trending Anime' : 'Trend Animeler',
      'all': language === 'en' ? 'All Anime' : 'Tüm Animeler'
    };
    document.title = `${categoryTitles[category as keyof typeof categoryTitles]} - Animewa`;
  }, [category, language]);

  const genres = language === 'en'
    ? ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sports"]
    : ["Aksiyon", "Macera", "Komedi", "Drama", "Fantastik", "Romantik", "Spor"];
  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];

  // Get base anime list based on category
  const baseAnimes = category === 'all' ? sampleAnimes : getAnimeByCategory(category as any);

  // Filter animes
  const filteredAnimes = baseAnimes.filter(anime => {
    const searchTitle = language === 'en' ? anime.titleEn : anime.title;
    const searchGenres = language === 'en' ? anime.genreEn : anime.genre;

    const matchesSearch = searchTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || searchGenres.some(g => g.includes(selectedGenre));
    const matchesYear = selectedYear === "all" || anime.year.toString() === selectedYear;

    return matchesSearch && matchesGenre && matchesYear;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "year":
        return b.year - a.year;
      case "title":
        const titleA = language === 'en' ? a.titleEn : a.title;
        const titleB = language === 'en' ? b.titleEn : b.title;
        return titleA.localeCompare(titleB);
      default:
        return 0;
    }
  });

  // Page title based on category
  const getPageTitle = () => {
    switch (category) {
      case 'anime':
        return language === 'en' ? 'Anime Series' : 'Anime Serileri';
      case 'movie':
        return language === 'en' ? 'Anime Movies' : 'Anime Filmleri';
      case 'trending':
        return language === 'en' ? 'Trending Anime' : 'Trend Animeler';
      default:
        return language === 'en' ? 'Browse Anime' : 'Anime Koleksiyonu';
    }
  };

  const getPageDescription = () => {
    switch (category) {
      case 'anime':
        return language === 'en'
          ? 'Discover amazing anime series with our vast collection.'
          : 'Geniş koleksiyonumuzla muhteşem anime serileri keşfedin.';
      case 'movie':
        return language === 'en'
          ? 'Watch the best anime movies in high quality.'
          : 'En iyi anime filmlerini yüksek kalitede izleyin.';
      case 'trending':
        return language === 'en'
          ? 'Currently popular and trending anime you should not miss.'
          : 'Şu anda popüler olan ve kaçırmamanız gereken trend animeler.';
      default:
        return language === 'en'
          ? 'Explore our vast anime collection with advanced filters and search capabilities.'
          : 'Geniş anime koleksiyonumuzu keşfedin. Filtreleme ve arama özellikleri ile aradığınızı kolayca bulun.';
    }
  };

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-gray-400 text-lg">
              {getPageDescription()}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-anime-card p-6 rounded-lg border border-white/10 mb-8">
            <div className="grid md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Anime ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                  <SelectValue placeholder="Tür" />
                </SelectTrigger>
                <SelectContent className="bg-anime-card border-white/10">
                  <SelectItem value="all" className="text-white">Tüm Türler</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre} className="text-white">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Filter */}
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                  <SelectValue placeholder="Yıl" />
                </SelectTrigger>
                <SelectContent className="bg-anime-card border-white/10">
                  <SelectItem value="all" className="text-white">Tüm Yıllar</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year} className="text-white">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent className="bg-anime-card border-white/10">
                  <SelectItem value="rating" className="text-white">Puana Göre</SelectItem>
                  <SelectItem value="year" className="text-white">Yıla Göre</SelectItem>
                  <SelectItem value="title" className="text-white">İsme Göre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-white">
                {filteredAnimes.length} anime bulundu
              </h2>
              {selectedGenre !== "all" && (
                <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50">
                  {selectedGenre}
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                  {selectedYear}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid"
                  ? "bg-neon-blue text-black"
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list"
                  ? "bg-neon-blue text-black"
                  : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          {filteredAnimes.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                : "grid-cols-1"
            }`}>
              {filteredAnimes.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  {...anime}
                  size={viewMode === "grid" ? "md" : "lg"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Aradığınız anime bulunamadı
              </h3>
              <p className="text-gray-400">
                Farklı filtreler deneyerek arama yapmayı deneyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
