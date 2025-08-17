import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(onComplete, 500);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    (
        <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center">
            {/* Main Logo */}
            <div className="mb-8 animate-pulse-glow">
              <div className="relative flex items-center justify-center">
                {/* Glow effect */}
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-60 animate-pulse-color" />

                {/* Logo Image */}
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F9429ade95d6d46d2b6c25d61897ecb74%2F6f7ee262ff5a4c2996d49af22cbd1997?format=webp&width=800"
                  alt="Animewa"
                  className="relative z-10 w-64 h-32 md:w-96 md:h-48 object-contain animate-float"
                />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-xl md:text-2xl mb-12 font-light animate-fade-in-delayed">
              Ultimate Anime Streaming Experience
            </p>

            {/* Loading Bar */}
            <div className="w-96 max-w-full mx-auto animate-fade-in-delayed-2">
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />

                {/* Shimmer effect */}
                <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>

              {/* Loading percentage */}
              <p className="text-center text-neon-blue text-sm mt-3 font-medium animate-pulse">
                {Math.round(progress)}%
              </p>
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-neon-blue rounded-full animate-float-particles"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                  }}
                />
              ))}
            </div>

            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-neon-blue/20 rounded-full w-48 h-48 animate-pulse-rings"
                  style={{
                    animationDelay: `${i * 1}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
    )
  );
}
