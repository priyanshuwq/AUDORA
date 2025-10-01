import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PlayButton from "@/pages/home/components/PlayButton";

const LibraryPage = () => {
  const { albums, songs, fetchAlbums, fetchSongs } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
  }, [fetchAlbums, fetchSongs]);

  return (
    <main className="rounded-xl overflow-hidden h-full bg-gradient-to-br from-[#1C1B29]/80 to-[#0D0C1D]/80 backdrop-blur-sm flex flex-col">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Your Library
            </h1>
            <p className="text-lg text-zinc-400">
              Your music collection and saved albums
            </p>
          </div>

          {/* Albums Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Albums
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {albums.map((album) => (
                <Link
                  key={album._id}
                  to={`/albums/${album._id}`}
                  className="bg-black/20 backdrop-blur-sm border border-white/5 p-4 sm:p-6 rounded-2xl hover:bg-black/40 hover:border-purple-500/20 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-xl shadow-2xl overflow-hidden">
                      <img
                        src={album.imageUrl}
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 truncate text-white group-hover:text-purple-200 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                    {album.artist}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Recently Played Songs */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Recently Played
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {songs.slice(0, 10).map((song) => (
                <div
                  key={song._id}
                  className="bg-black/20 backdrop-blur-sm border border-white/5 p-4 sm:p-6 rounded-2xl hover:bg-black/40 hover:border-purple-500/20 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105"
                >
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
                  <h3 className="font-semibold mb-2 truncate text-white group-hover:text-purple-200 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                    {song.artist}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
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

              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
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

              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
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
