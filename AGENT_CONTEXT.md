# PSP Archive — Agent Context

## What Is This
Interactive visual archive of every PSP (PlayStation Portable) model and color variation ever released. Hosted at psp.quest.

## Tech Stack
- React 19 + Vite + Tailwind CSS v4 + Framer Motion (`motion`) + Lucide icons
- Static data in `src/data.ts` (no database/API)
- Deployed on Vercel

## Key Files
- `src/App.tsx` — Main app: nav bar, filters (model/color/type), view mode toggle (timeline/grid), detail modal
- `src/data.ts` — All PSP model/color data (PSPModel type, pspData array)
- `src/components/TimelineView.tsx` — Chronological timeline view
- `src/components/GridView.tsx` — Dense grid view of all colors
- `src/components/CentralObject.tsx` — 3D hover detail view for modal
- `src/components/OrbitBackground.tsx` — Legacy background animation (unused, replaced by XMB video)
- `src/components/WaveBackground.tsx` — Legacy background animation (unused)
- `src/components/MiniPSP.tsx` — CSS-drawn mini PSP icon
- `index.html` — Entry point with OG/Twitter meta tags
- `vite.config.ts` — Vite config with Tailwind plugin, GEMINI_API_KEY env (not actively used)

## Data Model
PSPModel: { id, name, year, description, colors[] }
Color: { name, hex, type('standard'|'limited'), imageUrl?, backImageUrl?, description }
Models: PSP-1000 (2004), PSP-2000 (2007), PSP-3000 (2008), PSP Go (2009), PSP Street (2011)

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
- Renders in light mode (white background with dark wave ribbons)
- Old video files still in blob (`assets/xmb-bg.webm`, `assets/xmb-bg.mp4`) but no longer used

### Scripts
- `scripts/create-blob-folders.js` — one-time: creates .keep folders in blob
- `scripts/upload-bg-video.js` — uploads background video files to blob `assets/` folder
- `scripts/download-images.js` (`pnpm download-images`) — downloads existing web images into blob-images/
- `scripts/sync-to-blob.js` (`pnpm sync-blob`) — uploads blob-images/ to Vercel Blob, generates `src/blob-manifest.json`

### Manifest & Gallery
- `src/blob-manifest.json` — auto-generated map of `{modelId}/{colorSlug}` → `string[]` of blob URLs
- `src/components/ImageGallery.tsx` — gallery component used in detail modal (arrows + thumbnails)
- `src/utils.ts` — slugify() helper shared between app and scripts

## Running Locally
1. `pnpm install`
2. `pnpm dev` → http://localhost:3000
`.env` with `BLOB_READ_WRITE_TOKEN` needed for blob operations.

## Rules
- Use pnpm (not npm)
- Never commit unless explicitly asked
- Never open a terminal to run pnpm dev (user has one running)
- Update AGENT_CONTEXT.md with new requirements
- Update updatestracker.md with each iteration
