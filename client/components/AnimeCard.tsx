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
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 9.0,
    year: 2013,
    episodes: 87,
    genre: ["Action", "Drama", "Fantasy"],
    duration: "24min",
  },
  {
    id: "2", 
    title: "Demon Slayer",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop",
    rating: 8.7,
    year: 2019,
    episodes: 44,
    genre: ["Action", "Supernatural"],
    duration: "23min",
  },
  {
    id: "3",
    title: "Jujutsu Kaisen", 
    poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop",
    rating: 8.6,
    year: 2020,
    episodes: 24,
    genre: ["Action", "School", "Supernatural"],
    duration: "23min",
  },
  {
    id: "4",
    title: "One Piece",
    poster: "https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=400&h=600&fit=crop",
    rating: 9.1,
    year: 1999,
    episodes: 1000,
    genre: ["Adventure", "Comedy", "Shonen"],
    duration: "24min",
  },
  {
    id: "5",
    title: "Naruto Shippuden",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 8.8,
    year: 2007,
    episodes: 500,
    genre: ["Action", "Martial Arts", "Shonen"],
    duration: "23min",
  },
  {
    id: "6",
    title: "My Hero Academia",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop",
    rating: 8.5,
    year: 2016,
    episodes: 138,
    genre: ["Action", "School", "Superhero"],
    duration: "24min",
  },
];
