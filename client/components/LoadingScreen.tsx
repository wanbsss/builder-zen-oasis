import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0: logo, 1: loading, 2: complete

  useEffect(() => {
    // Stage 1: Show logo for 2 seconds
    const logoTimer = setTimeout(() => {
      setStage(1);
    }, 2000);

    // Stage 2: Progress bar simulation
    const progressTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage(2);
            setTimeout(() => {
              setIsLoading(false);
              setTimeout(onComplete, 500);
            }, 800);
            return 100;
          }
          return prev + Math.random() * 12 + 3;
        });
      }, 100);
    }, 2200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(progressTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Netflix-style background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-neon-purple rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-pink rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative h-full flex items-center justify-center">
        <div className="text-center">
          {/* Logo Section */}
          <div
            className={`transition-all duration-1000 ${stage >= 1 ? "scale-75 -translate-y-12" : "scale-100"}`}
          >
            <div className="relative mb-8">
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-60 animate-pulse-glow" />

              {/* Main logo */}
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F9429ade95d6d46d2b6c25d61897ecb74%2F6f7ee262ff5a4c2996d49af22cbd1997?format=webp&width=800"
                alt="Aniwa"
                className={`relative z-10 object-contain transition-all duration-1000 ${
                  stage >= 1
                    ? "w-48 h-24 md:w-64 md:h-32"
                    : "w-64 h-32 md:w-96 md:h-48"
                } animate-float`}
              />
            </div>

            {/* Brand text */}
            <div
              className={`transition-all duration-1000 ${stage >= 1 ? "opacity-80 scale-90" : "opacity-100 scale-100"}`}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 netflix-title">
                ANIWA
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-light netflix-subtitle">
                Ultimate Anime Experience
              </p>
            </div>
          </div>

          {/* Loading Section */}
          {stage >= 1 && (
            <div className="mt-12 animate-fade-in">
              {/* Netflix-style loading bar */}
              <div className="w-80 max-w-full mx-auto mb-6">
                <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />

                  {/* Animated shimmer */}
                  <div
                    className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                    style={{ left: `${Math.max(0, progress - 12)}%` }}
                  />
                </div>
              </div>

              {/* Loading text */}
              <div className="space-y-3">
                <p className="text-red-500 text-sm font-medium animate-pulse">
                  {progress < 30
                    ? "Preparing your anime journey..."
                    : progress < 60
                      ? "Loading latest episodes..."
                      : progress < 90
                        ? "Almost ready..."
                        : "Welcome to Aniwa!"}
                </p>

                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Completion animation */}
          {stage >= 2 && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-red-500 text-lg font-medium">
                  Loading Complete!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-float-particles"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
