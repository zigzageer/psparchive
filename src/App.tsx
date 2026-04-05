import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OrbitBackground } from './components/OrbitBackground';
import { CentralObject } from './components/CentralObject';
import { TimelineView } from './components/TimelineView';
import { GridView } from './components/GridView';
import { pspData } from './data';
import { ChevronLeft, ChevronRight, Info, LayoutGrid, GitCommit, Orbit, X, ChevronDown } from 'lucide-react';

type ViewMode = 'timeline' | 'grid';
type FilterType = 'all' | 'standard' | 'limited';

const ALL_MODELS = ['all', 'PSP-1000', 'PSP-2000', 'PSP-3000', 'PSP Go', 'PSP Street'];
const COLOR_FAMILIES = ['all', 'black', 'white', 'silver', 'blue', 'red', 'pink', 'gold', 'green', 'yellow', 'purple', 'bronze'];

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterColor, setFilterColor] = useState<string>('all');

  const [selectedDetail, setSelectedDetail] = useState<{ model: typeof pspData[0], color: typeof pspData[0]['colors'][0] } | null>(null);

  return (
    <div className="relative w-full h-screen bg-black text-white font-sans overflow-hidden selection:bg-white/30">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
        
        {/* Top Left Logo */}
        <div className="flex items-center gap-4 pointer-events-auto w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center">
            <div className="flex items-center ml-2" style={{ transform: 'scaleX(1.4) skewX(-12deg)' }}>
              <span className="text-3xl font-black tracking-[-0.05em] leading-none">PSP</span>
            </div>
            <div className="flex flex-col uppercase tracking-widest text-[10px] font-bold leading-tight border-l border-white/20 pl-4 ml-2">
              <span>Archive</span>
              <span className="text-white/50">Colors</span>
            </div>
          </div>
          
          {/* Mobile View Toggles (visible only on small screens) */}
          <div className="flex md:hidden items-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
            <button onClick={() => setViewMode('timeline')} className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${viewMode === 'timeline' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <GitCommit size={12} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <LayoutGrid size={12} />
            </button>
          </div>
        </div>

        {/* Desktop View Toggles */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full p-1 pointer-events-auto backdrop-blur-md">
          <button onClick={() => setViewMode('timeline')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${viewMode === 'timeline' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
            <GitCommit size={14} /> Timeline
          </button>
          <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
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
              className="w-[110px] md:w-[140px] bg-white/5 border border-white/10 rounded-full pl-4 pr-8 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/80 outline-none focus:border-white/30 backdrop-blur-md appearance-none cursor-pointer"
            >
              {ALL_MODELS.map(m => (
                <option key={m} value={m} className="bg-black text-white">{m === 'all' ? 'All Models' : m}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-3 h-3 pointer-events-none text-white/50" />
          </div>

          {/* Color Filter */}
          <div className="relative flex items-center">
            <select 
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="w-[110px] md:w-[140px] bg-white/5 border border-white/10 rounded-full pl-4 pr-8 py-1.5 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/80 outline-none focus:border-white/30 backdrop-blur-md appearance-none cursor-pointer"
            >
              {COLOR_FAMILIES.map(c => (
                <option key={c} value={c} className="bg-black text-white">{c === 'all' ? 'All Colors' : c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-3 h-3 pointer-events-none text-white/50" />
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md shrink-0">
            {(['all', 'standard', 'limited'] as FilterType[]).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-mono uppercase tracking-widest transition-colors ${filterType === type ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/80'}`}
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedDetail(null)}
          >
            {/* Subtle background glow based on PSP color */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${selectedDetail.color.hex} 0%, transparent 70%)`
              }}
            />

            <button 
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-50"
              onClick={() => setSelectedDetail(null)}
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-full flex flex-col md:flex-row items-center gap-8 md:gap-16 overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image/Object */}
              <div className="flex-1 w-full flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                <CentralObject colorHex={selectedDetail.color.hex} imageUrl={selectedDetail.color.imageUrl} />
              </div>

              {/* Right: Details */}
              <div className="flex-1 w-full flex flex-col gap-4 text-left">
                <div className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                  {selectedDetail.model.year}
                </div>
                <div className="text-2xl md:text-3xl font-mono text-white/50 uppercase tracking-widest">
                  {selectedDetail.model.name}
                </div>
                
                <div className="w-12 h-1 bg-white/20 my-4" />

                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none">
                  {selectedDetail.color.name}
                </h2>
                
                <div className="flex items-center gap-3 text-sm font-mono text-white/60 uppercase tracking-wider mt-2">
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedDetail.color.hex }} />
                    {selectedDetail.color.hex}
                  </span>
                  <span>&bull;</span>
                  <span className={selectedDetail.color.type === 'limited' ? 'text-amber-400' : 'text-white/40'}>
                    {selectedDetail.color.type}
                  </span>
                </div>

                <p className="text-lg text-white/70 leading-relaxed font-mono mt-6">
                  {selectedDetail.model.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
