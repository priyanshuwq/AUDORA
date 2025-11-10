import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  Music,
  Sparkles,
  X,
  PlusCircle,
  Clock,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import Topbar from "@/components/Topbar";
import PlayButton from "@/pages/home/components/PlayButton";
import AnimatedGrid from "@/components/AnimatedGrid";
import ErrorBoundary from "@/components/ErrorBoundary";
import GlassCard from "@/components/ui/GlassCard";
import { useSearch } from "@/hooks/useSearch";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Album, Song } from "@/types";
import BouncingBall from "@/components/BouncingBall";

const BrowsePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Album dialog state
  const [isAddToAlbumDialogOpen, setIsAddToAlbumDialogOpen] = useState(false);
  const [selectedSong] = useState<Song | null>(null);

  // Handle initial search from navigation
  useEffect(() => {
    const initialSearchQuery = location.state?.searchQuery;
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setActiveTab("search");
    }
  }, [location.state]);

  // Stores
  // Removed unused destructured elements from usePlayerStore
  usePlayerStore();
  const {
    featuredSongs,
    trendingSongs,
    madeForYouSongs,
    recentSongs,
    albums,
    fetchFeaturedSongs,
    fetchTrendingSongs,
    fetchMadeForYouSongs,
    fetchRecentSongs,
    fetchAlbums,
    addSongToAlbum,
    isLoading: musicStoreLoading,
  } = useMusicStore();

  // Search hook
  const {
    songs: searchResults,
    isLoading: searchLoading,
    isLoadingMore,
    error,
    hasMore,
    totalSongs,
    search,
    loadMore,
    clearSearch,
  } = useSearch({ debounceMs: 300, limit: 20 });

  // Trigger search when searchQuery changes from navigation
  useEffect(() => {
    if (searchQuery && location.state?.searchQuery) {
      search(searchQuery);
      // Clear the location state to prevent re-searching on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [searchQuery, location.state, search]);

  // Fetch initial data
  useEffect(() => {
    fetchFeaturedSongs();
    fetchTrendingSongs();
    fetchMadeForYouSongs();
    fetchRecentSongs();
    fetchAlbums(); // Fetch albums for the add to album dialog
  }, [
    fetchFeaturedSongs,
    fetchTrendingSongs,
    fetchMadeForYouSongs,
    fetchRecentSongs,
    fetchAlbums,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query);
    } else {
      clearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearSearch();
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: () => {
      if (searchQuery) {
        handleClearSearch();
      }
    },
    onSearch: () => {
      setActiveTab("search");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    },
  });


  // Functions for adding songs to albums

  const handleAddToAlbum = async (albumId: string) => {
    if (!selectedSong) return;

    try {
      await addSongToAlbum(albumId, selectedSong._id);
      setIsAddToAlbumDialogOpen(false);
    } catch (error) {
      console.error("Error adding song to album:", error);
    }
  };

  return (
    <ErrorBoundary>
      <main className="rounded-2xl overflow-hidden h-full bg-black/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-32 md:mb-0">
        <Topbar />

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header Section */}
          <div className="px-4 sm:px-6 pt-6 pb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-red-400 via-rose-300 to-white bg-clip-text text-transparent">
              Browse Music
            </h1>
            <p className="text-sm text-zinc-400">Discover and explore music</p>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 flex justify-center">
              <TabsList className="grid grid-cols-5 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 h-auto bg-zinc-900/50 p-1 rounded-xl border border-white/10">
                <TabsTrigger
                  value="search"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all hover:text-zinc-200"
                >
                  <Search className="w-5 h-5" />
                  <span className="text-xs font-medium hidden sm:block">Search</span>
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all hover:text-zinc-200"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium hidden sm:block">Featured</span>
                </TabsTrigger>
                <TabsTrigger
                  value="trending"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all hover:text-zinc-200"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs font-medium hidden sm:block">Trending</span>
                </TabsTrigger>
                <TabsTrigger
                  value="for-you"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all hover:text-zinc-200"
                >
                  <Music className="w-5 h-5" />
                  <span className="text-xs font-medium hidden sm:block">For You</span>
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=inactive]:text-zinc-400 transition-all hover:text-zinc-200"
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-xs font-medium hidden sm:block">Recent</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-4 sm:px-6 scrollbar-hide">
              <div className="pb-8">
                <TabsContent value="search" className="mt-0 space-y-6">
                  {/* Search Input */}
                  <div className="mb-6 flex justify-center">
                    <div
                      className={`relative border rounded-xl transition-all duration-300 px-4 py-3 flex items-center bg-zinc-900/50 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 ${
                        isSearchFocused
                          ? "border-red-500/60 shadow-lg shadow-red-500/10"
                          : "border-zinc-800/50 hover:border-zinc-700/70"
                      }`}
                    >
                      <div
                        className={`flex items-center mr-3 transition-colors duration-200 ${
                          isSearchFocused ? "text-red-400" : "text-zinc-500"
                        }`}
                      >
                        {searchLoading ? (
                          <div className="scale-50">
                            <BouncingBall size="sm" />
                          </div>
                        ) : (
                          <Search className="h-5 w-5" />
                        )}
                      </div>

                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Search for songs, artists, albums..."
                        className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none"
                      />

                      {searchQuery && (
                        <button
                          onClick={handleClearSearch}
                          className="ml-2 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {searchQuery ? (
                    <div className="space-y-8">
                      {/* Search Results Grid */}
                      {searchLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                          {[...Array(12)].map((_, i) => (
                            <GlassCard key={i} className="animate-pulse">
                              <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                              <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                              <div className="h-3 bg-zinc-800 rounded w-1/2" />
                            </GlassCard>
                          ))}
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                              <Search className="w-5 h-5 text-red-400" />
                              Search Results for "{searchQuery}"
                            </h3>
                            <span className="text-sm text-zinc-400">
                              {totalSongs} songs found
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                            {searchResults.map((song, index) => (
                              <GlassCard
                                key={song._id}
                                className="search-result-item"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <div className="relative mb-2 group">
                                  <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                                    <img
                                      src={song.imageUrl}
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

                          {/* Load More Button */}
                          {hasMore && (
                            <div className="flex justify-center pt-4">
                              <Button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                variant="outline"
                                className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-white"
                              >
                                {isLoadingMore ? (
                                  <>
                                    <div className="mr-2 scale-50">
                                      <BouncingBall size="sm" />
                                    </div>
                                    Loading...
                                  </>
                                ) : (
                                  "Load More"
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                          <Search className="w-16 h-16 text-red-500/50" />
                          <div className="text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">
                              Search Error
                            </h3>
                            <p className="text-zinc-400">{error}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                          <Search className="w-16 h-16 text-zinc-600" />
                          <div className="text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">
                              No results found
                            </h3>
                            <p className="text-zinc-400">
                              Try searching with different keywords
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Related/Popular songs when we have results */}
                      {searchResults.length > 0 && featuredSongs.length > 0 && (
                        <div className="border-t border-zinc-800 pt-8">
                          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-red-400" />
                            You might also like
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                            {featuredSongs.slice(0, 6).map((song, index) => (
                              <GlassCard
                                key={`related-${song._id}`}
                                className="search-result-item opacity-80 hover:opacity-100"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div className="relative mb-2 group">
                                  <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                                    <img
                                      src={song.imageUrl}
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
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Search className="w-16 h-16 text-zinc-600 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Search for music
                      </h3>
                      <p className="text-zinc-400 text-center max-w-md">
                        Start typing to discover songs, artists, and albums.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="featured" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-white">
                        Featured Songs
                      </h2>
                      <p className="text-sm text-zinc-400">Hand-picked tracks just for you</p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <GlassCard key={i} className="animate-pulse">
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </GlassCard>
                        ))}
                      </div>
                    ) : featuredSongs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Music className="w-16 h-16 text-zinc-600" />
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            No featured songs available
                          </h3>
                          <p className="text-zinc-400">
                            Featured songs will appear here when available
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                        {featuredSongs.map((song) => (
                          <GlassCard key={song._id}>
                            <div className="relative mb-2 group">
                              <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                                <img
                                  src={song.imageUrl}
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
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-white">
                        Trending Now
                      </h2>
                      <p className="text-sm text-zinc-400">What everyone's listening to right now</p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <GlassCard key={i} className="animate-pulse">
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </GlassCard>
                        ))}
                      </div>
                    ) : trendingSongs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Music className="w-16 h-16 text-zinc-600" />
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            No trending songs available
                          </h3>
                          <p className="text-zinc-400">
                            Trending songs will appear here when available
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                        {trendingSongs.map((song) => (
                          <GlassCard key={song._id}>
                            <div className="relative mb-2 group">
                              <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                                <img
                                  src={song.imageUrl}
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
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="for-you" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-white">
                        Made For You
                      </h2>
                      <p className="text-sm text-zinc-400">Personalized recommendations</p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <GlassCard key={i} className="animate-pulse">
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </GlassCard>
                        ))}
                      </div>
                    ) : madeForYouSongs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Music className="w-16 h-16 text-zinc-600" />
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            No personalized songs available
                          </h3>
                          <p className="text-zinc-400">
                            Personalized recommendations will appear here
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6">
                        {madeForYouSongs.map((song) => (
                          <GlassCard key={song._id}>
                            <div className="relative mb-2 group">
                              <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                                <img
                                  src={song.imageUrl}
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
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1 text-white">
                        Recently Added
                      </h2>
                      <p className="text-sm text-zinc-400">The newest additions to our collection</p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <GlassCard key={i} className="animate-pulse">
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </GlassCard>
                        ))}
                      </div>
                    ) : recentSongs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Clock className="w-16 h-16 text-zinc-600" />
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-white mb-2">
                            No recent songs available
                          </h3>
                          <p className="text-zinc-400">
                            Check back soon for new music
                          </p>
                        </div>
                      </div>
                    ) : (
                      <AnimatedGrid
                        songs={recentSongs}
                        renderItem={(song) => (
                          <GlassCard>
                            <div className="relative mb-2 group">
                              <div className="aspect-square rounded-md overflow-hidden bg-zinc-900">
                                <img
                                  src={song.imageUrl}
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
                              <div className="flex items-center text-xs text-zinc-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Recently added</span>
                              </div>
                            </div>
                          </GlassCard>
                        )}
                      />
                    )}
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </main>

      {/* Add to Album Dialog */}
      <Dialog
        open={isAddToAlbumDialogOpen}
        onOpenChange={setIsAddToAlbumDialogOpen}
      >
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Add "{selectedSong?.title}" to Album
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Select an album to add this song to your collection
            </DialogDescription>
          </DialogHeader>

          {albums.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto py-2">
              {albums.map((album: Album) => (
                <div
                  key={album._id}
                  onClick={() => handleAddToAlbum(album._id)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 cursor-pointer group transition-all"
                >
                  <img
                    src={album.imageUrl}
                    alt={album.title}
                    className="h-16 w-16 object-cover rounded shadow-md group-hover:shadow-lg transition-all"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white group-hover:text-red-400 transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {album.artist} • {album.releaseYear}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {album.songs?.length || 0} songs
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">
              <p>No albums available</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsAddToAlbumDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};

export default BrowsePage;
