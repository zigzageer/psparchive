# PSP Archive 🎮

<div align="center">
  <img src="public/logo.svg" alt="PSP Archive Logo" width="120" />
  <br/>
  <h3>The Ultimate Visual History of the PlayStation Portable</h3>
  <p>A beautifully curated, interactive archive of every PSP model and color variation ever released.</p>
</div>

---

## ✨ Features

- **Interactive 3D PSP hero**: a real-time three.js model of the PSP-1000, built 1:1 in millimetres from a traced product photo, with glossy clearcoat materials, studio reflections and the five launch shell colours. Its screen runs a live XMB menu that navigates the site. Use the arrow keys, click the 3D d-pad and buttons, swipe, or drag the analog nub. ✕/START opens, △ jumps to a random colourway, SELECT changes the shell, ◐ cycles the XMB colour and VOL/♪ toggle sound. Without WebGL it falls back to a CSS-drawn PSP.
- **Colour Archive**: all 56 colourways with front/back photography, filterable by model, colour family, edition and free-text search (filters live in the URL). Every colourway has its own showroom page with a front/back flip, spec plate and prev/next navigation (← →).
- **Hardware**: a deep spec sheet for each of the five families — release dates, launch pricing, motherboard revisions, launch firmware, what changed, strengths/weaknesses and trivia — plus an accessories catalogue.
- **Compare**: side-by-side spec table with a "differences only" mode, to-scale footprint silhouettes and weight bars.
- **History**: an interactive timeline from the 2003 announcement to today, split into eras and filterable by hardware / firmware / games / business / scene.
- **Games**: 64 essential games rendered as UMD discs, with search, genre and tag filters (Essential, Hidden gem, Japan only…) and a random pick.
- **Firmware**: the notable system updates from 1.00 to 6.61, styled as a PSP System Update screen.
- **Homebrew**: the history of PSP exploits and custom firmware (descriptive only, no downloads), today’s typical setup, notable homebrew and a glossary.
- **Buyer’s guide**: which model to buy, a model-number decoder (PSP-3004 → PSP-3000, Europe), a persistent inspection checklist, region codes, care tips and an FAQ.
- **XMB themes**: like the real PSP, the site’s accent colour follows the month. Pick any of the 12 colours from the orb in the nav.
- **Optional UI sounds**: synthesised XMB-style blips (off by default).

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
- **3D**: [three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or newer) and [pnpm](https://pnpm.io/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zigzageer/psparchive.git
   cd psparchive
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your `BLOB_READ_WRITE_TOKEN` to `.env` (required for image sync).

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## 🖼️ Image Pipeline

All PSP images are stored in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) and managed via a local mirror folder.

### Folder Structure

```
blob-images/            # Local mirror (gitignored)
  psp-1000/
    piano-black/
      front.png
      back.png
    metallic-blue/
      front.png
      back.png
      magazine-scan.jpg  # Add any extra images here
  psp-2000/
    ice-silver/
      front.png
      teardown-01.jpg
    ...
```

### Adding New Images

1. Drop images into the appropriate folder under `blob-images/{model}/{color}/`
2. Run the sync script:
   ```bash
   pnpm sync-blob
   ```
3. The script uploads new images to Vercel Blob and regenerates `src/blob-manifest.json`
4. The app gallery automatically picks up the new images

### Available Scripts

| Command | Description |
|---|---|
| `pnpm download-images` | Download existing PSP images from the web into `blob-images/` |
| `pnpm sync-blob` | Upload `blob-images/` to Vercel Blob and regenerate the manifest |

## 📦 Deployment

This project is optimized for deployment on Vercel. 

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Vercel will automatically detect the Vite preset and deploy the site.

OpenGraph and Twitter Card meta tags are pre-configured for beautiful social sharing previews.

## 🎨 Design Philosophy

PSP Archive leans into **Y2K skeuomorphism**: piano-black gloss slabs with chrome bezels, brushed-aluminium labels, candy “gel” buttons, backlit LCD readouts with scanlines, holographic LIMITED stickers and physical keycaps that depress when active. The PSP’s own XMB wave ribbons run behind everything, tinted by the month — just as the real console did. Headlines use NewRodin, the PSP’s system font (shipped as a 16 KB Latin subset).

## 🗂️ Project structure

```
src/
  App.tsx            Shell + routes (inner pages are lazy-loaded)
  router.tsx         Tiny History-API router (Link, navigate, usePath)
  theme.tsx          XMB month themes + sound preference
  data.ts            Colourway data (56 finishes)
  data/              models, history, games, firmware, scene, guide
  lib/catalog.ts     Colourway helpers (images from the blob manifest, families)
  components/        psp3d/ (3D PSP), PSPDevice (CSS fallback), xmb (menu), Nav, Footer, ColorCard, UMD, ui
  pages/             Home, Colors, ColorDetail, Models, ModelDetail, Compare,
                     History, Games, Firmware, Homebrew, Guide, NotFound
```

`vercel.json` rewrites every path to `index.html` so deep links like `/models/psp-go` work.

## 📝 License

This project is open-source and available under the MIT License.

---
*Disclaimer: This is a fan-made archive. "PlayStation" and "PSP" are registered trademarks of Sony Interactive Entertainment Inc.*
