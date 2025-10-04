import { cn } from "@/lib/utils";

interface AnimatedVinylLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isPlaying?: boolean;
  speed?: "slow" | "normal" | "fast";
}

const AnimatedVinylLogo = ({
  size = "md",
  className,
  isPlaying = true,
  speed = "normal",
}: AnimatedVinylLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin-normal",
    fast: "animate-spin-fast",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {/* Vinyl Record */}
      <div
        className={cn(
          "w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black relative overflow-hidden shadow-xl",
          isPlaying && speedClasses[speed],
          "transition-all duration-500 hover:scale-110"
        )}
        style={{
          background: `
            radial-gradient(circle at center, 
              #ef4444 0%, 
              #ef4444 25%, 
              #1f1f1f 25.5%, 
              #1f1f1f 30%, 
              #2a2a2a 30.5%, 
              #2a2a2a 35%, 
              #1f1f1f 35.5%, 
              #1f1f1f 40%, 
              #2a2a2a 40.5%, 
              #2a2a2a 45%, 
              #1f1f1f 45.5%, 
              #1f1f1f 50%, 
              #2a2a2a 50.5%, 
              #2a2a2a 55%, 
              #1f1f1f 55.5%, 
              #1f1f1f 60%, 
              #2a2a2a 60.5%, 
              #2a2a2a 65%, 
              #1f1f1f 65.5%, 
              #1f1f1f 70%, 
              #2a2a2a 70.5%, 
              #2a2a2a 75%, 
              #1f1f1f 75.5%, 
              #1f1f1f 80%, 
              #2a2a2a 80.5%, 
              #2a2a2a 85%, 
              #1f1f1f 85.5%, 
              #1f1f1f 90%, 
              #2a2a2a 90.5%, 
              #2a2a2a 100%
            )
          `,
        }}
      >
        {/* Vinyl grooves effect */}
        <div className="absolute inset-0 rounded-full opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gray-600/20"
              style={{
                top: `${10 + i * 10}%`,
                left: `${10 + i * 10}%`,
                right: `${10 + i * 10}%`,
                bottom: `${10 + i * 10}%`,
              }}
            />
          ))}
        </div>

        {/* Center hole */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-inner" />

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

        {/* Highlight */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-white/10 rounded-full blur-sm" />
      </div>

      {/* Glow effect when playing */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
      )}
    </div>
  );
};

export default AnimatedVinylLogo;
