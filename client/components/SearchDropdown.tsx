import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sampleAnimes } from "@/components/AnimeCard";
import { useLanguage } from "@/lib/i18n";

interface SearchDropdownProps {
  onClose?: () => void;
  className?: string;
}

export default function SearchDropdown({ onClose, className = "" }: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Filter anime based on search query
  const filteredAnimes = query.length > 0 
    ? sampleAnimes.filter(anime => {
        const title = language === 'en' ? anime.titleEn : anime.title;
        const genres = language === 'en' ? anime.genreEn : anime.genre;
        
        return title.toLowerCase().includes(query.toLowerCase()) ||
               genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()));
      }).slice(0, 8)
    : [];

  // Exact matches
  const exactMatches = filteredAnimes.filter(anime => {
    const title = language === 'en' ? anime.titleEn : anime.title;
    return title.toLowerCase().includes(query.toLowerCase());
  });

  // Similar/related anime (if no exact matches)
  const similarAnimes = exactMatches.length === 0 && query.length > 2
    ? sampleAnimes.filter(anime => {
        const genres = language === 'en' ? anime.genreEn : anime.genre;
        const title = language === 'en' ? anime.titleEn : anime.title;
        
        // Find anime with similar genres or partial title matches
        return genres.some(genre => 
          filteredAnimes.length > 0 && 
          filteredAnimes[0] && 
          (language === 'en' ? filteredAnimes[0].genreEn : filteredAnimes[0].genre).includes(genre)
        ) || title.toLowerCase().includes(query.slice(0, -1).toLowerCase());
      }).slice(0, 4)
    : [];

  const allResults = [...exactMatches, ...similarAnimes];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allResults[selectedIndex]) {
          handleAnimeSelect(allResults[selectedIndex]);
        } else if (query) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        onClose?.();
        break;
    }
  };

  const handleAnimeSelect = (anime: any) => {
    window.location.href = `/anime/${anime.id}`;
    setIsOpen(false);
    onClose?.();
  };

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/anime?search=${encodeURIComponent(query)}`;
      setIsOpen(false);
      onClose?.();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-neon-blue/30 text-neon-blue font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={language === 'en' ? "Search anime..." : "Anime ara..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-10 bg-black/50 border-white/20 text-white placeholder:text-gray-400 focus:border-neon-blue"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2 top-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-anime-card border border-white/10 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {allResults.length > 0 ? (
            <div className="p-2">
              {exactMatches.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {language === 'en' ? 'Found' : 'Bulunan'}
                  </div>
                  {exactMatches.map((anime, index) => {
                    const title = language === 'en' ? anime.titleEn : anime.title;
                    const genres = language === 'en' ? anime.genreEn : anime.genre;
                    
                    return (
                      <button
                        key={anime.id}
                        onClick={() => handleAnimeSelect(anime)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          index === selectedIndex
                            ? 'bg-neon-blue/20 border-neon-blue/50'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={anime.poster}
                            alt={title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">
                              {highlightMatch(title, query)}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-yellow-400 text-sm">★ {anime.rating}</span>
                              <span className="text-gray-400 text-sm">{anime.year}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {genres.slice(0, 2).map(genre => (
                                <span key={genre} className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {similarAnimes.length > 0 && exactMatches.length === 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {language === 'en' ? 'Similar Anime' : 'Benzer Animeler'}
                  </div>
                  {similarAnimes.map((anime, index) => {
                    const title = language === 'en' ? anime.titleEn : anime.title;
                    const genres = language === 'en' ? anime.genreEn : anime.genre;
                    const adjustedIndex = exactMatches.length + index;
                    
                    return (
                      <button
                        key={anime.id}
                        onClick={() => handleAnimeSelect(anime)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          adjustedIndex === selectedIndex
                            ? 'bg-neon-purple/20 border-neon-purple/50'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={anime.poster}
                            alt={title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-yellow-400 text-sm">★ {anime.rating}</span>
                              <span className="text-gray-400 text-sm">{anime.year}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {genres.slice(0, 2).map(genre => (
                                <span key={genre} className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Search All Results */}
              <div className="border-t border-white/10 mt-2 pt-2">
                <button
                  onClick={handleSearch}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedIndex === allResults.length 
                      ? 'bg-neon-blue/20 border-neon-blue/50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center">
                      <Search className="h-4 w-4 text-neon-blue" />
                    </div>
                    <span className="text-white">
                      {language === 'en' 
                        ? `Search for "${query}"` 
                        : `"${query}" için ara`}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white font-medium mb-2">
                {language === 'en' ? 'No anime found' : 'Anime bulunamadı'}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'en' 
                  ? `No results for "${query}". Try different keywords.`
                  : `"${query}" için sonuç bulunamadı. Farklı anahtar kelimeler deneyin.`}
              </p>
              <Button
                onClick={handleSearch}
                className="btn-primary text-sm"
              >
                {language === 'en' ? 'Search anyway' : 'Yine de ara'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
