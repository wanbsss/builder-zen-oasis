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

  const genres = ["Aksiyon", "Macera", "Komedi", "Drama", "Fantastik", "Romantik", "Spor"];
  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];

  // Filter animes
  const filteredAnimes = sampleAnimes.filter(anime => {
    const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || anime.genre.some(g => g.includes(selectedGenre));
    const matchesYear = selectedYear === "all" || anime.year.toString() === selectedYear;

    return matchesSearch && matchesGenre && matchesYear;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "year":
        return b.year - a.year;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-anime-dark">
      <Header />

      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Anime Koleksiyonu
            </h1>
            <p className="text-gray-400 text-lg">
              Geniş anime koleksiyonumuzu keşfedin. Filtreleme ve arama özellikleri ile aradığınızı kolayca bulun.
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
