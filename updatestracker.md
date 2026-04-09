# Updates Tracker

## 2026-04-09 — Larger PSP Grid Cards
- Increased MiniPSP size from w-32 h-16 to w-44 h-22 (~37% bigger)
- Reduced grid columns (6→5 at XL, 5→4 at LG, 4→3 at MD) for breathing room
- Increased gap spacing (gap-x-8 gap-y-14)

## 2026-04-09 — Dark Mode
- Switched entire site to dark mode
- XMB shader: removed light-mode color inversion, now renders light waves on black
- App shell: bg-black, white text, translucent white/10 controls with backdrop-blur
- Nav: glass-morphism style with bg-white/10 borders, white active states
- Selects/filters: dark glass style matching nav
- Timeline: dark cards (bg-white/5), white text, translucent lines/nodes
- Detail modal: black bg, white text, amber-900/amber-400 for limited badges
- Body CSS: black bg, light text, white scrollbar thumbs
- GridView already had dark styling (XMB glow text)

## 2026-04-09 — WebGL XMB Wave Background
- Replaced video background with pure WebGL shader recreation of PSP XMB waves
- Created `src/components/XMBBackground.tsx` — React component wrapping a full-screen WebGL canvas
- Shader based on [fchavonet/creative_coding-xmb_wave_background](https://github.com/fchavonet/creative_coding-xmb_wave_background)
- Uses light mode (white bg with dark wave ribbons) to match the site's aesthetic
- Zero external assets needed — runs entirely in the GPU via fragment shader
- Removed video element and white overlay div from App.tsx
- Updated base bg color to white throughout (body CSS, App container, nav gradient)

## 2026-04-09 — Background Polish & Default View
- Changed default view from timeline to grid
- Added 2px blur + scale(1.02) to video background so it feels ambient, not distracting
- Added 40% white overlay on top of video for a frosted/washed-out look
- Wrapped video + overlay in a container div for clean layering

## 2026-04-09 — XMB Wave Background Video
- Replaced static grid pattern background with animated PSP XMB wave video
- Downloaded source from YouTube, trimmed to 20s loop at 720p/24fps
- Created WebM (VP9, 292kB) and MP4 (H.264, 374kB) versions for browser compat
- Uploaded both to Vercel Blob: `assets/xmb-bg.webm` and `assets/xmb-bg.mp4`
- Updated `App.tsx` with `<video>` background element (autoPlay, loop, muted, playsInline)
- Removed unused `bg-grid-pattern` CSS class and `OrbitBackground` import
- Updated base background color from `#f4f4f0` to `#e8e8e4` (slightly warmer to match XMB)
- Added `temp/` to `.gitignore`
- Created `scripts/upload-bg-video.js` for blob upload

## 2026-04-09 — Vercel Blob Folder Setup
- Created `.env` with `BLOB_READ_WRITE_TOKEN` (gitignored via existing `.gitignore` rule)
- Installed `@vercel/blob` package
- Created `scripts/create-blob-folders.js` — script to scaffold blob folders for every PSP color
- Successfully created 56 blob folders across all 5 models (PSP-1000, 2000, 3000, Go, Street)
- Folder pattern: `{model-id}/{color-slug}/` (e.g. `psp-2000/ice-silver/`)
- Base blob URL: `https://rcldobtoiheikxod.public.blob.vercel-storage.com/`
- Created `AGENT_CONTEXT.md` for future agent onboarding

## 2026-04-09 — Image Pipeline & Gallery
- Added `blob-images/` to `.gitignore` for local image mirror
- Created `scripts/download-images.js` — downloads all 96 existing PSP images (front/back) into local folders
- Created `scripts/sync-to-blob.js` — uploads local images to Vercel Blob + generates `src/blob-manifest.json`
- All 96 images uploaded to Vercel Blob with proper paths
- Created `src/components/ImageGallery.tsx` — gallery with main image, arrow nav, and thumbnail strip
- Created `src/utils.ts` with shared `slugify()` helper
- Updated `App.tsx` detail modal to use ImageGallery from blob manifest instead of hardcoded URLs
- Added `resolveJsonModule` to `tsconfig.json` for JSON imports
- Added `pnpm download-images` and `pnpm sync-blob` scripts to `package.json`
- Workflow: drop images into `blob-images/{model}/{color}/` → `pnpm sync-blob` → app updates
