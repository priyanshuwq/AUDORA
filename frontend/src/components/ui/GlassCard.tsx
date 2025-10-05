import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-black/20 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl hover:bg-black/40 transition-all duration-300 group cursor-pointer shadow-md hover:shadow-xl hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export default GlassCard;
