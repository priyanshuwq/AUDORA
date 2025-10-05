import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import SearchResults from "@/components/SearchResults";
import SongCard from "@/components/SongCard";
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
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Handle initial search from navigation
  useEffect(() => {
    const initialSearchQuery = location.state?.searchQuery;
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setActiveTab("search");
    }
  }, [location.state]);

  // Stores
  const { currentSong, isPlaying, setCurrentSong, initializeQueue } =
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

  const handlePlaySong = (song: Song) => {
    if (currentSong?._id === song._id) {
      // If same song, just toggle play/pause
      return;
    }

    // Set up queue based on current context
    let songsQueue: Song[] = [];

    if (activeTab === "search" && searchResults.length > 0) {
      songsQueue = searchResults;
    } else if (activeTab === "featured") {
      songsQueue = featuredSongs;
    } else if (activeTab === "trending") {
      songsQueue = trendingSongs;
    } else if (activeTab === "for-you") {
      songsQueue = madeForYouSongs;
    } else if (activeTab === "recent") {
      songsQueue = recentSongs;
    }

    // Initialize queue and play song
    if (songsQueue.length > 0) {
      initializeQueue(songsQueue);
    }
    setCurrentSong(song);
  };

  // Functions for adding songs to albums
  const handleOpenAddToAlbumDialog = (song: Song) => {
    setSelectedSong(song);
    setIsAddToAlbumDialogOpen(true);
  };

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
              <div className="container-responsive">
                <div className="mb-6 sm:mb-8 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
                    Browse Music
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-400">
                    Discover and explore music
                  </p>
                </div>

                <TabsList className="grid w-full grid-cols-5 bg-zinc-900/50 backdrop-blur-sm rounded-lg p-1 mb-6 sm:mb-8">
                  <TabsTrigger
                    value="search"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-red-500/20 data-[state=active]:border-red-500/30 transition-all duration-200 py-2 sm:py-3"
                  >
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Search</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="featured"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-red-500/20 data-[state=active]:border-red-500/30 transition-all duration-200 py-2 sm:py-3"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Featured</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="trending"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-red-500/20 data-[state=active]:border-red-500/30 transition-all duration-200 py-2 sm:py-3"
                  >
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Trending</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="for-you"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-red-500/20 data-[state=active]:border-red-500/30 transition-all duration-200 py-2 sm:py-3"
                  >
                    <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">For You</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-red-500/20 data-[state=active]:border-red-500/30 transition-all duration-200 py-2 sm:py-3"
                  >
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Recent</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4 sm:px-6 md:px-8">
              <div className="container-responsive pb-8">
                <TabsContent value="search" className="mt-0 space-y-6">
                  {/* Clean Search Input */}
                  {/* Minimal Clean Search Input */}
                  <div className="sticky top-0 z-10 bg-gradient-to-br from-zinc-900/95 to-black/95 backdrop-blur-sm py-4">
                    <div className="relative group">
                      {/* Search container */}
                      <div
                        className={`relative bg-zinc-900/70 backdrop-blur-md border border-zinc-700 focus-within:border-red-600 rounded-full transition-all duration-200 px-4 py-3 flex items-center ${
                          isSearchFocused
                            ? "border-red-600/40 ring-1 ring-red-600/20"
                            : "hover:border-zinc-600/60"
                        }`}
                      >
                        {/* Search icon */}
                        <div
                          className={`flex items-center pointer-events-none mr-3 ${
                            isSearchFocused ? "text-red-400" : "text-zinc-400"
                          }`}
                        >
                          <Search
                            className={`h-5 w-5 transition-all duration-150 ${
                              searchLoading ? "opacity-0" : "opacity-100"
                            }`}
                          />
                          {searchLoading && (
                            <Loader2 className="h-5 w-5 animate-spin text-zinc-300 absolute" />
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
                          className="flex-1 bg-transparent text-white text-base placeholder-zinc-500 focus:outline-none transition-colors duration-150"
                        />

                        {/* Clear button */}
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {searchQuery ? (
                    <div className="space-y-8">
                      {/* Direct search results */}
                      <SearchResults
                        songs={searchResults}
                        isLoading={searchLoading}
                        isLoadingMore={isLoadingMore}
                        error={error}
                        hasMore={hasMore}
                        totalSongs={totalSongs}
                        query={searchQuery}
                        onLoadMore={loadMore}
                        onPlay={handlePlaySong}
                        onAddToAlbum={handleOpenAddToAlbumDialog}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        showHeader={false}
                      />{" "}
                      {/* Related/Popular songs when we have results */}
                      {searchResults.length > 0 && featuredSongs.length > 0 && (
                        <div className="border-t border-zinc-800 pt-6">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-red-400" />
                            You might also like
                          </h3>
                          <div className="space-y-3">
                            {featuredSongs.slice(0, 6).map((song, index) => (
                              <div
                                key={`related-${song._id}`}
                                className="search-result-item"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <SongCard
                                  song={song}
                                  isCurrentSong={currentSong?._id === song._id}
                                  isPlaying={
                                    isPlaying && currentSong?._id === song._id
                                  }
                                  onPlay={handlePlaySong}
                                  className="song-card-hover opacity-80 hover:opacity-100"
                                />
                              </div>
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
                    <div className="text-center py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Featured Songs
                      </h2>
                      <div className="h-1 w-16 rounded bg-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-white">
                        Hand-picked tracks just for you
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
                              <button
                                onClick={() => handlePlaySong(song)}
                                className="absolute right-2 bottom-2 bg-red-500 rounded-full p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 shadow-xl"
                              >
                                {isPlaying && currentSong?._id === song._id ? (
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse-slow" />
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse" />
                                  </div>
                                ) : (
                                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5" />
                                )}
                              </button>
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
                    <div className="text-center py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Trending Now
                      </h2>
                      <div className="h-1 w-16 rounded bg-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-white">
                        What everyone's listening to right now
                      </p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-black/20 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl animate-pulse"
                          >
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </div>
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
                          <div
                            key={song._id}
                            className="bg-black/20 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl hover:bg-black/40 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-xl hover:scale-105"
                          >
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <button
                                onClick={() => handlePlaySong(song)}
                                className="absolute right-2 bottom-2 bg-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 shadow-xl"
                              >
                                {isPlaying && currentSong?._id === song._id ? (
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse-slow" />
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse" />
                                  </div>
                                ) : (
                                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5" />
                                )}
                              </button>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                              {song.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                              {song.artist}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="for-you" className="mt-0">
                  <div className="space-y-8">
                    <div className="text-center py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Made For You
                      </h2>
                      <div className="h-1 w-16 rounded bg-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-white">Personalized recommendations</p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-black/20 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl animate-pulse"
                          >
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </div>
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
                          <div
                            key={song._id}
                            className="bg-black/20 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl hover:bg-black/40 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-xl hover:scale-105"
                          >
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <button
                                onClick={() => handlePlaySong(song)}
                                className="absolute right-2 bottom-2 bg-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 shadow-xl"
                              >
                                {isPlaying && currentSong?._id === song._id ? (
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse-slow" />
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse" />
                                  </div>
                                ) : (
                                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5" />
                                )}
                              </button>
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base tracking-wide mb-1 sm:mb-2 truncate text-white group-hover:text-red-200 transition-colors">
                              {song.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">
                              {song.artist}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-0">
                  <div className="space-y-8">
                    <div className="text-center py-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
                        Recently Added
                      </h2>
                      <div className="h-1 w-16 rounded bg-red-600 mx-auto sm:mx-0 mb-2" />
                      <p className="text-white">
                        The newest additions to our collection
                      </p>
                    </div>

                    {musicStoreLoading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-black/20 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl animate-pulse"
                          >
                            <div className="aspect-square rounded-lg bg-zinc-800 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
                          </div>
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
                          <div className="bg-black/20 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl hover:bg-black/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-xl hover:shadow-red-500/10 hover:scale-105">
                            <div className="relative mb-3 sm:mb-4">
                              <div className="aspect-square rounded-lg sm:rounded-xl shadow-2xl overflow-hidden">
                                <img
                                  src={song.imageUrl}
                                  alt={song.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <button
                                onClick={() => handlePlaySong(song)}
                                className="absolute right-2 bottom-2 bg-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 shadow-xl"
                              >
                                {isPlaying && currentSong?._id === song._id ? (
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse-slow" />
                                    <div className="w-1 h-4 bg-white mx-0.5 animate-pulse" />
                                  </div>
                                ) : (
                                  <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5" />
                                )}
                              </button>
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
                          </div>
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
          </DialogHeader>

          {albums.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto py-2">
              <p className="text-zinc-400 text-sm">
                Select an album to add this song to:
              </p>

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
