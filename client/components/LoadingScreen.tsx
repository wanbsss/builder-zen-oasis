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
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0"}`}
    >
      {/* Enhanced background with better gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Subtle animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

      {/* Improved background elements with better colors */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Perfect centering container */}
      <div className="absolute inset-0 flex items-center justify-center min-h-screen">
        <div className="text-center px-6 max-w-md w-full">
          {/* Logo Section */}
          <div
            className={`transition-all duration-1000 ${stage >= 1 ? "scale-90 -translate-y-8" : "scale-100"}`}
          >
            <div className="relative mb-8 flex justify-center">
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50 animate-pulse-glow" />

              {/* Main logo - properly centered */}
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F9429ade95d6d46d2b6c25d61897ecb74%2F6f7ee262ff5a4c2996d49af22cbd1997?format=webp&width=800"
                alt="Aniwa"
                className={`relative z-10 object-contain transition-all duration-1000 mx-auto ${
                  stage >= 1
                    ? "w-40 h-20 md:w-52 md:h-26"
                    : "w-48 h-24 md:w-72 md:h-36"
                } animate-float`}
              />
            </div>

            {/* Brand text */}
            <div
              className={`transition-all duration-1000 ${stage >= 1 ? "opacity-90 scale-95" : "opacity-100 scale-100"}`}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-wide">
                ANIWA
              </h1>
              <p className="text-gray-300 text-base md:text-lg font-light">
                Ultimate Anime Experience
              </p>
            </div>
          </div>

          {/* Loading Section */}
          {stage >= 1 && (
            <div className="mt-10 animate-fade-in">
              {/* Enhanced loading bar */}
              <div className="w-full max-w-xs mx-auto mb-6">
                <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />

                  {/* Enhanced shimmer */}
                  <div
                    className="absolute top-0 h-full w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                    style={{ left: `${Math.max(0, progress - 16)}%` }}
                  />
                </div>
              </div>

              {/* Loading text */}
              <div className="space-y-4">
                <p className="text-blue-400 text-sm font-medium animate-pulse">
                  {progress < 30
                    ? "Preparing your anime journey..."
                    : progress < 60
                      ? "Loading latest episodes..."
                      : progress < 90
                        ? "Almost ready..."
                        : "Welcome to Aniwa!"}
                </p>

                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
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
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
                <p className="text-blue-400 text-lg font-medium">
                  Loading Complete!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-float-particles"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
