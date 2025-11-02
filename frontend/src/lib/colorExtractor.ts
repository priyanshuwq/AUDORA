/**
 * Extract dominant colors from an image URL
 */
export const extractColorsFromImage = async (
  imageUrl: string
): Promise<{
  primary: string;
  secondary: string;
  accent: string;
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    // Handle CORS - try without crossOrigin first for local images
    if (!imageUrl.startsWith('http://localhost') && !imageUrl.startsWith('/')) {
      img.crossOrigin = "anonymous";
    }
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        
        if (!ctx) {
          console.warn("Could not get canvas context, using default theme");
          resolve({
            primary: "239, 68, 68",
            secondary: "220, 38, 38",
            accent: "248, 113, 113",
          });
          return;
        }

        // Resize for performance
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;
        
        console.log("🎨 Extracting colors from image:", imageUrl);

        // Color buckets
        const colorMap: Map<string, number> = new Map();
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < pixels.length; i += 16) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent and very dark/light pixels
          if (a < 125 || (r + g + b < 50) || (r + g + b > 700)) continue;

          // Bucket similar colors
          const bucket = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
          colorMap.set(bucket, (colorMap.get(bucket) || 0) + 1);
        }

        // Get most common colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([color]) => color);

        if (sortedColors.length === 0) {
          // Fallback to red theme
          resolve({
            primary: "239, 68, 68",
            secondary: "220, 38, 38",
            accent: "248, 113, 113",
          });
          return;
        }

        // Get primary, secondary, and accent colors
        const primary = sortedColors[0] || "239, 68, 68";
        const secondary = sortedColors[1] || sortedColors[0] || "220, 38, 38";
        const accent = sortedColors[2] || sortedColors[0] || "248, 113, 113";

        console.log("✅ Colors extracted:", { primary, secondary, accent });
        resolve({ primary, secondary, accent });
      } catch (error) {
        console.error("❌ Error extracting colors:", error);
        resolve({
          primary: "239, 68, 68",
          secondary: "220, 38, 38",
          accent: "248, 113, 113",
        });
      }
    };

    img.onerror = (error) => {
      console.warn("⚠️ Image load error, using default theme:", error);
      // Fallback to red theme on error
      resolve({
        primary: "239, 68, 68",
        secondary: "220, 38, 38",
        accent: "248, 113, 113",
      });
    };

    img.src = imageUrl;
    console.log("🔄 Loading image for color extraction:", imageUrl);
  });
};

/**
 * Convert RGB string to HSL for better color manipulation
 */
export const rgbToHsl = (rgb: string): { h: number; s: number; l: number } => {
  const [r, g, b] = rgb.split(",").map((n) => parseInt(n.trim()) / 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Lighten or darken a color
 */
export const adjustLightness = (rgb: string, amount: number): string => {
  const [r, g, b] = rgb.split(",").map((n) => parseInt(n.trim()));
  
  const adjust = (value: number) => {
    const adjusted = value + amount;
    return Math.max(0, Math.min(255, adjusted));
  };

  return `${adjust(r)}, ${adjust(g)}, ${adjust(b)}`;
};
