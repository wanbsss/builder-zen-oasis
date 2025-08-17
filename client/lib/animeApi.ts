// Anime API Service for fetching real anime data
// This service can integrate with various anime databases

export interface ExternalAnimeData {
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  score?: number;
  episodes?: number;
  status?: string;
  aired?: {
    from?: string;
    to?: string;
  };
  genres?: Array<{ name: string }>;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
    webp?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
  duration?: string;
  rating?: string;
  year?: number;
  type?: string;
}

export interface SearchResult {
  data: ExternalAnimeData[];
  pagination?: {
    current_page: number;
    has_next_page: boolean;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

class AnimeApiService {
  private baseUrl = "https://api.jikan.moe/v4";
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private googleApiKey = ""; // Would need actual API key in production

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private getCacheKey(endpoint: string): string {
    return `anime_api_${endpoint}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async searchAnime(
    query: string,
    limit: number = 10,
  ): Promise<ExternalAnimeData[]> {
    const cacheKey = this.getCacheKey(`search_${query}_${limit}`);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/anime?q=${encodeURIComponent(query)}&limit=${limit}&order_by=score&sort=desc`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Animewa/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SearchResult = await response.json();
      this.setCache(cacheKey, result.data);

      // Add delay to respect rate limits
      await this.delay(1000);

      return result.data || [];
    } catch (error) {
      console.error("Error searching anime:", error);
      return [];
    }
  }

  async getAnimeById(id: number): Promise<ExternalAnimeData | null> {
    const cacheKey = this.getCacheKey(`anime_${id}`);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${this.baseUrl}/anime/${id}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Animewa/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.setCache(cacheKey, result.data);

      await this.delay(1000);

      return result.data;
    } catch (error) {
      console.error("Error fetching anime by ID:", error);
      return null;
    }
  }

  async getTopAnime(
    type: string = "anime",
    limit: number = 25,
  ): Promise<ExternalAnimeData[]> {
    const cacheKey = this.getCacheKey(`top_${type}_${limit}`);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/top/anime?type=${type}&limit=${limit}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Animewa/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SearchResult = await response.json();
      this.setCache(cacheKey, result.data);

      await this.delay(1000);

      return result.data || [];
    } catch (error) {
      console.error("Error fetching top anime:", error);
      return [];
    }
  }

  async getSeasonalAnime(
    year?: number,
    season?: string,
  ): Promise<ExternalAnimeData[]> {
    const currentYear = year || new Date().getFullYear();
    const currentSeason = season || this.getCurrentSeason();
    const cacheKey = this.getCacheKey(
      `seasonal_${currentYear}_${currentSeason}`,
    );
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/seasons/${currentYear}/${currentSeason}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Animewa/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SearchResult = await response.json();
      this.setCache(cacheKey, result.data);

      await this.delay(1000);

      return result.data || [];
    } catch (error) {
      console.error("Error fetching seasonal anime:", error);
      return [];
    }
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "fall";
    return "winter";
  }

  convertToAnimeData(
    external: ExternalAnimeData,
    customBanner?: string,
  ): {
    title: string;
    titleEn: string;
    poster: string;
    banner?: string;
    rating: number;
    year: number;
    episodes: number;
    genre: string[];
    genreEn: string[];
    duration: string;
    description: string;
    descriptionEn: string;
    status: "ongoing" | "completed" | "upcoming";
    category: "anime" | "movie";
  } {
    const poster =
      external.images?.jpg?.large_image_url ||
      external.images?.jpg?.image_url ||
      external.images?.webp?.large_image_url ||
      external.images?.webp?.image_url ||
      "https://via.placeholder.com/400x600";

    const genres = external.genres?.map((g) => g.name) || ["Action"];
    const genreTranslations: { [key: string]: string } = {
      Action: "Aksiyon",
      Adventure: "Macera",
      Comedy: "Komedi",
      Drama: "Drama",
      Fantasy: "Fantastik",
      Horror: "Korku",
      Romance: "Romantik",
      "Sci-Fi": "Bilim Kurgu",
      Thriller: "Gerilim",
      Sports: "Spor",
      Music: "Müzikal",
      School: "Okul",
      Supernatural: "Doğaüstü",
      Psychological: "Psikolojik",
      Historical: "Tarihi",
      Military: "Askeri",
    };

    const turkishGenres = genres.map(
      (genre) => genreTranslations[genre] || genre,
    );

    const getStatus = (): "ongoing" | "completed" | "upcoming" => {
      if (!external.status) return "upcoming";
      const status = external.status.toLowerCase();
      if (status.includes("airing") || status.includes("ongoing"))
        return "ongoing";
      if (status.includes("finished") || status.includes("completed"))
        return "completed";
      return "upcoming";
    };

    const getCategory = (): "anime" | "movie" => {
      return external.type?.toLowerCase() === "movie" ? "movie" : "anime";
    };

    const extractYear = (): number => {
      if (external.year) return external.year;
      if (external.aired?.from) {
        return new Date(external.aired.from).getFullYear();
      }
      return new Date().getFullYear();
    };

    const title = external.title || "Unknown Anime";
    const titleEn = external.title_english || external.title || title;
    const description =
      external.synopsis || `${title} hakkında açıklama yakında eklenecek.`;
    const descriptionEn =
      external.synopsis || `Description for ${titleEn} coming soon.`;

    const highQualityPoster = this.isValidUrl(poster)
      ? poster
      : "https://via.placeholder.com/400x600";
    const banner = customBanner || highQualityPoster;

    return {
      title,
      titleEn,
      poster: highQualityPoster,
      banner,
      rating: Math.round((external.score || 7.0) * 10) / 10,
      year: extractYear(),
      episodes: external.episodes || 12,
      genre: turkishGenres,
      genreEn: genres,
      duration: external.duration || "24min",
      description,
      descriptionEn,
      status: getStatus(),
      category: getCategory(),
    };
  }

  // Get popular anime suggestions
  async getPopularAnime(): Promise<ExternalAnimeData[]> {
    return this.getTopAnime("anime", 50);
  }

  // Get trending movies
  async getPopularMovies(): Promise<ExternalAnimeData[]> {
    return this.getTopAnime("movie", 25);
  }

  // Search with auto-complete suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const results = await this.searchAnime(query, 5);
      return results.map((anime) => anime.title).filter(Boolean);
    } catch (error) {
      console.error("Error getting search suggestions:", error);
      return [];
    }
  }

  // Batch import anime data
  async batchImportAnime(titles: string[]): Promise<any[]> {
    const results = [];

    for (const title of titles) {
      try {
        const searchResults = await this.searchAnime(title, 1);
        if (searchResults.length > 0) {
          const converted = this.convertToAnimeData(searchResults[0]);
          results.push(converted);
        }
        // Respect rate limits
        await this.delay(2000);
      } catch (error) {
        console.error(`Error importing ${title}:`, error);
      }
    }

    return results;
  }

  // Enhanced image quality detection
  isLowQualityImage(url: string): boolean {
    if (!url) return true;
    const lowQualityIndicators = [
      "placeholder",
      "via.placeholder",
      "example.com",
      "no-image",
      "default",
      "missing",
    ];
    return (
      lowQualityIndicators.some((indicator) =>
        url.toLowerCase().includes(indicator),
      ) ||
      url.includes("50x50") ||
      url.includes("100x100")
    );
  }

  // Search for high-quality banner images using Google Custom Search
  async searchBannerImage(animeTitle: string): Promise<string | null> {
    try {
      // This would use Google Custom Search API in production
      // For now, we'll return a constructed URL based on the anime
      const cleanTitle = animeTitle.replace(/[^a-zA-Z0-9\s]/g, "").trim();

      // Try to get banner from Jikan first
      const searchResults = await this.searchAnime(cleanTitle, 1);
      if (searchResults.length > 0) {
        const result = searchResults[0];
        // Use the large image as banner if available
        return (
          result.images?.jpg?.large_image_url ||
          result.images?.webp?.large_image_url ||
          result.images?.jpg?.image_url ||
          null
        );
      }

      return null;
    } catch (error) {
      console.error("Error searching for banner image:", error);
      return null;
    }
  }

  // Get the highest quality poster available
  async getHighQualityPoster(animeTitle: string): Promise<string | null> {
    try {
      const searchResults = await this.searchAnime(animeTitle, 3);

      for (const result of searchResults) {
        if (result.images?.jpg?.large_image_url) {
          return result.images.jpg.large_image_url;
        }
        if (result.images?.webp?.large_image_url) {
          return result.images.webp.large_image_url;
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting high quality poster:", error);
      return null;
    }
  }

  // Enhanced batch import with banner fetching
  async enhancedBatchImport(titles: string[]): Promise<any[]> {
    const results = [];

    for (const title of titles) {
      try {
        const searchResults = await this.searchAnime(title, 1);
        if (searchResults.length > 0) {
          // Get banner image
          const bannerUrl = await this.searchBannerImage(title);
          const converted = this.convertToAnimeData(
            searchResults[0],
            bannerUrl || undefined,
          );
          results.push(converted);
        }
        // Respect rate limits
        await this.delay(2000);
      } catch (error) {
        console.error(`Error importing ${title}:`, error);
      }
    }

    return results;
  }

  // Fix existing anime with missing or low quality images
  async enhanceAnimeImages(anime: {
    id: string;
    title: string;
    poster?: string;
    banner?: string;
  }) {
    let updated = false;
    const updates: any = {};

    // Check and fix poster
    if (!anime.poster || this.isLowQualityImage(anime.poster)) {
      const newPoster = await this.getHighQualityPoster(anime.title);
      if (newPoster) {
        updates.poster = newPoster;
        updated = true;
      }
    }

    // Check and fix banner
    if (!anime.banner || this.isLowQualityImage(anime.banner)) {
      const newBanner = await this.searchBannerImage(anime.title);
      if (newBanner) {
        updates.banner = newBanner;
        updated = true;
      }
    }

    return updated ? updates : null;
  }
}

export const animeApi = new AnimeApiService();
export default animeApi;
