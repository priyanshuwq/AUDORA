import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUser } from "@clerk/clerk-react";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  const { user } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName =
      user?.firstName || user?.fullName?.split(" ")[0] || "there";

    if (hour >= 5 && hour < 12) return `Good Morning, ${firstName}`;
    if (hour >= 12 && hour < 17) return `Good Afternoon, ${firstName}`;
    if (hour >= 17 && hour < 22) return `Good Evening, ${firstName}`;
    return `Good Night, ${firstName}`;
  };

  const getGreetingSubtext = () => {
    const hour = new Date().getHours();
    const messages = {
      morning: [
        "Time to start your day with great music!",
        "Let's find your perfect morning soundtrack",
        "Ready to energize your morning?",
      ],
      afternoon: [
        "How about some music to brighten your afternoon?",
        "Let's make this afternoon amazing",
        "Time for your afternoon music break",
      ],
      evening: [
        "Wind down with some beautiful melodies",
        "Let's create the perfect evening atmosphere",
        "Time to relax with your favorite tunes",
      ],
      night: [
        "Let's find something soothing for the night",
        "Perfect time for some chill vibes",
        "Ready for some nighttime melodies?",
      ],
    };

    let timeMessages;
    if (hour >= 5 && hour < 12) timeMessages = messages.morning;
    else if (hour >= 12 && hour < 17) timeMessages = messages.afternoon;
    else if (hour >= 17 && hour < 22) timeMessages = messages.evening;
    else timeMessages = messages.night;

    return timeMessages[Math.floor(Math.random() * timeMessages.length)];
  };

  return (
    <main className="rounded-xl overflow-hidden h-full bg-gradient-to-br from-[#1C1B29]/80 to-[#0D0C1D]/80 backdrop-blur-sm flex flex-col">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          <div className="mb-8 animate-slideInFromTop">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-shimmerText">
              {getGreeting()}
            </h1>
            <p
              className="text-base sm:text-lg text-zinc-400 animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              {getGreetingSubtext()}
            </p>
            <div
              className="mt-4 flex items-center gap-2 animate-fadeInUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-300">
                Discover • Enjoy • Share
              </span>
            </div>
          </div>

          <FeaturedSection />

          <div className="space-y-10">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending Now"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};
export default HomePage;
