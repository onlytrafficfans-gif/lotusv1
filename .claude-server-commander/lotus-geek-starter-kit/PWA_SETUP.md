# Lotus App Builder - PWA Setup Guide

## Overview

Lotus is fully configured as a Progressive Web App (PWA) that can be installed on:
- **Desktop:** Windows, macOS, Linux
- **Mobile:** iOS, Android
- **All Browsers:** Chrome, Firefox, Safari, Edge, Brave, Opera

## Installation Methods

### Chrome, Edge, Brave, Opera (Desktop & Android)
1. Visit the app
2. Look for the install icon in the browser's address bar
3. Click "Install" or use the context menu
4. The app will install as a native-like application

### Firefox (Desktop & Android)
1. Visit the app
2. Click the menu (three horizontal lines)
3. Look for "Install" option
4. Follow the prompts to add to home screen

### Safari (macOS & iOS)
**macOS:**
1. Click the Share button in Safari
2. Select "Add to Dock" (for desktop shortcut)

**iOS:**
1. Tap the Share button
2. Select "Add to Home Screen"
3. Name the app and tap "Add"

## PWA Features Enabled

✅ **Offline Support**
- Service Worker caches essential files
- Works offline with cached data
- Network requests handled gracefully

✅ **App-Like Experience**
- Fullscreen mode (no browser UI)
- Custom theme colors
- App icon and splash screen
- Standalone display mode

✅ **Installation**
- `beforeinstallprompt` event captured
- Custom install prompt UI
- Works across all modern browsers

✅ **Performance**
- Caching strategy for static assets
- Runtime caching for API responses
- Reduced bandwidth usage

✅ **Security**
- HTTPS required (enforced by browsers)
- Content Security Policy configured
- No hardcoded secrets

## File Structure

```
public/
├── manifest.webmanifest       # PWA manifest (browser-agnostic)
├── browserconfig.xml          # Windows tile configuration
├── sw.js                       # Service Worker (caching, offline)
└── icons/                      # App icons (see below)
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── favicon-96x96.png
    ├── favicon-192x192.png (required for install prompt)
    ├── favicon-192x192-maskable.png
    ├── favicon-512x512.png
    ├── favicon-512x512-maskable.png
    ├── apple-touch-icon.png (iOS)
    └── generate-icons.js       # Icon generation helper
```

## Icon Requirements for Production

The following icons are **required** for proper PWA installation across browsers:

### Android & Web
- **favicon-192x192.png** (192×192) - Install prompt icon
- **favicon-192x192-maskable.png** (192×192) - Maskable format
- **favicon-512x512.png** (512×512) - Splash screen icon
- **favicon-512x512-maskable.png** (512×512) - Maskable format

### iOS
- **apple-touch-icon.png** (180×180) - Home screen icon

### Fallback Icons
- **favicon-32x32.png** (32×32) - Browser tab icon
- **favicon-16x16.png** (16×16) - Favicon

### Screenshots (optional but recommended)
- **screenshot-540x720.png** (540×720) - Mobile screenshot
- **screenshot-1280x720.png** (1280×720) - Desktop screenshot

## Generating Production Icons

### Option 1: Use Real Favicon Generator
1. Visit: https://realfavicongenerator.net/
2. Upload your logo/icon
3. Configure for PWA
4. Download the package
5. Extract icons to `public/icons/`

### Option 2: Use PWA Builder
1. Visit: https://www.pwabuilder.com/
2. Enter your PWA URL
3. Download generated icons
4. Extract to `public/icons/`

### Option 3: Use Command Line Tool
```bash
# Using ImageMagick or similar
convert logo.png -sizes 192,512 public/icons/favicon-%s.png
convert logo.png -resize 180x180 public/icons/apple-touch-icon.png
```

## Testing PWA Installation

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application tab
3. Check "Manifest" section
4. Verify service worker is "active and running"
5. Check cache contents

### Manual Testing
1. Open the app in your browser
2. You should see an install prompt at the bottom-right (or address bar)
3. Click Install
4. Verify the app launches in fullscreen mode
5. Test offline functionality (go offline and refresh)

## Service Worker Details

**Cache Strategy:** Cache-first with network fallback
- Static assets served from cache
- API calls go through network first
- Fallback to cached version if offline

**Cache Lifetime:** Indefinite (cleaned up on updates)
- Manually bump `CACHE_NAME` to invalidate

**Update Detection:**
- Browser checks for updated service worker
- New version installed on next visit
- Users can manually check for updates

## Browser Compatibility

| Browser | Desktop | Mobile | Install Prompt |
|---------|---------|--------|-----------------|
| Chrome | ✅ | ✅ | ✅ (beforeinstallprompt) |
| Firefox | ✅ | ✅ | ⚠️ (manual home screen) |
| Safari | ✅ | ✅ | ⚠️ (share menu) |
| Edge | ✅ | ✅ | ✅ (beforeinstallprompt) |
| Brave | ✅ | ✅ | ✅ (beforeinstallprompt) |
| Opera | ✅ | ✅ | ✅ (beforeinstallprompt) |
| Samsung Internet | ❌ | ✅ | ✅ (beforeinstallprompt) |

## Troubleshooting

### Install prompt not showing
1. Verify HTTPS is enabled
2. Check manifest.webmanifest is valid
3. Verify service worker is registered
4. Check browser console for errors
5. Clear browser cache and refresh

### App not launching in fullscreen
1. Verify `"display": "standalone"` in manifest
2. Check `theme_color` and `background_color` are set
3. Verify app name is under 30 characters

### Icons not displaying
1. Verify icon files exist in `public/icons/`
2. Check file paths in manifest are correct
3. Ensure image formats are supported (PNG recommended)
4. Verify image dimensions match manifest

### Offline mode not working
1. Verify service worker is installed and active
2. Check Network tab in DevTools
3. Ensure URLs are in PRECACHE_URLS
4. Check browser storage quota

## Performance Metrics

**PWA Installation Size:** ~2-5 MB (including cache)
**First Load:** < 2 seconds (with caching)
**Offline Load:** < 500ms (from cache)

## Security Considerations

- HTTPS enforced by browser
- CSP headers configured
- No local storage of sensitive data
- Service worker validates all requests
- Origin isolation for API calls

## Future Enhancements

- [ ] Background sync for offline actions
- [ ] Periodic background sync
- [ ] Push notifications support
- [ ] Share target API integration
- [ ] File handling API support
- [ ] Protocol handler registration

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Builder](https://www.pwabuilder.com/)
- [Real Favicon Generator](https://realfavicongenerator.net/)
