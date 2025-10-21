# Mobile Fullscreen Player - Spotify-Style

## Overview
A beautiful, immersive fullscreen player for mobile devices inspired by Spotify's mobile player, with custom effects based on the album cover art.

## Features

### 🎨 Visual Effects
1. **Dynamic Color Extraction & Theme Integration**
   - Automatically extracts dominant color from album artwork
   - Creates gradient backgrounds that match the song's vibe
   - Smooth color transitions between songs
   - **Updates browser theme color** - Mobile status bar & address bar match the album art
   - Restores default theme when player closes
   - **AUDORA red theme accents** throughout the UI

2. **Blurred Background**
   - Album artwork is used as a blurred background
   - Creates depth and immersion
   - Animates and pulses with the music

3. **Glow Effects**
   - Animated glow effect around album art
   - Intensity increases when playing
   - Uses colors extracted from the cover
   - **Red glow shadow** on album art when playing

4. **Vinyl Effect**
   - Subtle spinning gradient overlay when playing
   - Simulates vinyl record aesthetic
   - Scales album art when playing for visual feedback
   - **Red tint** in vinyl overlay for brand consistency

### 🤹 Interactions

1. **Swipe Down to Dismiss**
   - Natural gesture to close the player
   - Smooth drag animation with opacity fade
   - Requires >150px swipe to dismiss
   - Visual feedback during drag

2. **Tap to Expand**
   - Mini player in bottom of screen
   - Single tap opens fullscreen
   - Smooth slide-up animation

3. **Touch-Optimized Controls**
   - Large touch targets (44px minimum)
   - Smooth animations on press
   - Visual feedback on all interactions
   - **Haptic feedback** - Vibration on button taps and gestures

### 🎵 Player Features

1. **Large Album Art**
   - Centered, maximum size display
   - Rounded corners with shadow
   - Animated transformations

2. **Progress Bar**
   - Clean, minimal design with **red gradient fill**
   - Easy to scrub through song
   - Time indicators on both ends
   - **Subtle red glow effect** on progress bar

3. **Playback Controls**
   - Large, centered **red gradient play/pause button** with glow
   - Skip forward/backward buttons with **red hover states**
   - Shuffle and repeat options with **red accents**
   - All controls scale-on-hover for feedback
   - **Red theme throughout** for brand consistency

4. **Up Next Queue**
   - Slide-up overlay showing queue with **red hover states**
   - Tap to play any song
   - **Red border and background** for current song
   - **Red animated music bars** for playing track
   - Red text highlight on active song

5. **Like Button**
   - Heart icon with fill animation
   - Remembers liked status
   - Visual feedback on tap

### 📱 Mobile Optimizations

1. **Safe Area Support**
   - Respects notches and home indicators
   - Dynamic padding for iOS devices
   - Works on all modern mobile devices

2. **Native Browser Integration**
   - **Dynamic theme-color** updates mobile browser UI
   - Status bar matches album artwork colors
   - Immersive full-app experience
   - Restores default red theme (#ef4444) on close
   - **Haptic feedback (vibration)** for tactile button responses

3. **Performance**
   - Smooth 60fps animations
   - Optimized color extraction
   - Efficient re-renders

4. **Responsive**
   - Only shows on mobile (<768px)
   - Desktop uses different player
   - Adapts to all screen sizes

## Components

### MobileFullscreenPlayer.tsx
```typescript
Location: frontend/src/layout/components/MobileFullscreenPlayer.tsx
```

**Key Features:**
- Color extraction from album art using Canvas API
- Swipe gesture handling with drag offset
- Dynamic gradient backgrounds
- Animated effects (glow, spin, scale)
- Queue management overlay
- Progress bar with seek functionality

### Integration Points

1. **MainLayout.tsx**
   - Conditionally renders based on screen size
   - Replaces desktop FullPlayer on mobile
   - Integrated with existing audio player

2. **AudioPlayer.tsx**
   - Mini player for mobile
   - Opens fullscreen on tap
   - Shows current song and basic controls

3. **usePlayerStore**
   - State management for fullscreen mode
   - Sync between mini and fullscreen player
   - Queue and playback state

## Animations

All animations defined in `index.css`:

### Keyframes Used:
- `musicBar` - Animated bars for "now playing" indicator
- `spin-slow` - Vinyl rotation effect
- `fadeInUp` - Element entrance animation
- `slideInFromTop` - Header slide in

### CSS Classes:
- `animate-musicBar` - Bouncing bars animation
- `animate-spin-slow` - 4s rotation (vinyl effect)
- `transition-transform` - Smooth scale/transform
- `transition-opacity` - Fade effects

## Color Extraction Algorithm

```typescript
// Samples pixels from album art
// Calculates average RGB values
// Darkens by 60% for text contrast
// Applies as gradient background
```

**Process:**
1. Load image with CORS support
2. Draw to canvas
3. Sample pixels from imageData
4. Calculate average RGB
5. Darken for contrast (60% darker)
6. Set as CSS custom property for background
7. Update `<meta name="theme-color">` for browser UI

## AUDORA Theme Integration

The mobile player features AUDORA's signature **red theme color (#ef4444)** throughout the interface:

**Red Accents Applied To:**
- **Play/Pause Button** - Red gradient (from-red-500 to-red-600) with glowing shadow
- **Progress Bar** - Red gradient fill with subtle glow effect
- **Control Buttons** - Red hover states (text-red-400, bg-red-500/10)
  - Skip Previous/Next
  - Shuffle & Repeat
  - Queue button
- **Header Text** - "Playing from Library" in red-400/80
- **Queue Interface**
  - Active song has red border and background (bg-red-500/20, border-red-500/30)
  - Red text for current song title
  - Red animated music bars (bg-red-500)
  - Red hover effect on song items (active:bg-red-500/10)
- **Album Art Effects**
  - Red shadow glow when playing (shadow-[0_0_40px_rgba(239,68,68,0.3)])
  - Red tint in vinyl spinning overlay (via-red-500/10)

**Visual Consistency:**
- All interactive elements use red as the primary accent color
- Hover states transition to red for clear feedback
- Active/playing states highlighted with red
- Maintains AUDORA brand identity throughout the experience

## Haptic Feedback System

The player provides tactile vibration feedback for enhanced touch interactions:

**Vibration Levels:**
- **Light (10ms)** - Subtle feedback for secondary actions
  - Close button tap
  - Menu button tap
  - Shuffle/Repeat toggles
  - Queue open/close
- **Medium (20ms)** - Moderate feedback for navigation
  - Skip forward/backward
  - Song selection from queue
  - Like button tap
  - Swipe-down dismiss
- **Heavy (40ms)** - Strong feedback for primary actions
  - Play/Pause button tap

**Browser Support:**
- Uses Web Vibration API (`navigator.vibrate`)
- Gracefully degrades on unsupported devices
- No errors thrown if vibration unavailable

## User Experience

### Opening Flow:
1. User sees mini player at bottom
2. Taps anywhere on mini player
3. Fullscreen smoothly slides up
4. Album art and colors animate in
5. All controls become available

### Closing Flow:
1. User swipes down from anywhere
2. Visual drag feedback follows finger
3. If dragged >150px, dismisses
4. Smooth slide down animation
5. Returns to mini player

### While Playing:
1. Album art has animated glow
2. Vinyl rotation effect active
3. Progress bar updates smoothly
4. Music bars animate on current track
5. Colors pulse subtly

## Customization

### Easy to Modify:

**Colors:**
```typescript
// Change glow intensity
className="opacity-40" // -> opacity-60 for stronger

// Adjust gradient darkness
r = Math.floor(r * 0.4); // -> 0.3 for darker, 0.5 for lighter
```

**Animations:**
```css
/* Speed up vinyl rotation */
animation: spin-slow 4s /* -> 2s for faster */

/* Adjust scale on play */
scale-105 /* -> scale-110 for more dramatic */
```

**Swipe Sensitivity:**
```typescript
if (dragOffset > 150) // -> 100 for easier dismiss
```

## Browser Support

- ✅ iOS Safari 12+
- ✅ Chrome Mobile 80+
- ✅ Firefox Mobile 80+
- ✅ Samsung Internet 12+
- ✅ All modern mobile browsers

## Performance Considerations

1. **Color Extraction** - Cached per song
2. **DOM Updates** - Debounced progress updates
3. **Animations** - GPU-accelerated transforms
4. **Images** - Loaded with appropriate sizes

## Future Enhancements

Potential additions:
- [ ] Visualizer / waveform
- [ ] Gesture for volume control
- [ ] 3D tilt effects on album art
- [ ] Custom color themes per song
- [ ] Share current song
- [ ] Add to playlist from player
- [ ] More detailed queue editing

## Troubleshooting

### Issue: Colors not extracting
**Solution:** Ensure album art is served with CORS headers

### Issue: Swipe not working
**Solution:** Check for event propagation stoppage in parent components

### Issue: Animations stuttering
**Solution:** Reduce animation complexity or use `will-change` CSS property

## Code Structure

```
MobileFullscreenPlayer/
├── Main container (fixed fullscreen)
├── Blurred background layer
├── Content wrapper
│   ├── Header (close, info, menu)
│   ├── Album art section
│   │   ├── Glow effect
│   │   ├── Cover image
│   │   └── Vinyl overlay
│   ├── Song info
│   ├── Progress bar
│   ├── Control buttons
│   ├── Secondary controls
│   └── Queue button
└── Queue overlay (conditional)
```

## Credits

Inspired by:
- Spotify Mobile Player
- Apple Music iOS App
- YouTube Music Mobile

Customized for AUDORA with unique visual identity and interactions.

---

**Last Updated:** 2025-01-21
**Component Version:** 1.0.0
**Status:** ✅ Production Ready
