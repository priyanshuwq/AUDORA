import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";

const BrowsePage = () => {
  const genres = [
    { name: "Pop", color: "from-pink-500 to-rose-500", songs: "1.2M songs" },
    { name: "Rock", color: "from-orange-500 to-red-500", songs: "800K songs" },
    {
      name: "Hip-Hop",
      color: "from-purple-500 to-indigo-500",
      songs: "950K songs",
    },
    { name: "Jazz", color: "from-blue-500 to-cyan-500", songs: "450K songs" },
    {
      name: "Electronic",
      color: "from-green-500 to-teal-500",
      songs: "600K songs",
    },
    {
      name: "Classical",
      color: "from-yellow-500 to-amber-500",
      songs: "350K songs",
    },
    { name: "R&B", color: "from-red-500 to-pink-500", songs: "720K songs" },
    {
      name: "Country",
      color: "from-amber-500 to-orange-500",
      songs: "480K songs",
    },
  ];

  const moods = [
    { name: "Chill", emoji: "😌", description: "Relaxing vibes" },
    { name: "Workout", emoji: "💪", description: "High energy beats" },
    { name: "Focus", emoji: "🎯", description: "Concentration music" },
    { name: "Party", emoji: "🎉", description: "Dance all night" },
    { name: "Sleep", emoji: "😴", description: "Peaceful sounds" },
    { name: "Study", emoji: "📚", description: "Background focus" },
  ];

  return (
    <main className="rounded-xl overflow-hidden h-full bg-gradient-to-br from-[#1C1B29]/80 to-[#0D0C1D]/80 backdrop-blur-sm flex flex-col">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-10">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Browse Music
            </h1>
            <p className="text-lg text-zinc-400">
              Explore genres, moods, and discover new favorites
            </p>
          </div>

          {/* Genres Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Genres
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre) => (
                <div
                  key={genre.name}
                  className={`bg-gradient-to-br ${genre.color} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                >
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">{genre.name}</h3>
                    <p className="text-white/80 text-sm">{genre.songs}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Moods Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Moods
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <div
                  key={mood.name}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/40 hover:border-purple-500/20 transition-all duration-300 cursor-pointer group hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/10"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{mood.emoji}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {mood.name}
                    </h3>
                    <p className="text-sm text-zinc-400 group-hover:text-zinc-300">
                      {mood.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Right Now Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Popular Right Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Today's Hits
                    </h3>
                    <p className="text-zinc-400">The most played songs today</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/50 hover:border-purple-500/30 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Trending Now
                    </h3>
                    <p className="text-zinc-400">
                      Rising tracks and viral songs
                    </p>
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

export default BrowsePage;
