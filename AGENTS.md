# iOS PWA Icon Protocol & Preservation Guidelines

This document details the standards and rules for maintaining and updating the Progressive Web App (PWA) configuration and high-fidelity iOS assets for **Value RE Scout**.

## 1. PWA Preservation Rules
- **iOS Capable Flag**: Never remove `<meta name="apple-mobile-web-app-capable" content="yes" />` or `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />` from the `<head>` of `index.html`. These enable standalone immersive mode on iOS Safari.
- **Title Configuration**: The app title inside `<meta name="apple-mobile-web-app-title" content="RE Scout" />` must remain short and punchy so it fits elegantly underneath the home screen icon without truncation.
- **Responsive Viewports**: Ensure `viewport-fit=cover` is present in the viewport meta tag to support iPhone notch and dynamic island safe areas.

## 2. High-Fidelity Icon Rendering via Sharp
- **Source Artifacts**: Icons must be generated from a scalable vector graphic (`.svg`) source to ensure geometric precision and pixel alignment.
- **Sharp CLI/Script**: Use a Node.js script with the `sharp` library to rasterize the vector source into final production-ready touch icons.
- **Standard Dimensions**:
  - `apple-touch-icon.png` (180x180 pixels) - For Apple mobile and tablet home screens.
  - `favicon.png` (32x32 pixels) - For desktop browser tabs.
  - `icon-512.png` (512x512 pixels) - High-resolution asset for app splash configurations.
- **Aesthetics**: Avoid pure white backgrounds for icons. Prefer rich, deep tones (like our dark slate-teal theme `#0f172a` and `#042f2e`) to blend seamlessly with iOS dark mode or premium grids.

## 3. Version Query Cache-Busting
- **iOS Safari Aggressive Caching**: iOS Safari caches home screen icons extremely aggressively. Often, replacing the image file on the server does not update the user's home screen icon.
- **Explicit Versioning**: All icon asset references in `index.html` must include a version query parameter (e.g., `/apple-touch-icon.png?v=1.0.1`).
- **Trigger Updates**: Whenever the icon source code or asset is regenerated, increment the version query parameter `v` in `index.html` to force Safari to clear its cache and load the new branding instantly.
