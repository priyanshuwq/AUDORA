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
    <main className="rounded-none sm:rounded-xl overflow-hidden h-full bg-zinc-950/90 backdrop-blur-sm flex flex-col mb-32 md:mb-0">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
          <div className="mb-6 sm:mb-8 animate-slideInFromTop">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 tracking-normal text-white">
              {getGreeting()}
            </h1>
            <p
              className="text-sm sm:text-base text-zinc-400 animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              {getGreetingSubtext()}
            </p>
            <div
              className="mt-3 sm:mt-4 flex items-center gap-2 animate-fadeInUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-red-300 tracking-normal">
                Discover • Enjoy • Share
              </span>
            </div>
          </div>

          <FeaturedSection />

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
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
