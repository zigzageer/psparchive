import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XMBBackground } from './components/XMBBackground';
import { TimelineView } from './components/TimelineView';
import { GridView } from './components/GridView';
import { pspData } from './data';
import { slugify } from './utils';
import blobManifest from './blob-manifest.json';
import { LayoutGrid, GitCommit, X, ChevronDown } from 'lucide-react';

const manifest = blobManifest as Record<string, string[]>;

type ViewMode = 'timeline' | 'grid';
type FilterType = 'all' | 'standard' | 'limited';

const ALL_MODELS = ['all', 'PSP-1000', 'PSP-2000', 'PSP-3000', 'PSP Go', 'PSP Street'];
const COLOR_FAMILIES = ['all', 'black', 'white', 'silver', 'blue', 'red', 'pink', 'gold', 'green', 'yellow', 'purple', 'bronze'];

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');

  const [selectedDetail, setSelectedDetail] = useState<{ model: typeof pspData[0], color: typeof pspData[0]['colors'][0] } | null>(null);

  return (
    <div className="relative w-full h-screen bg-black text-slate-100 font-sans overflow-hidden selection:bg-slate-700">
      {/* XMB Wave Background (WebGL shader) */}
      <XMBBackground />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-b from-black via-black/90 to-transparent pointer-events-none">
        
        {/* Top Left Logo */}
        <div className="flex items-center gap-4 pointer-events-auto w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center">
            <div className="flex items-center ml-2" style={{ transform: 'scaleX(1.4) skewX(-12deg)' }}>
              <span className="font-psp text-3xl tracking-[-0.05em] leading-none text-white">PSP</span>
            </div>
            <div className="flex flex-col uppercase tracking-widest text-[10px] font-bold leading-tight border-l border-slate-600 pl-4 ml-2">
              <span className="text-slate-200">Archive</span>
              <span className="text-slate-500">Colors</span>
            </div>
          </div>
          
          {/* Mobile View Toggles (visible only on small screens) */}
          <div className="flex md:hidden items-center bg-white/10 border border-white/10 rounded-full p-1 backdrop-blur-sm">
            <button onClick={() => setViewMode('timeline')} className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${viewMode === 'timeline' ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <GitCommit size={12} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
              <LayoutGrid size={12} />
            </button>
          </div>
        </div>

        {/* Desktop View Toggles */}
        <div className="hidden md:flex items-center bg-white/10 border border-white/10 rounded-full p-1 pointer-events-auto backdrop-blur-sm">
          <button onClick={() => setViewMode('timeline')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${viewMode === 'timeline' ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
            <GitCommit size={14} /> Timeline
          </button>
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
            <LayoutGrid size={14} /> Grid
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 pointer-events-auto w-full md:w-auto justify-start md:justify-end overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          
          {/* Model Filter */}
          <div className="relative flex items-center">
            <select 
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="w-[110px] md:w-[140px] bg-white/10 border border-white/10 rounded-full pl-4 pr-8 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-300 outline-none focus:border-white/30 backdrop-blur-sm appearance-none cursor-pointer"
            >
              {ALL_MODELS.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-slate-100">{m === 'all' ? 'All Models' : m}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-3 h-3 pointer-events-none text-slate-500" />
          </div>

          {/* Color Filter */}
          <div className="relative flex items-center">
            <select 
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="w-[110px] md:w-[140px] bg-white/10 border border-white/10 rounded-full pl-4 pr-8 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-300 outline-none focus:border-white/30 backdrop-blur-sm appearance-none cursor-pointer"
            >
              {COLOR_FAMILIES.map(c => (
                <option key={c} value={c} className="bg-slate-900 text-slate-100">{c === 'all' ? 'All Colors' : c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-3 h-3 pointer-events-none text-slate-500" />
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-white/10 border border-white/10 rounded-full p-1 backdrop-blur-sm shrink-0">
            {(['all', 'standard', 'limited'] as FilterType[]).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-mono uppercase tracking-widest transition-colors ${filterType === type ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'timeline' && (
          <motion.div key="timeline" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-40">
            <TimelineView data={pspData} filterType={filterType} filterModel={filterModel} filterColor={filterColor} onSelect={(model, color) => setSelectedDetail({ model, color })} />
          </motion.div>
        )}

        {viewMode === 'grid' && (
          <motion.div key="grid" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-40">
            <GridView data={pspData} filterType={filterType} filterModel={filterModel} filterColor={filterColor} onSelect={(model, color) => setSelectedDetail({ model, color })} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal — full-screen vertical scroll */}
      <AnimatePresence>
        {selectedDetail && (() => {
          const key = `${selectedDetail.model.id}/${slugify(selectedDetail.color.name)}`;
          const galleryImages = [...(manifest[key] || [])].sort((a, b) => {
            const aIsFront = a.includes('front');
            const bIsFront = b.includes('front');
            if (aIsFront && !bIsFront) return -1;
            if (!aIsFront && bIsFront) return 1;
            return 0;
          });
          const fallbackImages = [selectedDetail.color.imageUrl, selectedDetail.color.backImageUrl].filter(Boolean) as string[];
          const images = galleryImages.length > 0 ? galleryImages : fallbackImages;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black overflow-y-auto overscroll-contain"
            >
              {/* Sticky close button */}
              <div className="sticky top-0 z-50 flex justify-end px-4 pt-4 md:px-8 md:pt-6">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-2.5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors border border-white/10"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Hero header */}
              <div className="max-w-3xl mx-auto px-5 md:px-8 pt-2 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: selectedDetail.color.hex }}
                  />
                  <span className="text-sm font-mono uppercase tracking-widest text-slate-500">
                    {selectedDetail.model.year} &middot; {selectedDetail.model.name}
                  </span>
                  <span className={`text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${selectedDetail.color.type === 'limited' ? 'bg-amber-900/40 text-amber-400' : 'bg-white/10 text-slate-400'}`}>
                    {selectedDetail.color.type}
                  </span>
                </div>

                <h1 className="font-psp text-4xl md:text-6xl tracking-tight leading-[1.1] text-white mb-4">
                  {selectedDetail.color.name}
                </h1>

                <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl">
                  {selectedDetail.color.description}
                </p>

                <div className="mt-5 text-xs font-mono uppercase tracking-widest text-slate-600">
                  {images.length} {images.length === 1 ? 'image' : 'images'} &middot; {selectedDetail.color.hex}
                </div>
              </div>

              {/* Images — just scroll */}
              <div className="max-w-3xl mx-auto px-4 md:px-8 pb-16 flex flex-col gap-6">
                {/* Front & back (first 2) — transparent, drop-shadow only */}
                {images.slice(0, 2).map((url, i) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="w-full flex items-center justify-center py-4"
                  >
                    <img
                      src={url}
                      alt={`${selectedDetail.color.name} ${i === 0 ? 'front' : 'back'}`}
                      className="max-w-full h-auto object-contain"
                      style={{ filter: 'drop-shadow(4px 8px 20px rgba(0,0,0,0.5))' }}
                    />
                  </motion.div>
                ))}

                {/* Extra images (3+) — card style for magazine clippings, teardowns, etc. */}
                {images.slice(2).map((url, i) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i + 2) * 0.05, duration: 0.3 }}
                    className="w-full rounded-xl overflow-hidden bg-white/5 border border-white/10"
                  >
                    <img
                      src={url}
                      alt={`${selectedDetail.color.name} ${i + 3}`}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
