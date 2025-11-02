# 🎨 Dynamic Theme System

## Overview
AUDORA now features a dynamic theme system that automatically extracts colors from the currently playing song's album artwork and applies them globally across the app with smooth transitions.

## How It Works

### 1. **Color Extraction**
- When a song starts playing, the system extracts the dominant colors from the album artwork
- Uses canvas API to analyze the image pixels
- Identifies primary, secondary, and accent colors

### 2. **Theme Application**
- Colors are stored as CSS variables (`--theme-primary`, `--theme-secondary`, `--theme-accent`)
- All theme-aware components automatically update with smooth 0.8s transitions
- Fallback to red theme if color extraction fails

### 3. **Theme-Aware Components**
Components using the dynamic theme:
- **Tab Navigation** - Active tabs use theme colors
- **Card Borders** - GlassCard components have theme-colored borders on hover
- **Hover Effects** - Enhanced borders and glows based on current theme
- **Search Bar** - Focus states use theme colors

## CSS Classes

### `.theme-transition`
Adds smooth transition for all theme-related properties
```css
transition: background-color 0.8s ease-in-out, 
            border-color 0.8s ease-in-out, 
            box-shadow 0.8s ease-in-out;
```

### `.theme-border`
Applies theme-colored border
```css
border-color: rgba(var(--theme-primary), 0.2);
```

### `.theme-border-hover`
Enhanced border and glow on hover
```css
border-color: rgba(var(--theme-primary), 0.4);
box-shadow: 0 0 20px rgba(var(--theme-primary), 0.1);
```

### `.theme-bg`
Theme-colored background
```css
background-color: rgba(var(--theme-primary), 0.1);
```

### `.theme-glow`
Adds glowing effect
```css
box-shadow: 0 0 30px rgba(var(--theme-primary), 0.15);
```

## Usage

### Automatic Theme Updates
Theme automatically updates when:
- A new song starts playing (`setCurrentSong`)
- An album is played (`playAlbum`)
- User switches tracks

### Manual Theme Control
```typescript
import { useThemeStore } from '@/stores/useThemeStore';

// In your component
const { colors, updateThemeFromImage, resetTheme, toggleTheme } = useThemeStore();

// Update theme from an image
await updateThemeFromImage(imageUrl);

// Reset to default red theme
resetTheme();

// Toggle theme system on/off
toggleTheme();
```

### Adding Theme to New Components
```tsx
<div className="theme-transition theme-border-hover">
  {/* Your content */}
</div>
```

## Store Location
- **Theme Store**: `/frontend/src/stores/useThemeStore.ts`
- **Color Extractor**: `/frontend/src/lib/colorExtractor.ts`
- **CSS Variables**: `/frontend/src/index.css`

## Features
✅ Automatic color extraction from album art  
✅ Smooth 0.8s transitions between themes  
✅ Fallback to default red theme  
✅ Global CSS variables for easy integration  
✅ Theme-aware card borders and hover effects  
✅ Sync with currently playing song  
✅ Performance optimized with canvas resizing  

## Performance
- Images resized to 100x100px for fast processing
- Every 4th pixel sampled for color analysis
- Runs asynchronously without blocking UI
- Cached colors prevent redundant processing

## Browser Compatibility
- Modern browsers with Canvas API support
- Graceful fallback for CORS-restricted images
- Falls back to default theme on any error

---

**Note**: The theme system respects the existing design language and enhances it rather than replacing it. The base dark theme with red accents remains, but now adapts to the music being played for a more immersive experience.
