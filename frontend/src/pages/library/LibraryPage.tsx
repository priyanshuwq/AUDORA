import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useLikedSongsStore } from "@/stores/useLikedSongsStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PlayButton from "@/pages/home/components/PlayButton";
import GlassCard from "@/components/ui/GlassCard";
import { Heart } from "lucide-react";

const LibraryPage = () => {
  const { albums, songs, fetchAlbums, fetchSongs } = useMusicStore();
  const { likedSongs } = useLikedSongsStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, [fetchAlbums, fetchSongs]);

  return (
    <main className="rounded-none sm:rounded-xl overflow-hidden h-full bg-zinc-950/90 backdrop-blur-sm flex flex-col mb-32 md:mb-0">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {likedSongs.map((song) => (
                  <GlassCard key={song._id}>
                    <div className="relative mb-4">
                      <div className="aspect-square rounded-xl shadow-2xl overflow-hidden">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <PlayButton song={song} className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center" />
                    </div>
                    <h3 className="font-semibold tracking-widest mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                      {song.artist}
                    </p>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {albums.map((album) => (
                <Link key={album._id} to={`/albums/${album._id}`}>
                  <GlassCard className="p-4 sm:p-6">
                    <div className="relative mb-4">
                      <div className="aspect-square rounded-xl shadow-2xl overflow-hidden">
                        <img
                          src={album.imageUrl}
                          alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="font-semibold tracking-widest mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                      {album.artist}
                    </p>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {songs.slice(0, 10).map((song) => (
                <GlassCard key={song._id}>
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-xl shadow-2xl overflow-hidden">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <PlayButton song={song} className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center" />
                  </div>
                  <h3 className="font-semibold tracking-widest mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                    {song.artist}
                  </p>
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
