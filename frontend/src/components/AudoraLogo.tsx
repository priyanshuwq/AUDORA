import { cn } from "@/lib/utils";
import AnimatedVinylLogo from "./AnimatedVinylLogo";
import { useState, useMemo, useCallback } from "react";

interface AudoraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  premium?: boolean;
  useVinylLogo?: boolean;
  isPlaying?: boolean;
}

const AudoraLogo = ({
  size = "md",
  className,
  showText = true,
  premium = true,
  useVinylLogo = false,
  isPlaying = true,
}: AudoraLogoProps) => {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
    xl: "size-12",
  };

  const textSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  // Build a small fallback chain to avoid broken image icons in case a file
  // is missing or the app is served from a non-root base path in production.
  const srcCandidates = useMemo(() => {
    const withBase = (p: string) => {
      const base = (import.meta as any)?.env?.BASE_URL || "/";
      return `${base}${p.replace(/^\//, "")}`;
    };
    const primary = premium
      ? size === "sm"
        ? "audora-logo-premium.svg"
        : "audora-logo-premium-large.svg"
      : size === "sm"
      ? "audora-logo.svg"
      : "audora-logo-large.svg";
    // Order fallbacks from closest match to most generic
    const fallbacks = premium
      ? [
          "audora-logo-premium.svg",
          "audora-logo-large.svg",
          "audora-logo.svg",
          "vinyl-logo.svg",
        ]
      : ["audora-logo-large.svg", "audora-logo.svg", "vinyl-logo.svg"];
    // Ensure unique list preserving order
    const ordered = [primary, ...fallbacks.filter((p) => p !== primary)];
    return ordered.map(withBase);
  }, [premium, size]);

  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc =
    srcCandidates[srcIndex] ??
    ((import.meta as any)?.env?.BASE_URL || "/") + "vinyl-logo.svg";

  const handleImgError = useCallback(() => {
    // Try next candidate; if exhausted, default to vinyl icon
    setSrcIndex((i) => (i + 1 < srcCandidates.length ? i + 1 : i));
  }, [srcCandidates.length]);

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      {useVinylLogo ? (
        <AnimatedVinylLogo size={size} isPlaying={isPlaying} />
      ) : (
        <img
          src={currentSrc}
          alt="Audora logo"
          width={40}
          height={40}
          loading="eager"
          decoding="async"
          onError={handleImgError}
          className={cn(
            sizeClasses[size],
            "transition-all duration-300 hover:scale-110 select-none"
          )}
        />
      )}
      {showText && (
        <span
          className={cn(
            "font-extrabold audora-font nothing-wide bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent",
            // Animations: shimmer text + soft glow; scale slightly on hover for affordance
            "motion-safe:animate-shimmerText motion-safe:animate-glow transform-gpu transition-all duration-400 hover:scale-105",
            textSizeClasses[size]
          )}
        >
          Audora
        </span>
      )}
    </div>
  );
};

export default AudoraLogo;
