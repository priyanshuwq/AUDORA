import { create } from "zustand";
import { extractColorsFromImage } from "@/lib/colorExtractor";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeStore {
  colors: ThemeColors;
  isTransitioning: boolean;
  isEnabled: boolean;
  updateThemeFromImage: (imageUrl: string) => Promise<void>;
  resetTheme: () => void;
  toggleTheme: () => void;
}

const defaultTheme: ThemeColors = {
  primary: "239, 68, 68", // red-500
  secondary: "220, 38, 38", // red-600
  accent: "248, 113, 113", // red-400
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  colors: defaultTheme,
  isTransitioning: false,
  isEnabled: true,

  updateThemeFromImage: async (imageUrl: string) => {
    if (!get().isEnabled) {
      console.log("⏸️ Theme system is disabled");
      return;
    }

    try {
      console.log("🎨 Starting theme update for:", imageUrl);
      set({ isTransitioning: true });

      const colors = await extractColorsFromImage(imageUrl);

      // Apply colors to CSS variables
      const root = document.documentElement;
      root.style.setProperty("--theme-primary", colors.primary);
      root.style.setProperty("--theme-secondary", colors.secondary);
      root.style.setProperty("--theme-accent", colors.accent);

      console.log("✅ Theme updated successfully:", colors);
      console.log("📍 CSS Variables set:", {
        primary: root.style.getPropertyValue("--theme-primary"),
        secondary: root.style.getPropertyValue("--theme-secondary"),
        accent: root.style.getPropertyValue("--theme-accent"),
      });

      set({ colors, isTransitioning: false });
    } catch (error) {
      console.error("❌ Failed to extract colors:", error);
      set({ isTransitioning: false });
    }
  },

  resetTheme: () => {
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", defaultTheme.primary);
    root.style.setProperty("--theme-secondary", defaultTheme.secondary);
    root.style.setProperty("--theme-accent", defaultTheme.accent);

    set({ colors: defaultTheme });
  },

  toggleTheme: () => {
    const isEnabled = !get().isEnabled;
    set({ isEnabled });

    if (!isEnabled) {
      get().resetTheme();
    }
  },
}));
