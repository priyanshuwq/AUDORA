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
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchSongs, fetchStats]);

  if (!isLoading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <Header />

      <div className="flex-1 overflow-y-auto mt-6 pr-2">
        <DashboardStats />

        <Tabs defaultValue="songs" className="space-y-6">
          <TabsList className="p-1 bg-zinc-800/50">
            <TabsTrigger
              value="songs"
              className="data-[state=active]:bg-zinc-700"
            >
              <Music className="mr-2 size-4" />
              Songs
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="data-[state=active]:bg-zinc-700"
            >
              <Album className="mr-2 size-4" />
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
    </div>
  );
};
export default AdminPage;
