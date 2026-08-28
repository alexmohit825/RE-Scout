import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure public folder exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Beautiful iOS App Icon Vector Source
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Rich professional dark mode background gradient -->
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fafaf9" /> <!-- Off-white bone -->
      <stop offset="60%" stop-color="#f5f5f4" /> <!-- Warm stone off-white -->
      <stop offset="100%" stop-color="#e2e8f0" /> <!-- Premium slate-off-white -->
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" /> <!-- Emerald-400 -->
      <stop offset="100%" stop-color="#059669" /> <!-- Emerald-600 -->
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf" /> <!-- Teal-400 -->
      <stop offset="100%" stop-color="#0ea5e9" /> <!-- Sky-500 -->
    </linearGradient>
    <!-- Premium drop shadows -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Solid background -->
  <rect width="512" height="512" fill="url(#bgGrad)" />

  <!-- Main visual group -->
  <g filter="url(#shadow)">
    <!-- Left Multi-Unit Residential Tower Block -->
    <rect x="150" y="210" width="75" height="170" rx="8" fill="#1e293b" stroke="url(#accentGrad)" stroke-width="4.5" opacity="0.9" />
    
    <!-- Windows for density representation -->
    <rect x="168" y="230" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    <rect x="194" y="230" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    
    <rect x="168" y="258" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    <rect x="194" y="258" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    
    <rect x="168" y="286" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    <rect x="194" y="286" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    
    <rect x="168" y="314" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    <rect x="194" y="314" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    
    <rect x="168" y="342" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />
    <rect x="194" y="342" width="11" height="11" rx="2.5" fill="#2dd4bf" opacity="0.8" />

    <!-- Right Commercial/Industrial Distribution Warehouse -->
    <path d="M255,270 L355,270 L355,380 L255,380 Z" fill="#1e293b" stroke="url(#accentGrad)" stroke-width="4.5" opacity="0.9" />
    <!-- Industrial roll-up garage door representing warehousing/distribution -->
    <rect x="282" y="318" width="46" height="62" rx="3" fill="#334155" stroke="#475569" stroke-width="2" />
    <line x1="282" y1="332" x2="328" y2="332" stroke="#475569" stroke-width="2.5" />
    <line x1="282" y1="346" x2="328" y2="346" stroke="#475569" stroke-width="2.5" />
    <line x1="282" y1="360" x2="328" y2="360" stroke="#475569" stroke-width="2.5" />

    <!-- Dynamic Emerald-Golden Trend / Put Option Premium Curve -->
    <path d="M110,390 Q 210,350 280,310 T 400,195" fill="none" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round" />
    <!-- Arrowhead -->
    <path d="M360,195 L400,195 L400,235" fill="none" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- Glowing beacon on arrow peak -->
    <circle cx="400" cy="195" r="10" fill="#34d399" />
  </g>

  <!-- Top Real-Estate Scout / Broker Target Sight Overlay -->
  <g filter="url(#shadow)">
    <circle cx="256" cy="115" r="34" fill="#0f172a" stroke="url(#accentGrad)" stroke-width="3.5" />
    <circle cx="256" cy="115" r="16" fill="none" stroke="#2dd4bf" stroke-width="2.5" />
    <line x1="256" y1="92" x2="256" y2="138" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" />
    <line x1="233" y1="115" x2="279" y2="115" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" />
  </g>
</svg>
`;

async function main() {
  console.log('Rendering vector iOS PWA icons using Sharp...');
  const svgBuffer = Buffer.from(svgIcon);

  // 1. Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✔ Generated public/apple-touch-icon.png (180x180)');

  // 2. Generate favicon.png (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✔ Generated public/favicon.png (32x32)');

  // 3. Generate icon-512.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✔ Generated public/icon-512.png (512x512)');

  console.log('🎉 iOS PWA icons successfully compiled to /public !');
}

main().catch(err => {
  console.error('❌ Failed to generate icons:', err);
  process.exit(1);
});
