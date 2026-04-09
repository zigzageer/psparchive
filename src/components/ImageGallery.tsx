import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  colorHex: string;
}

export function ImageGallery({ images, colorHex }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="w-72 h-32 md:w-[480px] md:h-[200px] rounded-full overflow-hidden border border-black/5"
          style={{
            backgroundColor: colorHex,
            boxShadow: '5px 10px 25px rgba(0,0,0,0.15), inset 0 0 20px rgba(0,0,0,0.1)',
          }}
        >
          <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-xl transform -translate-y-1/4" />
        </div>
      </div>
    );
  }

  const goTo = (index: number) => {
    if (index < 0) setActiveIndex(images.length - 1);
    else if (index >= images.length) setActiveIndex(0);
    else setActiveIndex(index);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Main image with nav arrows */}
      <div className="relative w-full flex items-center justify-center min-h-[280px] md:min-h-[420px]">
        {images.length > 1 && (
          <button
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-0 z-10 p-2 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.img
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={`Image ${activeIndex + 1}`}
            className="max-w-[85%] max-h-[420px] object-contain"
            style={{ filter: 'drop-shadow(5px 10px 20px rgba(0,0,0,0.2))' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <button
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-0 z-10 p-2 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Thumbnail strip + count */}
      {images.length > 1 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <Images size={12} />
            {activeIndex + 1} / {images.length}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 pb-1 custom-scrollbar">
            {images.map((url, i) => (
              <button
                key={url}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeIndex
                    ? 'border-slate-800 shadow-md scale-105'
                    : 'border-slate-200 hover:border-slate-400 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
