import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    // Only fetch data if user is confirmed admin and not loading
    if (!isLoading && isAdmin) {
      fetchAlbums();
      fetchSongs();
      fetchStats();
    }
  }, [fetchAlbums, fetchSongs, fetchStats, isAdmin, isLoading]);

  if (!isLoading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-zinc-900 to-black text-zinc-100 p-2 sm:p-4 md:p-8 overflow-hidden">
      <div className="max-w-[1400px] w-full mx-auto rounded-xl sm:rounded-2xl bg-black/95 backdrop-blur-xl border border-white/5 shadow-2xl p-3 sm:p-4 md:p-6 overflow-y-auto scrollbar-hide h-[calc(100vh-1rem)] sm:h-auto">
        <Header />

        <main className="mt-4 sm:mt-6">
          <DashboardStats />

          <div className="mt-4 sm:mt-6">
            <Tabs defaultValue="songs" className="space-y-4 sm:space-y-6">
              <TabsList className="p-1 bg-zinc-800/50 rounded-md w-full sm:w-auto">
                <TabsTrigger
                  value="songs"
                  className="data-[state=active]:bg-zinc-700 flex-1 sm:flex-none text-sm"
                >
                  <Music className="mr-1 sm:mr-2 size-3 sm:size-4" />
                  Songs
                </TabsTrigger>
                <TabsTrigger
                  value="albums"
                  className="data-[state=active]:bg-zinc-700 flex-1 sm:flex-none text-sm"
                >
                  <Album className="mr-1 sm:mr-2 size-3 sm:size-4" />
                  Albums
                </TabsTrigger>
              </TabsList>

              <TabsContent value="songs">
                <SongsTabContent />
              </TabsContent>

              <TabsContent value="albums">
                <AlbumsTabContent />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
