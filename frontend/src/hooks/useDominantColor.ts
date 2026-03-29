import { useEffect, useState } from "react";

interface UseDominantColorOptions {
  /** Darken factor (0-1), defaults to 0.4 for better text contrast */
  darkenFactor?: number;
  /** Default color if extraction fails */
  defaultColor?: string;
  /** Whether to update the meta theme-color tag */
  updateMetaTheme?: boolean;
  /** Default meta theme color to restore when imageUrl is null */
  defaultMetaTheme?: string;
}

/**
 * Hook to extract the dominant color from an image URL.
 * Useful for creating dynamic backgrounds based on album art.
 */
export function useDominantColor(
  imageUrl: string | undefined | null,
  options: UseDominantColorOptions = {}
) {
  const {
    darkenFactor = 0.4,
    defaultColor = "#1a1a1a",
    updateMetaTheme = false,
    defaultMetaTheme = "#ef4444",
  } = options;

  const [dominantColor, setDominantColor] = useState<string>(defaultColor);

  useEffect(() => {
    if (!imageUrl) {
      setDominantColor(defaultColor);
      if (updateMetaTheme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute("content", defaultMetaTheme);
        }
      }
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample pixels from the image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let r = 0,
          g = 0,
          b = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        // Darken the color for better text contrast
        r = Math.floor(r * darkenFactor);
        g = Math.floor(g * darkenFactor);
        b = Math.floor(b * darkenFactor);

        const color = `rgb(${r}, ${g}, ${b})`;
        setDominantColor(color);

        // Update theme-color meta tag for browser UI (mobile address bar, status bar)
        if (updateMetaTheme) {
          const metaThemeColor = document.querySelector('meta[name="theme-color"]');
          if (metaThemeColor) {
            metaThemeColor.setAttribute("content", color);
          }
        }
      } catch (error) {
        console.warn("Could not extract color:", error);
        setDominantColor(defaultColor);
      }
    };

    img.onerror = () => {
      setDominantColor(defaultColor);
    };
  }, [imageUrl, darkenFactor, defaultColor, updateMetaTheme, defaultMetaTheme]);

  return dominantColor;
}

export default useDominantColor;
