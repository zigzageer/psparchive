# PSP Archive 🎮

<div align="center">
  <img src="public/logo.svg" alt="PSP Archive Logo" width="120" />
  <br/>
  <h3>The Ultimate Visual History of the PlayStation Portable</h3>
  <p>A beautifully curated, interactive archive of every PSP model and color variation ever released.</p>
</div>

---

## ✨ Features

- **Interactive Timeline**: Scroll through the history of the PSP, from the original 1000 series to the PSP Street, organized by release year.
- **Grid View**: A dense, highly visual grid of every single color variation across all models.
- **Advanced Filtering**: Instantly filter by specific models (e.g., PSP Go), color families (e.g., Blue, Pink), or edition types (Standard vs. Limited).
- **3D Hover Effects**: Smooth, physics-based 3D tilt effects powered by Framer Motion.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **High-Quality Assets**: Custom CSS-drawn PSP icons and high-resolution imagery for special editions.

- **Image Gallery**: Click any PSP to open a detail view with a full image gallery — browse front, back, magazine clippings, teardown photos, and more.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
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

The PSP Archive was designed with a "dark mode first" aesthetic, utilizing deep blacks, subtle glows, and high-contrast typography to make the vibrant colors of the consoles pop. The UI is intentionally minimal, getting out of the way to let the hardware shine.

## 📝 License

This project is open-source and available under the MIT License.

---
*Disclaimer: This is a fan-made archive. "PlayStation" and "PSP" are registered trademarks of Sony Interactive Entertainment Inc.*
