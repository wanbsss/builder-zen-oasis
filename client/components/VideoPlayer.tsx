import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, SkipBack, SkipForward, RotateCcw, Clock,
  Heart, Share, Download, MessageSquare, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";

interface VideoPlayerProps {
  src: string;
  title: string;
  episode?: number;
  poster?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function VideoPlayer({ 
  src, 
  title, 
  episode = 1, 
  poster,
  onNext,
  onPrevious,
  hasNext = true,
  hasPrevious = false
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState("1080p");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const { t } = useLanguage();
  
  const hideControlsTimer = useRef<NodeJS.Timeout>();

  // Auto-hide controls
  useEffect(() => {
    const resetTimer = () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
      setShowControls(true);
      hideControlsTimer.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => resetTimer();
    const handleMouseLeave = () => {
      if (isPlaying) setShowControls(false);
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [isPlaying]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [volume]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const seek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-black group"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Center Play Button */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20 hover:border-neon-blue transition-all duration-300"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              {episode && (
                <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50">
                  Bölüm {episode}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`text-white hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-neon-blue">
                <Share className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-neon-blue">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={([value]) => seek(value)}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Skip Previous */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="text-white hover:text-neon-blue disabled:opacity-50"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              {/* Rewind */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                className="text-white hover:text-neon-blue"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>

              {/* Play/Pause */}
              <Button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-neon-blue hover:bg-neon-blue/80 text-black"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </Button>

              {/* Fast Forward */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                className="text-white hover:text-neon-blue"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Skip Next */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!hasNext}
                className="text-white hover:text-neon-blue disabled:opacity-50"
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Volume Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:text-neon-blue"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Time Display */}
              <div className="flex items-center space-x-1 text-white text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Settings */}
              <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-neon-blue"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-anime-card border-white/10">
                  <div className="p-2">
                    <div className="text-white text-sm font-medium mb-2">{t.speed}</div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                      <DropdownMenuItem
                        key={speed}
                        onClick={() => changePlaybackSpeed(speed)}
                        className={`text-white hover:bg-white/10 ${
                          playbackSpeed === speed ? 'bg-white/10' : ''
                        }`}
                      >
                        {speed}x
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="border-t border-white/10 p-2">
                    <div className="text-white text-sm font-medium mb-2">{t.quality}</div>
                    {['1080p', '720p', '480p', '360p'].map((q) => (
                      <DropdownMenuItem
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`text-white hover:bg-white/10 ${
                          quality === q ? 'bg-white/10' : ''
                        }`}
                      >
                        {q}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:text-neon-blue"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Indicator */}
      <div className="absolute top-6 right-6">
        <Badge className="bg-black/50 text-neon-blue border-neon-blue/50">
          {quality}
        </Badge>
      </div>
    </div>
  );
}
