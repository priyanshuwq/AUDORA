import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({
  song,
  className,
}: {
  song: Song;
  className?: string;
}) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  const defaultClass = `absolute bottom-3 right-3 bg-red-600 hover:bg-red-500 hover:scale-110 transition-all duration-300 shadow-[0_0_10px_rgba(255,0,51,0.35)] hover:shadow-[0_0_16px_rgba(255,0,51,0.6)] opacity-0 translate-y-2 group-hover:translate-y-0 rounded-full ${
    isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  }`;

  const finalClass = className ? `${defaultClass} ${className}` : defaultClass;

  return (
    <Button size={"icon"} onClick={handlePlay} className={finalClass}>
      {isCurrentSong && isPlaying ? (
        <Pause className="size-4 text-white" />
      ) : (
        <Play className="size-4 text-white ml-0.5" />
      )}
    </Button>
  );
};
export default PlayButton;
