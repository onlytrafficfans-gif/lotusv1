const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Icon sizes to generate: [filename, width, height]
const icons = [
  ['favicon-16x16.png', 16, 16],
  ['favicon-32x32.png', 32, 32],
  ['favicon-96x96.png', 96, 96],
  ['apple-touch-icon-180x180.png', 180, 180],
  ['android-chrome-192x192.png', 192, 192],
  ['android-chrome-512x512.png', 512, 512],
  ['android-chrome-192x192-maskable.png', 192, 192],
  ['android-chrome-512x512-maskable.png', 512, 512],
  ['screenshot-540x720.png', 540, 720],
  ['screenshot-1280x720.png', 1280, 720],
];

// Path to source logo - try multiple locations
const possiblePaths = [
  path.join(process.cwd(), 'public/lotus-logo.png'),
  path.join(process.cwd(), '../Desktop/logo lotus.png'),
  path.join(process.cwd(), '../Desktop/lotus.png'),
  path.join(process.cwd(), '../Downloads/lotus.png'),
  path.join(process.cwd(), 'public/logo.png'),
];

let sourceImage = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    sourceImage = p;
    console.log(`Found source image: ${sourceImage}`);
    break;
  }
}

if (!sourceImage) {
  console.error('Source logo not found. Checked:');
  possiblePaths.forEach(p => console.error(`  - ${p}`));
  process.exit(1);
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateIcons() {
  try {
    for (const [filename, width, height] of icons) {
      const outputPath = path.join(publicDir, filename);

      console.log(`Generating ${filename} (${width}x${height})...`);

      await sharp(sourceImage)
        .resize(width, height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Created ${filename}`);
    }

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
