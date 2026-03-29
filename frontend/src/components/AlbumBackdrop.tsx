import { useEffect, useState } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { getMediaUrl } from "@/lib/mediaUrl";

const AlbumBackdrop = () => {
  const { currentSong } = usePlayerStore();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const imageUrl = currentSong?.imageUrl ? getMediaUrl(currentSong.imageUrl) : null;
    if (imageUrl && imageUrl !== currentImage) {
      // Start transition
      setIsTransitioning(true);
      setPreviousImage(currentImage);
      
      // Small delay to ensure transition starts
      setTimeout(() => {
        setCurrentImage(imageUrl);
      }, 50);

      // Reset transition after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousImage(null);
      }, 2000); // Match CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [currentSong?.imageUrl, currentImage]);

  if (!currentImage && !previousImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Previous image - fades out */}
      {previousImage && (
        <div
          className="absolute inset-0"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 2s ease-out",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${previousImage})`,
              filter: "blur(80px) brightness(0.5)",
            }}
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}

      {/* Current image - radially expands and fades in */}
      {currentImage && (
        <div
          className="absolute inset-0"
          style={{
            opacity: isTransitioning ? 1 : previousImage ? 0 : 1,
            transform: isTransitioning ? "scale(1)" : "scale(0.75)",
            transformOrigin: "center 85%", // Origin from bottom center (near player controls)
            transition: "opacity 2s ease-out, transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentImage})`,
              filter: "blur(80px) brightness(0.5)",
            }}
          />
          {/* Overlay to reduce intensity for text readability */}
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}
    </div>
  );
};

export default AlbumBackdrop;
