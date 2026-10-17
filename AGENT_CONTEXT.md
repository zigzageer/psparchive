# PSP Archive — Agent Context

## What Is This
Interactive visual archive of every PSP (PlayStation Portable) model and color variation ever released. Hosted at psp.quest.

## Tech Stack
- React 19 + Vite + Tailwind CSS v4 + Motion (`motion/react`) + Lucide icons + three.js / @react-three/fiber (hero only)
- Static data in `src/data.ts` (colourways) and `src/data/*.ts` (everything else) — no database/API
- Client-side routing via `src/router.tsx` (History API); `vercel.json` rewrites all paths to `index.html`
- Deployed on Vercel

## Design System (Y2K skeuomorphism)
- Reusable surface classes live in `src/index.css` inside `@layer components`, so Tailwind utilities can override them:
  `.panel` (piano-black gloss), `.glass` (frosted acrylic), `.chrome-rim` (chrome bezel wrapper), `.metal` (brushed aluminium),
  `.lcd` / `.lcd-text` / `.lcd-input` (backlit LCD), `.gel` / `.gel-chrome` / `.gel-black` (candy buttons), `.key` + `.is-on` (physical keys),
  `.holo` (holographic sticker), `.app-icon`, `.led`, `.screw`, `.well`, `.groove`, `.chrome-text`, `.accent-text`, `.umd*`, `.shelf-pad`.
- Accent colour = CSS vars `--accent`, `--accent-rgb`, `--accent-hi`, `--accent-lo`, set by `ThemeProvider` from the 12 XMB month colours (`src/theme.tsx`).
- Fonts: NewRodin (PSP system font; served as `public/fonts/NewRodinProEB-latin.woff2`, a Latin subset of the .otf), Space Grotesk (body),
  JetBrains Mono (labels), VT323 (LCD). The NewRodin `@font-face` excludes its full-width punctuation via `unicode-range`.
- Primitives in `src/components/ui.tsx`: Panel, Screws, SectionHeader, PageHero, Container, Meter, TiltCard, LCDStat, Reveal, FaceGlyph.

## Key Files
- `src/App.tsx` — shell (XMB background, Nav, Footer) and route table
- `src/components/psp3d/PSP3D.tsx` — the hero: a three.js / React Three Fiber PSP-1000, lazy-loaded from `pages/Home.tsx`.
  - Geometry in `psp3d/geometry.ts`, in mm (170 × 74 × 23). The outline and feature positions were traced from the Piano Black
    front photo in the blob store. It builds the body extrusion, shoulder caps, d-pad keys, lathe face buttons and nub, pills,
    and canvas textures for the printed labels.
  - Lighting is a custom dark "studio" PMREM environment (softbox planes) plus a couple of lights; tune `studioScene()` for reflections.
  - The XMB DOM is mapped onto the screen by `ScreenProjector` (CSS3DRenderer-style matrix3d). drei `<Html>` is not used,
    because its separate React root gets wiped by React 19 StrictMode double-mounting.
  - Shell finishes are in `FINISHES`. Bottom-row keys: SELECT = next shell, ◐ = next XMB theme, VOL± / ♪ = sound, START = open.
  - Accuracy check: open `/?pose=front` for a straight-on, near-orthographic render, then overlay it on the photo at the same
    px/mm (the canvas fits 196 mm across). The printed layer (SONY, PS logo, PSP logotype, labels) lives in `facePrintTexture`.
- `src/components/xmb.tsx` — XMB menu data (`XMB`), `useXMBController` (state, keyboard) and `XMBScreen`, shared by the 3D and CSS devices
- `src/components/PSPDevice.tsx` + `psp-device.css` — flat CSS PSP, shown while the 3D chunk loads and when WebGL is unavailable
- `src/components/XMBBackground.tsx` — WebGL XMB waves tinted with the accent; renders at 60% resolution and pauses when the tab is hidden
- `src/components/Nav.tsx` — nav, XMB theme picker, sound toggle, mobile app-icon menu
- `src/components/ColorCard.tsx`, `UMD.tsx` — colourway card and CSS UMD disc
- `src/lib/catalog.ts` — flattened `colorways` list (images from the blob manifest, colour families)
- `src/data/models.ts` — specs, releases, prices, boards, ratings, region codes, accessories
- `src/data/history.ts`, `games.ts`, `firmware.ts`, `scene.ts`, `guide.ts` — page content
- `src/pages/*` — one file per route
- `src/sound.ts` — WebAudio UI blips (off by default)

## Routes
`/`, `/colors` (`?model=&type=&family=&q=`), `/colors/:model/:slug`, `/models`, `/models/:id`, `/compare`,
`/history` (`#reveal|launch|slim|go|twilight|afterlife`), `/games` (`?tag=`), `/firmware`, `/homebrew`, `/guide` (`#decoder|checklist|faq`)

## Data Model
PSPModel: { id, name, year, description, colors[] }
Color: { name, hex, type('standard'|'limited'), imageUrl?, backImageUrl?, description }
Models: PSP-1000 (2004), PSP-2000 (2007), PSP-3000 (2008), PSP Go (2009), PSP Street (2011)
ModelInfo (`src/data/models.ts`) uses the same ids and adds specs, releases, prices and ratings.

## Vercel Blob Storage & Image Pipeline
- Token in `.env` (gitignored) as `BLOB_READ_WRITE_TOKEN`
- Package: `@vercel/blob`
- Base URL: `https://rcldobtoiheikxod.public.blob.vercel-storage.com/`
- Folder structure: `{model-id}/{color-slug}/` (e.g. `psp-2000/ice-silver/`)
- 56 color folders across all 5 models

### Local Mirror
- `blob-images/` — local folder (gitignored) mirroring the blob structure
- Drop images into `blob-images/{model-id}/{color-slug}/` (any name, any image format)
- Workflow: add images locally → run `pnpm sync-blob` → uploads to blob + regenerates manifest

### XMB Wave Background
- `src/components/XMBBackground.tsx` — WebGL shader recreation of PSP XMB wave animation
- Pure GPU-rendered via fragment shader, no external assets needed
- Based on https://github.com/fchavonet/creative_coding-xmb_wave_background
- Dark base with ribbons tinted by the current XMB accent colour
- Old video files still in blob (`assets/xmb-bg.webm`, `assets/xmb-bg.mp4`) but no longer used

### Scripts
- `scripts/create-blob-folders.js` — one-time: creates .keep folders in blob
- `scripts/upload-bg-video.js` — uploads background video files to blob `assets/` folder
- `scripts/download-images.js` (`pnpm download-images`) — downloads existing web images into blob-images/
- `scripts/sync-to-blob.js` (`pnpm sync-blob`) — uploads blob-images/ to Vercel Blob, generates `src/blob-manifest.json`

### Manifest & Gallery
- `src/blob-manifest.json` — auto-generated map of `{modelId}/{colorSlug}` → `string[]` of blob URLs
- Colourway pages (`src/pages/ColorDetail.tsx`) show front/back from the manifest; extra images appear under "From the archive"
- `src/utils.ts` — slugify() helper shared between app and scripts

## Running Locally
1. `pnpm install`
2. `pnpm dev` → http://localhost:3000
`.env` with `BLOB_READ_WRITE_TOKEN` needed for blob operations.

## Rules
- Content accuracy matters: only add facts you can source; prefer month-level dates when unsure
- The homebrew page is descriptive only — never link to firmware, exploits or game downloads
- Use pnpm (not npm)
- Never commit unless explicitly asked
- Never open a terminal to run pnpm dev (user has one running)
- Update AGENT_CONTEXT.md with new requirements
- Update updatestracker.md with each iteration
