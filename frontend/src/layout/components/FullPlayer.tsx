import { usePlayerStore } from "@/stores/usePlayerStore";
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const FullPlayer = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isFullscreenPlayer,
    setIsFullscreenPlayer,
    queue,
    currentIndex,
    setCurrentSong,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.75);
  const [showVolume, setShowVolume] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  // swipe-to-dismiss touch start tracking (must be a hook and declared unconditionally)
  const touchStartY = useRef<number | null>(null);

  // attach to the existing audio element on the page
  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(isNaN(audio.duration) ? 0 : audio.duration);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("canplay", onDur);

    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("canplay", onDur);
    };
  }, [volume, currentSong]);

  useEffect(() => {
    // when opening, animate in
    if (isFullscreenPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isFullscreenPlayer]);

  if (!isFullscreenPlayer || !currentSong) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  // swipe-to-dismiss (vertical)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    // if swiped down enough, close
    if (delta > 120) {
      setIsFullscreenPlayer(false);
      touchStartY.current = null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white p-4 transition-opacity duration-300 ease-in-out"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={() => setIsFullscreenPlayer(false)}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-3xl w-full text-center transform transition-transform duration-400 ease-in-out scale-100">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="mx-auto w-72 h-72 object-cover rounded-xl shadow-2xl mb-6"
          />

          <h2 className="text-3xl font-bold mb-2">{currentSong.title}</h2>
          <p className="text-zinc-300 mb-4">{currentSong.artist}</p>

          <div className="w-full px-4">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-2">
              <span>
                {Math.floor(progress / 60)}:
                {String(Math.floor(progress % 60)).padStart(2, "0")}
              </span>
              <span>
                {duration
                  ? `${Math.floor(duration / 60)}:${String(
                      Math.floor(duration % 60)
                    ).padStart(2, "0")}`
                  : "0:00"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 my-4">
            <Button size="icon" variant="ghost" onClick={playPrevious}>
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              size="icon"
              className="bg-red-600 text-white rounded-full h-14 w-14"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button size="icon" variant="ghost" onClick={playNext}>
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2">
            <Button
              variant="ghost"
              onClick={() => setShowVolume((v) => !v)}
              className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 rounded-md transition-all"
            >
              <Volume2 className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-300">Volume</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowQueue((q) => !q)}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-zinc-200">Queue</span>
            </Button>
          </div>

          {/* Volume panel - toggled */}
          {showVolume && (
            <div className="flex items-center justify-center gap-3 mt-3 transition-all">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                className="w-40 accent-red-500"
              />
            </div>
          )}

          {/* Queue panel - toggled, minimal view */}
          {showQueue && (
            <div className="mt-4 max-h-40 overflow-y-auto w-full px-6 transition-all">
              <ul className="space-y-2">
                {queue.map((s, idx) => (
                  <li
                    key={s._id}
                    className={`flex items-center justify-between p-2 rounded ${
                      idx === currentIndex ? "bg-red-600/20" : "bg-black/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.imageUrl}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="text-left">
                        <div className="font-medium">{s.title}</div>
                        <div className="text-xs text-zinc-400">{s.artist}</div>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentSong(s)}
                        className="text-zinc-300"
                      >
                        Play
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* close inner panel */}
        </div>
      </div>
    </div>
  );
};

export default FullPlayer;
