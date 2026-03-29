import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useLikedSongsStore } from "@/stores/useLikedSongsStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PlayButton from "@/pages/home/components/PlayButton";
import GlassCard from "@/components/ui/GlassCard";
import { Heart } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUrl";

const LibraryPage = () => {
  const { albums, songs, fetchAlbums, fetchSongs } = useMusicStore();
  const { likedSongs } = useLikedSongsStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, [fetchAlbums, fetchSongs]);

  return (
    <main className="rounded-2xl overflow-hidden h-full bg-black/95 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col mb-32 md:mb-0">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8 md:space-y-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white tracking-wide sm:tracking-widest">
              Your Library
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-400">
              Your music collection and saved albums
            </p>
          </div>

          {/* Liked Songs Section */}
          {likedSongs.length > 0 && (
            <section id="liked" className="mb-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide sm:tracking-widest">
                  Liked Songs
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                {likedSongs.map((song) => (
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
                    </div>
                    <div className="space-y-0.5 px-0.5">
                      <h3 className="text-sm font-medium text-white truncate">
                        {song.title}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </section>
          )}

          {/* Albums Section */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 tracking-wide sm:tracking-widest">
              Albums
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
              {albums.map((album) => (
                <Link key={album._id} to={`/albums/${album._id}`}>
                  <GlassCard>
                    <div className="relative mb-2 group">
                      <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                        <img
                          src={getMediaUrl(album.imageUrl)}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-0.5 px-0.5">
                      <h3 className="text-sm font-medium text-white truncate">
                        {album.title}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate">
                        {album.artist}
                      </p>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>

          {/* Recently Played Songs */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 tracking-widest">
              Recently Played
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
              {songs.slice(0, 10).map((song) => (
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
                  </div>
                  <div className="space-y-0.5 px-0.5">
                    <h3 className="text-sm font-medium text-white truncate">
                      {song.title}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </main>
  );
};

export default LibraryPage;
