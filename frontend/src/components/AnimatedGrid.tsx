import React, { useEffect, useRef, useState } from "react";
import { Song } from "@/types";

interface AnimatedGridProps {
  songs: Song[];
  renderItem: (song: Song, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  songs,
  renderItem,
  className = "",
  columns = { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Build the grid columns class based on the columns prop
  const gridColsClass = [
    `grid-cols-${columns.xs || 2}`,
    `sm:grid-cols-${columns.sm || 3}`,
    `md:grid-cols-${columns.md || 4}`,
    `lg:grid-cols-${columns.lg || 5}`,
    `xl:grid-cols-${columns.xl || 6}`,
  ].join(" ");

  return (
    <div
      ref={gridRef}
      className={`grid ${gridColsClass} gap-3 sm:gap-4 md:gap-6 ${className}`}
    >
      {songs.map((song, index) => (
        <div
          key={song._id}
          className={`transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}
        >
          {renderItem(song, index)}
        </div>
      ))}
    </div>
  );
};

export default AnimatedGrid;
