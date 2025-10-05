import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PlayButton from "@/pages/home/components/PlayButton";
import GlassCard from "@/components/ui/GlassCard";

const LibraryPage = () => {
  const { albums, songs, fetchAlbums, fetchSongs } = useMusicStore();

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
                    <PlayButton song={song} />
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

          {/* Quick Actions (hidden on small screens) */}
          <section className="hidden sm:block">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(255,0,51,0.35)]">
                    <span className="text-xl">❤️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Liked Songs
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      Your favorite tracks
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(255,0,51,0.35)]">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Create Playlist
                    </h3>
                    <p className="text-zinc-400 text-sm">Make your own mix</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📥</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Downloaded</h3>
                    <p className="text-zinc-400 text-sm">Offline music</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </main>
  );
};

export default LibraryPage;
