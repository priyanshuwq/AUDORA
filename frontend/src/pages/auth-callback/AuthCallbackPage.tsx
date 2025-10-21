import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AudoraLogo from "@/components/AudoraLogo";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) {
        console.log("⏳ Clerk not loaded yet...");
        return;
      }

      if (!user) {
        console.log("⚠️ No user found, redirecting to home...");
        navigate("/");
        return;
      }

      if (syncAttempted.current) return;

      try {
        syncAttempted.current = true;
        setIsProcessing(true);
        setError(null);

        console.log("🔐 Syncing user with backend:", user.id);

        const response = await axiosInstance.post(
          "/auth/callback",
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          },
          {
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data.success) {
          console.log("✅ Auth callback successful");
          
          // Add a slight delay before redirecting to ensure everything is ready
          setTimeout(() => {
            navigate("/");
          }, 300);
        } else {
          throw new Error("Server returned unsuccessful response");
        }
      } catch (error: any) {
        console.error("❌ Error in auth callback:", error);

        // Retry logic for network errors
        if (retryCount < maxRetries && error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
          console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`);
          setRetryCount(retryCount + 1);
          syncAttempted.current = false; // Allow retry
          
          // Exponential backoff
          setTimeout(() => {
            setIsProcessing(true);
          }, 1000 * (retryCount + 1));
          return;
        }

        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Authentication failed";
        
        setError(errorMessage);

        // Navigate to home after showing error
        setTimeout(() => {
          console.log("➡️ Redirecting to home despite error");
          navigate("/");
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    syncUser();

    // Fallback navigation to prevent being stuck
    const timeout = setTimeout(() => {
      if (isProcessing) {
        console.log("⏱️ Auth callback timeout - forcing navigation");
        navigate("/");
      }
    }, 15000); // 15 second fallback

    return () => clearTimeout(timeout);
  }, [isLoaded, user, navigate, retryCount]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <AudoraLogo size="lg" />
          <div className="flex items-center gap-2">
            {isProcessing ? (
              <Loader className="size-6 text-emerald-500 animate-spin" />
            ) : error ? (
              <div className="text-red-500 text-2xl">⚠️</div>
            ) : (
              <div className="text-green-500 text-2xl">✓</div>
            )}
            <h3 className="text-white text-xl font-bold">
              {error ? "Authentication Error" : "Logging you in"}
            </h3>
          </div>
          
          {retryCount > 0 && (
            <p className="text-zinc-500 text-sm">
              Retry {retryCount}/{maxRetries}
            </p>
          )}
          
          <p className="text-zinc-400 text-sm text-center">
            {error ? (
              <>
                {error}
                <br />
                <span className="text-zinc-500">Redirecting...</span>
              </>
            ) : (
              "Please wait while we set up your account..."
            )}
          </p>

          {!isLoaded && (
            <p className="text-zinc-600 text-xs">
              Initializing authentication...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
