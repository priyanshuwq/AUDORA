import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface VinylLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  className?: string;
  showText?: boolean;
  syncWithPlayer?: boolean;
  speed?: "slow" | "normal" | "fast";
  textColor?: string;
}

const VinylLogo = ({
  size = "md",
  className,
  showText = true,
  syncWithPlayer = true,
  speed = "normal",
  textColor,
}: VinylLogoProps) => {
  const { isPlaying } = usePlayerStore();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
    xxl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
    xxl: "text-6xl",
  };

  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin-normal",
    fast: "animate-spin-fast",
  };

  const shouldSpin = syncWithPlayer ? isPlaying : true;

  return (
    <div className={cn("flex gap-3 items-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Vinyl Record */}
        <div
          className={cn(
            "w-full h-full rounded-full relative overflow-hidden shadow-2xl border border-gray-700/30",
            shouldSpin && speedClasses[speed],
            "transition-all duration-500 hover:scale-105 cursor-pointer"
          )}
          style={{
            background: `
              radial-gradient(circle at center, 
                #ef4444 0%, 
                #ef4444 24%, 
                #1a1a1a 25%, 
                #1a1a1a 26%, 
                #2d2d2d 27%, 
                #1a1a1a 28%, 
                #2d2d2d 29%, 
                #1a1a1a 30%, 
                #2d2d2d 31%, 
                #1a1a1a 32%, 
                #2d2d2d 33%, 
                #1a1a1a 34%, 
                #2d2d2d 35%, 
                #1a1a1a 36%, 
                #2d2d2d 37%, 
                #1a1a1a 38%, 
                #2d2d2d 39%, 
                #1a1a1a 40%, 
                #2d2d2d 41%, 
                #1a1a1a 42%, 
                #2d2d2d 43%, 
                #1a1a1a 44%, 
                #2d2d2d 45%, 
                #1a1a1a 46%, 
                #2d2d2d 47%, 
                #1a1a1a 48%, 
                #2d2d2d 49%, 
                #1a1a1a 50%, 
                #2d2d2d 51%, 
                #1a1a1a 52%, 
                #2d2d2d 53%, 
                #1a1a1a 54%, 
                #2d2d2d 55%, 
                #1a1a1a 56%, 
                #2d2d2d 57%, 
                #1a1a1a 58%, 
                #2d2d2d 59%, 
                #1a1a1a 60%, 
                #2d2d2d 61%, 
                #1a1a1a 62%, 
                #2d2d2d 63%, 
                #1a1a1a 64%, 
                #2d2d2d 65%, 
                #1a1a1a 66%, 
                #2d2d2d 67%, 
                #1a1a1a 68%, 
                #2d2d2d 69%, 
                #1a1a1a 70%, 
                #2d2d2d 71%, 
                #1a1a1a 72%, 
                #2d2d2d 73%, 
                #1a1a1a 74%, 
                #2d2d2d 75%, 
                #1a1a1a 76%, 
                #2d2d2d 77%, 
                #1a1a1a 78%, 
                #2d2d2d 79%, 
                #1a1a1a 80%, 
                #2d2d2d 81%, 
                #1a1a1a 82%, 
                #2d2d2d 83%, 
                #1a1a1a 84%, 
                #2d2d2d 85%, 
                #1a1a1a 86%, 
                #2d2d2d 87%, 
                #1a1a1a 88%, 
                #2d2d2d 89%, 
                #1a1a1a 90%, 
                #2d2d2d 91%, 
                #1a1a1a 92%, 
                #2d2d2d 93%, 
                #1a1a1a 94%, 
                #2d2d2d 95%, 
                #1a1a1a 96%, 
                #2d2d2d 97%, 
                #1a1a1a 98%, 
                #2d2d2d 99%, 
                #1a1a1a 100%
              )
            `,
          }}
        >
          {/* Center hole */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-inner border border-red-700" />

          {/* Label reflection */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-tr from-red-600/80 to-red-400/60 rounded-full" />

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent transform rotate-45" />

          {/* Top highlight */}
          <div className="absolute top-2 left-1/3 w-4 h-2 bg-white/20 rounded-full blur-sm transform -rotate-12" />
        </div>

        {/* Glow effect when playing */}
        {shouldSpin && (
          <div className="absolute inset-0 rounded-full bg-red-600/20 animate-pulse -z-10" />
        )}
      </div>

      {showText && (
        <span
          className={cn(
            "font-extrabold audora-font uppercase tracking-tight",
            // allow overriding text color via prop (e.g., text-red-400 on nav bar)
            // default to red-600 to make the brand name stand out; callers can override
            textColor || "text-red-600",
            textSizeClasses[size],
            // subtle entrance + shimmer + glow, respect user's motion settings
            "motion-safe:animate-shimmerText motion-safe:animate-glow motion-safe:animate-fadeInUp transition-transform duration-300",
            "hover:scale-105"
          )}
        >
          AUDORA
        </span>
      )}
    </div>
  );
};

export default VinylLogo;
