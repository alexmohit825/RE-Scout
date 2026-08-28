import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// High-fidelity iOS and Web App Icon Vector
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Rich Deep Slate & Teal) -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#05141f" />
    </linearGradient>

    <!-- Vibrant Emerald-Cyan Gradients -->
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>

    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>

    <linearGradient id="roofGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.2" />
    </linearGradient>

    <!-- Subtle Outer Glow -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="sparkGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base with Rounded Border -->
  <rect width="512" height="512" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="496" height="496" rx="108" fill="none" stroke="url(#borderGrad)" stroke-width="4" opacity="0.6" />

  <!-- Subtle Underlying Grid Matrix -->
  <g opacity="0.08" stroke="#38bdf8" stroke-width="1.5">
    <line x1="64" y1="128" x2="448" y2="128" />
    <line x1="64" y1="256" x2="448" y2="256" />
    <line x1="64" y1="384" x2="448" y2="384" />
    <line x1="128" y1="64" x2="128" y2="448" />
    <line x1="256" y1="64" x2="256" y2="448" />
    <line x1="384" y1="64" x2="384" y2="448" />
  </g>

  <!-- Central Scout Prism & High-Rise Multi-Unit Geometry -->
  <g filter="url(#softGlow)" transform="translate(256, 260)">
    <!-- Tower Left Facet -->
    <polygon points="0,-140 -115,-72 -115,110 0,42" fill="url(#cyanGrad)" opacity="0.9" />
    
    <!-- Tower Right Facet -->
    <polygon points="0,-140 115,-72 115,110 0,42" fill="url(#emeraldGrad)" opacity="0.95" />

    <!-- Top Apex Diamond -->
    <polygon points="0,-140 115,-72 0,-4 -115,-72" fill="url(#roofGrad)" />

    <!-- Isometric Window Nodes (Multi-Unit Grid) -->
    <g fill="#ffffff" opacity="0.85">
      <!-- Left side windows -->
      <polygon points="-85,-45 -45,-22 -45,-6 -85,-29" opacity="0.7" />
      <polygon points="-85,-10 -45,13 -45,29 -85,6" opacity="0.7" />
      <polygon points="-85,25 -45,48 -45,64 -85,41" opacity="0.7" />
      
      <!-- Right side windows -->
      <polygon points="45,-22 85,-45 85,-29 45,-6" opacity="0.9" />
      <polygon points="45,13 85,-10 85,6 45,29" opacity="0.9" />
      <polygon points="45,48 85,25 85,41 45,64" opacity="0.9" />
    </g>

    <!-- Valuation Yield Curve / Arrow Surge -->
    <path d="M -135,90 Q -40,110 0,42 Q 40,-26 125,-85" fill="none" stroke="url(#goldGrad)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" filter="url(#sparkGlow)" />
    
    <!-- Arrow Head on Yield Curve -->
    <polygon points="135,-92 105,-82 120,-62" fill="url(#goldGrad)" />

    <!-- Apex Scout AI Beacon -->
    <circle cx="0" cy="-140" r="14" fill="#ffffff" filter="url(#sparkGlow)" />
    <circle cx="0" cy="-140" r="8" fill="#10b981" />
  </g>

  <!-- Bottom App Label Monogram Accent -->
  <text x="256" y="445" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="28" fill="#e2e8f0" text-anchor="middle" letter-spacing="4">RE SCOUT</text>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(iconSvg);

  // 1. Save canonical SVG icon
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg.trim());

  // 2. apple-touch-icon.png (180x180) for iOS Safari Home Screen
  console.log('Rendering apple-touch-icon.png (180x180)...');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 3. apple-touch-icon-precomposed.png (180x180)
  console.log('Rendering apple-touch-icon-precomposed.png (180x180)...');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'));

  // 4. icon-512.png (512x512) for High-Res Displays & PWA Splash
  console.log('Rendering icon-512.png (512x512)...');
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512.png'));

  // 5. icon-192.png (192x192) for Standard PWA
  console.log('Rendering icon-192.png (192x192)...');
  await sharp(svgBuffer)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-192.png'));

  // 6. favicon.png (32x32) for Desktop Browser Tabs
  console.log('Rendering favicon.png (32x32)...');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All high-fidelity icon assets generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
