# Updates Tracker

## 2026-10-17 — 3D PSP accuracy pass
- Compared a straight-on render (`/?pose=front`) against the reference photo at matching scale and fixed the mismatches
- D-pad keys rebuilt to measured shape (curved outer end on the 12 mm well, pointed tip 3.5 mm from centre), larger arrow glyphs
- Face buttons: bigger traced-size symbols, each in a ringed well, on a glossy diamond plate instead of a grey one
- Added SONY wordmark, PS logo, the real thin upright PSP logotype (traced), POWER/HOLD indicator dots, silver strap holder
- Knurled grey analog nub, round VOL keys, more visible top grille, softer rim lighting (no outline effect), calmer reflections

## 2026-10-17 — 3D PSP-1000 hero
- Replaced the flat CSS hero device with a real-time three.js model (React Three Fiber), lazy-loaded so the main bundle is unchanged
- 1:1 geometry in mm traced from the Piano Black PSP-1000 product photo: outline, screen, d-pad, face buttons, analog nub, bottom row, LEDs, speakers, silver L/R caps
- Clearcoat piano-black material under a custom studio environment; five launch shells (Piano Black, Ceramic White, Metallic Blue, Pink, Champagne Gold)
- Live XMB projected onto the 3D screen with CSS3D matrices (drei `<Html>` breaks under React 19 StrictMode)
- Every key is clickable: d-pad, face buttons, L/R, HOME, VOL±, ◐ (XMB colour), ♪, SELECT (shell), START; the nub can be dragged
- Mouse-follow tilt on desktop, idle sway on touch, intro spin; respects reduced motion; CSS PSP fallback without WebGL
- XMB logic moved into `src/components/xmb.tsx` and shared by both devices

## 2026-10-17 — v2.0: Y2K skeuomorphic redesign + full PSP encyclopedia
- New design system: piano-black gloss panels, chrome bezels, brushed metal, gel buttons, LCD readouts, holo stickers, physical keys (`src/index.css`, `@layer components`)
- Hero: CSS-built PSP-1000 with a working XMB menu (arrow keys / d-pad / swipe / draggable nub; ✕ opens, △ random colourway, □ compare) and a boot animation
- XMB month themes: accent colour follows the month (12 colours, picker in the nav, saved in localStorage); WebGL waves tinted to match
- Client-side router + `vercel.json` rewrites; inner pages are lazy-loaded
- New pages: Colour Archive (URL filters, search, colour families), colourway showroom pages, Hardware index + 5 model pages (specs, releases, prices, boards, ratings, trivia), Compare (diff mode, to-scale silhouettes), History timeline (eras + category filters), Games (64 UMDs, filters, random pick), Firmware (1.00 → 6.61), Homebrew (scene history, glossary), Buyer’s Guide (model decoder, saved checklist, region codes, FAQ), 404 (error 80020148)
- Optional synthesised UI sounds (off by default)
- NewRodin served as a 16 KB Latin WOFF2 subset (was a 3.8 MB OTF); full-width punctuation falls back via `unicode-range`
- Added `@types/react` / `@types/react-dom` so `pnpm lint` typechecks
- Removed unused components: GridView, TimelineView, MiniPSP, CentralObject, OrbitBackground, WaveBackground, ImageGallery

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
