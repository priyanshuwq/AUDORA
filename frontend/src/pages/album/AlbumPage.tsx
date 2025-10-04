import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const {
    fetchAlbumById,
    currentAlbum,
    isLoading,
    fetchSongs,
    addSongToAlbum,
  } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = useState(false);

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
    fetchSongs(); // Fetch all songs for the add song dialog
  }, [fetchAlbumById, fetchSongs, albumId]);

  if (isLoading) return null;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      // start playing the album from the beginning
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 rounded-md overflow-y-auto">
        {/* Main Content */}
        <div className="relative min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#1C1B29]/90 via-[#0D0C1D]/80
					 to-[#0D0C1D] pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] h-[240px] shadow-2xl rounded-2xl"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* play button and add song button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>

              <Dialog
                open={isAddSongDialogOpen}
                onOpenChange={setIsAddSongDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Song
                  </Button>
                </DialogTrigger>
                <AddSongDialog
                  albumId={albumId || ""}
                  onAddSong={addSongToAlbum}
                  onClose={() => setIsAddSongDialogOpen(false)}
                />
              </Dialog>
            </div>

            {/* Table Section */}
            <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 rounded-t-2xl">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-4 text-sm 
            text-zinc-400 border-b border-white/10"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* songs list */}

              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10"
                          />

                          <div>
                            <div className={`font-medium text-white`}>
                              {song.title}
                            </div>
                            <div>{song.artist}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

interface AddSongDialogProps {
  albumId: string;
  onAddSong: (albumId: string, songId: string) => Promise<void>;
  onClose: () => void;
}

const AddSongDialog = ({ albumId, onAddSong, onClose }: AddSongDialogProps) => {
  const { songs, isLoading } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  // Filter songs based on search query
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSong = async () => {
    if (!selectedSongId) {
      toast.error("Please select a song to add");
      return;
    }

    setIsAddingLoading(true);
    try {
      await onAddSong(albumId, selectedSongId);
      onClose();
      toast.success("Song added to album successfully");
    } catch (error) {
      console.error("Error adding song to album:", error);
    } finally {
      setIsAddingLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl bg-zinc-900 text-white border-zinc-800">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-white">
          Add Song to Album
        </DialogTitle>
      </DialogHeader>

      {/* Search box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs by title or artist"
          className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
        />
      </div>

      {/* Song list */}
      <div className="overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="space-y-2 mt-2">
            {filteredSongs.map((song) => (
              <div
                key={song._id}
                onClick={() => setSelectedSongId(song._id)}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 cursor-pointer transition-all ${
                  selectedSongId === song._id
                    ? "bg-zinc-800 border border-red-500/50"
                    : ""
                }`}
              >
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="h-12 w-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-zinc-400">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-zinc-400">No songs found</p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAddSong}
          className="bg-red-600 hover:bg-red-500"
          disabled={!selectedSongId || isAddingLoading}
        >
          {isAddingLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : null}
          Add to Album
        </Button>
      </div>
    </DialogContent>
  );
};

export default AlbumPage;
