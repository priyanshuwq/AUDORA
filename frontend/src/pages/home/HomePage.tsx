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

  const getSalutation = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return `Good morning`;
    if (hour >= 12 && hour < 17) return `Good afternoon`;
    if (hour >= 17 && hour < 22) return `Good evening`;
    return `Good night`;
  };

  const getUserName = () => {
    return user?.firstName || user?.fullName?.split(" ")[0] || "there";
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

  // Golden Ratio (φ) for perfect visual harmony
  const phi = 1.618033988749;
  
  // Calculate responsive golden ratio sizes
  const getGoldenSizes = () => {
    // Base sizes that work well across devices
    const baseSalutation = {
      mobile: 28,      // Smaller screens
      tablet: 36,      // Medium screens
      desktop: 44,     // Large screens
    };
    
    return {
      mobile: {
        salutation: baseSalutation.mobile,
        name: baseSalutation.mobile * phi,
      },
      tablet: {
        salutation: baseSalutation.tablet,
        name: baseSalutation.tablet * phi,
      },
      desktop: {
        salutation: baseSalutation.desktop,
        name: baseSalutation.desktop * phi,
      },
    };
  };

  const goldenSizes = getGoldenSizes();

  return (
    <main className="rounded-2xl overflow-hidden h-full bg-black/95 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col mb-32 md:mb-0">
      <Topbar />
      <ScrollArea className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
          <div className="mb-6 sm:mb-8 animate-slideInFromTop">
            <h1 className="mb-3 sm:mb-4">
              {/* Salutation with golden ratio sizing */}
              <span
                className="block font-extrabold text-zinc-200 leading-tight transition-all duration-300"
                style={{
                  fontSize: `${goldenSizes.mobile.salutation}px`,
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .golden-salutation {
                      font-size: ${goldenSizes.tablet.salutation}px !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .golden-salutation {
                      font-size: ${goldenSizes.desktop.salutation}px !important;
                    }
                  }
                `}</style>
                <span className="golden-salutation">{getSalutation()}</span>
              </span>
              
              {/* Username with golden ratio sizing (φ times salutation) */}
              <span
                className="block font-bold mt-2 bg-gradient-to-r from-red-400 via-rose-300 to-white bg-clip-text text-transparent tracking-tight leading-none transition-all duration-300"
                style={{
                  fontSize: `${goldenSizes.mobile.name}px`,
                }}
              >
                <style>{`
                  @media (min-width: 640px) {
                    .golden-name {
                      font-size: ${goldenSizes.tablet.name}px !important;
                    }
                  }
                  @media (min-width: 1024px) {
                    .golden-name {
                      font-size: ${goldenSizes.desktop.name}px !important;
                    }
                  }
                `}</style>
                <span className="golden-name">{getUserName()}</span>
              </span>
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl text-zinc-300/90 leading-relaxed max-w-2xl animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              {getGreetingSubtext()}
            </p>
            <div
              className="mt-3 sm:mt-4 flex items-center gap-3 animate-fadeInUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base text-red-300 tracking-normal">
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