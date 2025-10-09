import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const FriendsActivity = () => {
  const [waveformHeights, setWaveformHeights] = useState<number[]>([]);

  // Generate dynamic waveform heights
  useEffect(() => {
    const generateWaveform = () => {
      const heights = Array.from({ length: 50 }, () => Math.random() * 80 + 20);
      setWaveformHeights(heights);
    };

    generateWaveform();
    const interval = setInterval(generateWaveform, 150);
    return () => clearInterval(interval);
  }, []);

  // Static data for the Discover panel
  const popularSongs = [
    { title: "Blinding Lights", artist: "The Weeknd", duration: "3:22" },
    { title: "Watermelon Sugar", artist: "Harry Styles", duration: "2:54" },
    { title: "As It Was", artist: "Harry Styles", duration: "2:47" },
    { title: "Heat Waves", artist: "Glass Animals", duration: "3:58" },
    { title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
  ];

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-white font-semibold text-lg">Discover</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Genre tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
            {["All", "Pop", "Rock", "Hip-Hop", "Jazz", "Electronic"].map(
              (genre) => (
                <button
                  key={genre}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                    genre === "All"
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              )
            )}
          </div>

          {/* Popular section */}
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3">Popular Right Now</h3>
            <div className="space-y-1">
              {popularSongs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer group transition-colors"
                >
                  <div className="w-10 h-10 bg-zinc-700 rounded-md flex items-center justify-center group-hover:bg-zinc-600 transition-colors">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {song.title}
                    </p>
                    <p className="text-zinc-400 text-xs truncate">
                      {song.artist}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-xs tabular-nums">
                      {song.duration}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-zinc-400 hover:text-red-500 transition-colors" />
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-zinc-400 hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending section with waveform visualization */}
          <div>
            <h3 className="text-white font-medium mb-3">Trending Music</h3>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-md flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Summer Vibes Mix</p>
                  <p className="text-zinc-400 text-sm">
                    Electronic • 2.1M plays
                  </p>
                </div>
              </div>
              {/* Enhanced waveform visualization */}
              <div className="flex items-end justify-center gap-0.5 h-16 mb-3 px-2">
                {waveformHeights.map((height, i) => (
                  <div
                    key={i}
                    className="bg-blue-400 w-1 rounded-full transition-all duration-150 ease-in-out"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-sm">
                  Now playing: "Ocean Drive" by Duke Dumont
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsActivity;
