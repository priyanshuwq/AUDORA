import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Pause, Play, Plus, Search, Trash2, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import PlayButton from "@/pages/home/components/PlayButton";
import BouncingBall from "@/components/BouncingBall";
import { formatDuration } from "@/lib/formatters";
import { getMediaUrl } from "@/lib/mediaUrl";

// Helper function to get release year
const getReleaseYear = (dateString: string) => {
  return new Date(dateString).getFullYear();
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const {
    fetchAlbumById,
    currentAlbum,
    isLoading,
    fetchSongs,
    addSongToAlbum,
    removeSongFromAlbum,
  } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay, initializeQueue } = usePlayerStore();
  const { isAdmin } = useAuthStore();
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = useState(false);

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
    fetchSongs(); // Fetch all songs for the add song dialog
  }, [fetchAlbumById, fetchSongs, albumId]);

  // Initialize queue when album songs are loaded
  useEffect(() => {
    if (currentAlbum?.songs && currentAlbum.songs.length > 0) {
      initializeQueue(currentAlbum.songs);
    }
  }, [currentAlbum?.songs, initializeQueue]);

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

  return (
    <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-black/95 backdrop-blur-xl border border-white/5 shadow-2xl">
      <ScrollArea className="flex-1 rounded-2xl overflow-y-auto scrollbar-hide">
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
            <div className="flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6 pb-6 sm:pb-8 items-start">
              <img
                src={getMediaUrl(currentAlbum?.imageUrl)}
                alt={currentAlbum?.title}
                className="w-40 h-40 sm:w-[240px] sm:h-[240px] shadow-2xl rounded-2xl object-cover"
              />
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium text-zinc-300">Album</p>
                <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold my-2 sm:my-4 leading-tight">
                  {currentAlbum?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  {currentAlbum?.releaseYear ? (
                    <span>• {currentAlbum?.releaseYear}</span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* play button and add song button (stack on mobile) */}
            <div className="px-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
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

            {/* Songs Grid Section */}
            <div className="bg-black/40 rounded-t-2xl px-4 sm:px-6 py-6">
              <h3 className="text-lg sm:text-xl font-extrabold mb-4 px-2 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                Songs
              </h3>
              
              {/* Modern Card Grid Layout - Same as HomePage */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                {currentAlbum?.songs.map((song) => {
                  const isCurrentSong = currentSong?._id === song._id;
                  return (
                    <GlassCard key={song._id}>
                      <div className="relative mb-2 group">
                        <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                          <img
                            src={getMediaUrl(song.imageUrl)}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <PlayButton 
                          song={song} 
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        />
                        {isCurrentSong && isPlaying && (
                          <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Remove "${song.title}" from this album?`)) {
                                removeSongFromAlbum(albumId || "", song._id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-0.5 px-0.5">
                        <h3 className="text-sm font-medium text-white truncate">
                          {song.title}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">
                          {song.artist}
                        </p>
                        {/* Duration and Release Year */}
                        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(song.duration)}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{getReleaseYear(song.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
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
    } catch (error) {
      console.error("Error adding song to album:", error);
    } finally {
      setIsAddingLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl bg-zinc-900 text-white">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-white">
          Add Song to Album
        </DialogTitle>
        <DialogDescription className="text-zinc-400">
          Search and select songs to add to this album
        </DialogDescription>
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
          className="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-md text-white"
        />
      </div>

      {/* Song list */}
      <div className="overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <BouncingBall size="sm" />
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="space-y-2 mt-2">
            {filteredSongs.map((song) => (
              <div
                key={song._id}
                onClick={() => setSelectedSongId(song._id)}
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-all ${
                  selectedSongId === song._id ? "bg-zinc-800" : ""
                }`}
              >
                <img
                  src={getMediaUrl(song.imageUrl)}
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
            <div className="mr-2 scale-50">
              <BouncingBall size="sm" />
            </div>
          ) : null}
          Add to Album
        </Button>
      </div>
    </DialogContent>
  );
};

export default AlbumPage;
