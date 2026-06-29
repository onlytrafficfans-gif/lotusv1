#!/usr/bin/env node
/**
 * Generate Placeholder PWA Icons
 * Creates empty placeholder PNG files in required sizes
 *
 * These placeholders allow the PWA to work while you replace them with actual icons
 *
 * Run: node scripts/generate-placeholder-icons.cjs
 */

const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { dirname } = require('path');

// Icon sizes needed for PWA
const iconSizes = [
  { size: 16, name: 'favicon-16x16' },
  { size: 32, name: 'favicon-32x32' },
  { size: 96, name: 'favicon-96x96' },
  { size: 192, name: 'favicon-192x192' },
  { size: 192, name: 'favicon-192x192-maskable' },
  { size: 512, name: 'favicon-512x512' },
  { size: 512, name: 'favicon-512x512-maskable' },
  { size: 180, name: 'apple-touch-icon' },
];

const screenshotSizes = [
  { width: 540, height: 720, name: 'screenshot-540x720' },
  { width: 1280, height: 720, name: 'screenshot-1280x720' },
];

const iconsDir = path.join(__dirname, '../public/icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('📱 Generating PWA Icon Placeholders');
console.log('===================================\n');

// Create simple SVG placeholder for icons
const createSVGIcon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4a574;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a0825d;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="#1a1a1a"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" fill="none" stroke="url(#grad)" stroke-width="${Math.ceil(size/32)}"/>
  <text x="${size/2}" y="${Math.ceil(size * 0.65)}" font-size="${Math.ceil(size * 0.55)}" font-weight="bold" text-anchor="middle" fill="url(#grad)" font-family="system-ui">L</text>
</svg>`;

// Create screenshot placeholder
const createSVGScreenshot = (width, height) => `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0a0a08"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grid)" />
  <text x="${width/2}" y="${height/2}" font-size="48" font-weight="bold" text-anchor="middle" fill="#666" font-family="system-ui">Placeholder</text>
  <text x="${width/2}" y="${height/2 + 60}" font-size="24" text-anchor="middle" fill="#444" font-family="system-ui">${width}×${height}</text>
</svg>`;

// Generate icon placeholders
console.log('Icons:');
iconSizes.forEach(({ size, name }) => {
  const svgContent = createSVGIcon(size);
  const filePath = path.join(iconsDir, `${name}.png.svg`);

  // Write as SVG (can be viewed and later converted to PNG)
  fs.writeFileSync(filePath, svgContent);
  console.log(`  ✓ ${name}.png (${size}×${size})`);
});

// Generate screenshot placeholders
console.log('\nScreenshots:');
screenshotSizes.forEach(({ width, height, name }) => {
  const svgContent = createSVGScreenshot(width, height);
  const filePath = path.join(iconsDir, `${name}.png.svg`);

  fs.writeFileSync(filePath, svgContent);
  console.log(`  ✓ ${name}.png (${width}×${height})`);
});

console.log('\n✅ Placeholder icons generated!');
console.log('\n📝 IMPORTANT: These are SVG placeholders only.');
console.log('   To use them as PNG:');
console.log('   1. Convert to PNG using an online tool or ImageMagick:');
console.log('      convert filename.png.svg -quality 100 filename.png');
console.log('   2. Or replace with actual PNG files from:');
console.log('      - Real Favicon Generator: https://realfavicongenerator.net/');
console.log('      - PWA Builder: https://www.pwabuilder.com/');
console.log('\n📂 Files created in: ' + iconsDir);
console.log('\n💡 The app will work with these placeholders, but install');
console.log('   prompts may not display properly on all browsers.');
