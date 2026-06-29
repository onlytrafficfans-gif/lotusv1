#!/usr/bin/env node
/**
 * PWA Icon Generator
 * Generates placeholder icons for PWA manifest
 *
 * Run: node public/icons/generate-icons.js
 *
 * For production, replace with actual icon files:
 * - favicon-16x16.png (16x16)
 * - favicon-32x32.png (32x32)
 * - favicon-192x192.png (192x192)
 * - favicon-192x192-maskable.png (192x192 maskable)
 * - favicon-512x512.png (512x512)
 * - favicon-512x512-maskable.png (512x512 maskable)
 * - apple-touch-icon.png (180x180)
 * - screenshot-540x720.png (540x720)
 * - screenshot-1280x720.png (1280x720)
 */

const fs = require('fs');
const path = require('path');

// Simple SVG icon templates
const iconTemplates = {
  small: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1a1a1a"/>
    <text x="16" y="22" font-size="18" font-weight="bold" text-anchor="middle" fill="#d4a574" font-family="system-ui">L</text>
  </svg>`,

  medium: `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
    <rect width="192" height="192" fill="#1a1a1a"/>
    <circle cx="96" cy="96" r="85" fill="none" stroke="#d4a574" stroke-width="4"/>
    <text x="96" y="120" font-size="100" font-weight="bold" text-anchor="middle" fill="#d4a574" font-family="system-ui">L</text>
  </svg>`,

  large: `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#d4a574;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#a0825d;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="#0a0a08"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="url(#grad)" stroke-width="12"/>
    <text x="256" y="340" font-size="280" font-weight="bold" text-anchor="middle" fill="url(#grad)" font-family="system-ui">L</text>
  </svg>`
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname);
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('📱 PWA Icon Generator');
console.log('====================\n');

// Note: This is a placeholder generator.
// For production, use a proper icon generation tool like:
// - https://www.favicon-generator.org/
// - https://realfavicongenerator.net/
// - https://www.pngconverter.com/

console.log('✅ Icon configuration ready');
console.log('');
console.log('IMPORTANT: For production, replace placeholder icons with actual PNG files:');
console.log('');
console.log('Required icon sizes:');
console.log('  - favicon-16x16.png (16x16)');
console.log('  - favicon-32x32.png (32x32)');
console.log('  - favicon-96x96.png (96x96)');
console.log('  - favicon-192x192.png (192x192)');
console.log('  - favicon-192x192-maskable.png (192x192 - maskable format)');
console.log('  - favicon-512x512.png (512x512)');
console.log('  - favicon-512x512-maskable.png (512x512 - maskable format)');
console.log('  - apple-touch-icon.png (180x180)');
console.log('  - screenshot-540x720.png (540x720 - mobile)');
console.log('  - screenshot-1280x720.png (1280x720 - desktop)');
console.log('');
console.log('Tools to generate icons:');
console.log('  1. Favicon Generator: https://www.favicon-generator.org/');
console.log('  2. Real Favicon Generator: https://realfavicongenerator.net/');
console.log('  3. PWA Icon Generator: https://www.pwabuilder.com/');
console.log('');
