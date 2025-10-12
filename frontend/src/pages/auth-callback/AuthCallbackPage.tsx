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

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempted.current) return;

      try {
        syncAttempted.current = true;
        setIsProcessing(true);

        const response = await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

        console.log("Auth callback successful:", response.data);

        // Add a slight delay before redirecting to ensure server has processed
        setTimeout(() => {
          navigate("/");
        }, 500);
      } catch (error) {
        console.error("Error in auth callback:", error);
        setError("Authentication failed. Please try again.");

        // Still navigate after a delay even if there's an error
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    syncUser();

    // Fallback navigation in case something goes wrong
    const timeout = setTimeout(() => {
      if (syncAttempted.current && isProcessing) {
        console.log("Auth callback timeout - forcing navigation");
        navigate("/");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <AudoraLogo size="lg" />
          <div className="flex items-center gap-2">
            {isProcessing ? (
              <Loader className="size-4 text-emerald-500 animate-spin" />
            ) : error ? (
              <div className="text-red-500 text-lg">⚠️</div>
            ) : (
              <div className="text-green-500 text-lg">✓</div>
            )}
            <h3 className="text-zinc-400 text-lg font-bold">
              {error ? "Authentication Error" : "Logging you in"}
            </h3>
          </div>
          <p className="text-zinc-400 text-sm">
            {error || "Redirecting to home page..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
