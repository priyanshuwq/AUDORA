import { cn } from "@/lib/utils";

interface AudoraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  premium?: boolean;
}

const AudoraLogo = ({
  size = "md",
  className,
  showText = true,
  premium = false,
}: AudoraLogoProps) => {
  const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
    xl: "size-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const logoSrc = premium
    ? size === "sm" || size === "md"
      ? "/audora-vinyl-logo-premium.svg"
      : "/audora-vinyl-logo-premium-large.svg"
    : size === "sm" || size === "md"
    ? "/audora-vinyl-logo.svg"
    : "/audora-vinyl-logo-large.svg";

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <img
        src={logoSrc}
        alt="AUDORA Logo"
        className={cn(
          sizeClasses[size],
          "transition-all duration-300 hover:scale-110"
        )}
      />
      {showText && (
        <span
          className={cn(
            "font-bold text-white tracking-wide",
            textSizeClasses[size]
          )}
        >
          AUDORA
        </span>
      )}
    </div>
  );
};

export default AudoraLogo;
