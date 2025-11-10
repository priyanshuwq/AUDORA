import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BouncingBall from "@/components/BouncingBall";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const maxRetries = 3;

  useEffect(() => {
    // Trigger entrance animation
    const enter = setTimeout(() => setVisible(true), 20);

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

        // Retry logic for network errors (with correct operator grouping)
        if (retryCount < maxRetries && (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK")) {
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
        
        console.error("Auth error:", errorMessage);

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
    // cleanup entrance timer
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => clearTimeout(enter);
  }, [isLoaded, user, navigate, retryCount]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <div
        className={`transform transition-all duration-450 ease-out ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <BouncingBall size="lg" />
      </div>
    </div>
  );
};

export default AuthCallbackPage;
