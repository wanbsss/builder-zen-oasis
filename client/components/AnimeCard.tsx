import { useState } from "react";
import { Play, Plus, Star, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: number;
  episodes: number;
  genre: string[];
  duration?: string;
  isInWatchlist?: boolean;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  progress?: number;
}

export default function AnimeCard({
  id,
  title,
  poster,
  rating,
  year,
  episodes,
  genre,
  duration = "24min",
  isInWatchlist = false,
  size = "md",
  showProgress = false,
  progress = 0,
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const sizeClasses = {
    sm: "w-48 h-72",
    md: "w-56 h-80",
    lg: "w-64 h-96",
  };

  const handleWatchClick = () => {
    // Navigate to anime details/watch page
    window.location.href = `/anime/${id}`;
  };

  const handleWatchlistToggle = () => {
    // Add to watchlist logic
    console.log("Toggle watchlist for", id);
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div
      className={`anime-card group cursor-pointer ${sizeClasses[size]} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleWatchClick}
    >
      {/* Poster Image */}
      <div className="relative h-full overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/70 text-neon-blue border-neon-blue/30 flex items-center gap-1">
            <Star className="h-3 w-3 fill-neon-blue" />
            {rating.toFixed(1)}
          </Badge>
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            {year}
          </Badge>
        </div>

        {/* Progress Bar (if watching) */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
            <div
              className="h-full bg-neon-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300">
            <div className="text-center space-y-4" onClick={(e) => e.stopPropagation()}>
              <Button
                size="lg"
                className="btn-primary"
                onClick={handleWatchClick}
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Now
              </Button>
              
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWatchlistToggle}
                  className="text-white hover:text-neon-blue"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeToggle}
                  className={`${
                    isLiked 
                      ? "text-red-500 hover:text-red-400" 
                      : "text-white hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-neon-blue transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{episodes} eps</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {genre.slice(0, 2).map((g) => (
              <Badge
                key={g}
                variant="outline"
                className="text-xs border-white/30 text-gray-300"
              >
                {g}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Collection of real anime data for demo
export const sampleAnimes = [
  {
    id: "1",
    title: "Attack on Titan",
    poster: "https://img1.ak.crunchyroll.com/i/spire1/0662fbc7fb13e2ea5d6eac2c9edd68161682580325_full.jpg",
    rating: 9.0,
    year: 2013,
    episodes: 87,
    genre: ["Action", "Drama", "Fantasy"],
    duration: "24min",
  },
  {
    id: "2",
    title: "Demon Slayer",
    poster: "https://img1.ak.crunchyroll.com/i/spire2/e3d2d37c72de9ce7e7c86c3e7a14a6b21642435618_full.jpg",
    rating: 8.7,
    year: 2019,
    episodes: 44,
    genre: ["Action", "Supernatural"],
    duration: "23min",
  },
  {
    id: "3",
    title: "Jujutsu Kaisen",
    poster: "https://img1.ak.crunchyroll.com/i/spire1/6b5fe4d6b19abb60a7ce0e7bf9e8d3401623197089_full.jpg",
    rating: 8.6,
    year: 2020,
    episodes: 24,
    genre: ["Action", "School", "Supernatural"],
    duration: "23min",
  },
  {
    id: "4",
    title: "One Piece",
    poster: "https://img1.ak.crunchyroll.com/i/spire4/0c15567258baeed696e50c424b3e1e501623197764_full.jpg",
    rating: 9.1,
    year: 1999,
    episodes: 1000,
    genre: ["Adventure", "Comedy", "Shonen"],
    duration: "24min",
  },
  {
    id: "5",
    title: "Naruto Shippuden",
    poster: "https://img1.ak.crunchyroll.com/i/spire4/c5c4e2ae7eaa725ad01ffe62b8d5b4c61568141499_full.jpg",
    rating: 8.8,
    year: 2007,
    episodes: 500,
    genre: ["Action", "Martial Arts", "Shonen"],
    duration: "23min",
  },
  {
    id: "6",
    title: "My Hero Academia",
    poster: "https://img1.ak.crunchyroll.com/i/spire3/8d56c8cd75fef3c20b72d1dd02527b7f1624295651_full.jpg",
    rating: 8.5,
    year: 2016,
    episodes: 138,
    genre: ["Action", "School", "Superhero"],
    duration: "24min",
  },
  {
    id: "7",
    title: "Chainsaw Man",
    poster: "https://img1.ak.crunchyroll.com/i/spire2/d1b5df4fccdb54bc68f8a298d66bc24f1667920870_full.jpg",
    rating: 8.4,
    year: 2022,
    episodes: 12,
    genre: ["Action", "Horror", "Supernatural"],
    duration: "24min",
  },
  {
    id: "8",
    title: "Mob Psycho 100",
    poster: "https://img1.ak.crunchyroll.com/i/spire3/3f5a7f7bb5c86e15badd7c58c7e221dc1659019509_full.jpg",
    rating: 8.9,
    year: 2016,
    episodes: 37,
    genre: ["Comedy", "Supernatural", "Action"],
    duration: "24min",
  },
  {
    id: "9",
    title: "One Punch Man",
    poster: "https://img1.ak.crunchyroll.com/i/spire4/e70b13e5506d4c2bb7b31b32c0c85c261624295675_full.jpg",
    rating: 8.8,
    year: 2015,
    episodes: 24,
    genre: ["Action", "Comedy", "Superhero"],
    duration: "24min",
  },
  {
    id: "10",
    title: "Death Note",
    poster: "https://img1.ak.crunchyroll.com/i/spire3/13c4c3046c8c1c9e2c8ece0cfc86dc301568138999_full.jpg",
    rating: 9.0,
    year: 2006,
    episodes: 37,
    genre: ["Thriller", "Supernatural", "Psychological"],
    duration: "23min",
  },
];
