import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import BouncingBall from "@/components/BouncingBall";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Wait for Clerk to load
        if (!isLoaded) {
          console.log("⏳ Waiting for Clerk to load...");
          return;
        }

        console.log("🔐 Initializing authentication...");
        
        const token = await getToken();
        updateApiToken(token);
        
        if (token) {
          console.log("✅ Token obtained, checking admin status...");
          await checkAdminStatus();
        } else {
          console.log("ℹ️ No token - user not authenticated");
        }
      } catch (error: any) {
        console.error("❌ Error in auth provider:", error.message);
        updateApiToken(null);
        
        // Don't block app if auth check fails
        // User can still access public routes
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken, checkAdminStatus, isLoaded]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-4">
        <BouncingBall size="md" />
        <p className="text-zinc-400 text-sm">Loading your session...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
