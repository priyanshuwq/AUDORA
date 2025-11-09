# 🐱 Oneko Cat for Audora

A cute pixel cat that follows your cursor and sleeps on your audio player!

## 🎮 How to Use

### Mouse Controls
- **Left Click + Drag**: Grab and drag the cat
- **Right Click**: Open skin picker modal to change the cat's appearance
- **Double Click**: Toggle sleep mode (cat walks to progress bar/audio player)

### Available Skins
Located in `/public/oneko/`:
- `classic` - Original black & white cat
- `dog` - Cute pixel dog
- `tora` - Tiger-striped cat
- `maia` - Pink cat variant
- `vaporwave` - Retro aesthetic cat

## 📱 Responsive Behavior

### Desktop (≥768px)
- Cat sleeps on the **progress bar** in the footer PlaybackControls
- Sits near the slider thumb when in sleep mode

### Mobile (<768px)
- Cat sleeps on the **AudioPlayer mini-player** (bottom of screen)
- Positioned at top-right of the mobile player card

## 🔧 Console Commands

Open browser DevTools and try:

```javascript
// Change skin programmatically
window.onekoChangeSkin('dog');
window.onekoChangeSkin('vaporwave');

// List available skins
window.onekoChangeSkin('invalid'); // Shows all options

// Manual localStorage control
localStorage.setItem('oneko:variant', '"tora"');
localStorage.setItem('oneko:forceSleep', true);
location.reload();
```

## 🎨 Adding Custom Skins

1. Create a sprite sheet GIF (256x256px, 8x8 grid of 32x32 sprites)
2. Name it `oneko-yourskin.gif`
3. Place in `/public/oneko/`
4. Edit `oneko.js` and add to the `variants` array:
   ```javascript
   variants = [
     ["classic", "Classic"],
     ["yourskin", "Your Custom Skin"], // Add this
   ],
   ```
5. Reload the page

## 🐛 Troubleshooting

**Cat not sleeping in correct position?**
- Ensure Audora's PlaybackControls footer is rendered
- Check browser console for element selection warnings
- Try double-clicking again to reset sleep mode

**Skin not loading?**
- Verify GIF exists in `/public/oneko/`
- Check browser Network tab for 404 errors
- Clear localStorage: `localStorage.clear()` and reload

## 🔄 Auto-Sleep on Load

The cat remembers its sleep state! If you enable sleep mode (double-click), it will automatically sleep when you reload the page.

## 📦 Credits

Based on [oneko.js](https://github.com/adryd325/oneko.js) by adryd325
Optimized for Audora music streaming app
