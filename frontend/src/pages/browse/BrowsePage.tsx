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
  Loader2,
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
      <main className="rounded-none sm:rounded-xl overflow-hidden h-full bg-gradient-to-br from-zinc-900/95 to-black/95 backdrop-blur-sm flex flex-col mb-32 md:mb-0">
        <Topbar />

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div className="flex-shrink-0 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
              <div className="max-w-full">
                <div className="mb-6 sm:mb-8 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
                    Browse Music
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-400">
                    Discover and explore music
                  </p>
                </div>

                <TabsList className="inline-flex w-full items-center justify-center gap-1 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-1.5 mb-6 sm:mb-8">
                  <TabsTrigger
                    value="search"
                    className="flex flex-1 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-transparent text-zinc-400 border-0 data-[state=active]:text-white data-[state=active]:bg-red-600/25 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 hover:data-[state=inactive]:bg-zinc-800/30 hover:data-[state=inactive]:text-zinc-300 transition-all duration-200 py-2.5 sm:py-3 rounded-lg"
                  >
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Search</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="featured"
                    className="flex flex-1 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-transparent text-zinc-400 border-0 data-[state=active]:text-white data-[state=active]:bg-red-600/25 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 hover:data-[state=inactive]:bg-zinc-800/30 hover:data-[state=inactive]:text-zinc-300 transition-all duration-200 py-2.5 sm:py-3 rounded-lg"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Featured</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="trending"
                    className="flex flex-1 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-transparent text-zinc-400 border-0 data-[state=active]:text-white data-[state=active]:bg-red-600/25 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 hover:data-[state=inactive]:bg-zinc-800/30 hover:data-[state=inactive]:text-zinc-300 transition-all duration-200 py-2.5 sm:py-3 rounded-lg"
                  >
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Trending</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="for-you"
                    className="flex flex-1 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-transparent text-zinc-400 border-0 data-[state=active]:text-white data-[state=active]:bg-red-600/25 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 hover:data-[state=inactive]:bg-zinc-800/30 hover:data-[state=inactive]:text-zinc-300 transition-all duration-200 py-2.5 sm:py-3 rounded-lg"
                  >
                    <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">For You</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="flex flex-1 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-transparent text-zinc-400 border-0 data-[state=active]:text-white data-[state=active]:bg-red-600/25 data-[state=active]:shadow-lg data-[state=active]:shadow-red-500/20 hover:data-[state=inactive]:bg-zinc-800/30 hover:data-[state=inactive]:text-zinc-300 transition-all duration-200 py-2.5 sm:py-3 rounded-lg"
                  >
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Recent</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4 sm:px-6 md:px-8">
              <div className="pb-8">
                <TabsContent value="search" className="mt-0 space-y-6">
                  {/* Clean Search Input */}
                  <div className="sticky top-0 z-10 py-4">
                    <div className="relative group">
                      {/* Search container */}
                      <div
                        className={`relative border rounded-full transition-all duration-300 px-5 py-3.5 flex items-center ${
                          isSearchFocused
                            ? "border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                            : "border-zinc-700/50 hover:border-zinc-600/70"
                        }`}
                      >
                        {/* Search icon */}
                        <div
                          className={`flex items-center pointer-events-none mr-3 transition-colors duration-200 ${
                            isSearchFocused ? "text-red-400" : "text-zinc-500"
                          }`}
                        >
                          <Search
                            className={`h-5 w-5 transition-all duration-150 ${
                              searchLoading ? "opacity-0" : "opacity-100"
                            }`}
                          />
                          {searchLoading && (
                            <Loader2 className="h-5 w-5 animate-spin text-red-400 absolute" />
                          )}
                        </div>

                        {/* Input field */}
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                          placeholder="What do you want to play?"
                          className="flex-1 bg-transparent text-white text-base placeholder-zinc-500 focus:outline-none"
                        />

                        {/* Clear button */}
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="ml-2 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-red-500/20 transition-all duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                            {searchResults.map((song, index) => (
                              <GlassCard
                                key={song._id}
                                className="search-result-item"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <div className="relative mb-3 sm:mb-4">
                                  <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                    <img
                                      src={song.imageUrl}
                                      alt={song.title}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                  </div>
                                  <PlayButton
                                    song={song}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                                  />
                                </div>
                                <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                                  {song.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                                  {song.artist}
                                </p>
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
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                            {featuredSongs.slice(0, 6).map((song, index) => (
                              <GlassCard
                                key={`related-${song._id}`}
                                className="search-result-item opacity-80 hover:opacity-100"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <div className="relative mb-3 sm:mb-4">
                                  <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                    <img
                                      src={song.imageUrl}
                                      alt={song.title}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                  </div>
                                  <PlayButton
                                    song={song}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                                  />
                                </div>
                                <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                                  {song.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                                  {song.artist}
                                </p>
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
                  <div className="space-y-8">
                    <div className="text-center sm:text-left py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Featured Songs
                      </h2>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-zinc-400">Hand-picked tracks just for you</p>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {featuredSongs.map((song) => (
                          <GlassCard key={song._id}>
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <PlayButton
                                song={song}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                              />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                              {song.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                              {song.artist}
                            </p>
                          </GlassCard>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="mt-0">
                  <div className="space-y-8">
                    <div className="text-center sm:text-left py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Trending Now
                      </h2>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-zinc-400">
                        What everyone's listening to right now
                      </p>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {trendingSongs.map((song) => (
                          <GlassCard key={song._id}>
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <PlayButton
                                song={song}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                              />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                              {song.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                              {song.artist}
                            </p>
                          </GlassCard>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="for-you" className="mt-0">
                  <div className="space-y-8">
                    <div className="text-center sm:text-left py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Made For You
                      </h2>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-zinc-400">Personalized recommendations</p>
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {madeForYouSongs.map((song) => (
                          <GlassCard key={song._id}>
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <PlayButton
                                song={song}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                              />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                              {song.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                              {song.artist}
                            </p>
                          </GlassCard>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-0">
                  <div className="space-y-8">
                    <div className="text-center sm:text-left py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Recently Added
                      </h2>
                      <div className="h-1 w-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-zinc-400">
                        The newest additions to our collection
                      </p>
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
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <PlayButton
                                song={song}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-sm sm:text-base tracking-wide truncate text-white group-hover:text-red-200 transition-colors">
                                {song.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                                {song.artist}
                              </p>
                              <div className="flex items-center text-xs text-zinc-600">
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
