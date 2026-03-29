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

        resolve({ primary, secondary, accent });
      } catch (error) {
        resolve({
          primary: "239, 68, 68",
          secondary: "220, 38, 38",
          accent: "248, 113, 113",
        });
      }
    };

    img.onerror = () => {
      // Fallback to red theme on error
      resolve({
        primary: "239, 68, 68",
        secondary: "220, 38, 38",
        accent: "248, 113, 113",
      });
    };

    img.src = imageUrl;
  });
};
