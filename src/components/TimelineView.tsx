import { motion } from 'motion/react';
import { MiniPSP } from './MiniPSP';
import { PSPModel } from '../data';

interface TimelineViewProps {
  data: PSPModel[];
  filterType: 'all' | 'standard' | 'limited';
  filterModel: string;
  filterColor: string;
  onSelect?: (model: PSPModel, color: PSPModel['colors'][0]) => void;
}

export function TimelineView({ data, filterType, filterModel, filterColor, onSelect }: TimelineViewProps) {
  const filteredData = data.filter(model => filterModel === 'all' || model.name === filterModel).map(model => ({
    ...model,
    colors: model.colors.filter(color => {
      const typeMatch = filterType === 'all' || color.type === filterType;
      const familyMatch = filterColor === 'all' || color.name.toLowerCase().includes(filterColor.toLowerCase());
      return typeMatch && familyMatch;
    })
  })).filter(model => model.colors.length > 0);

  if (filteredData.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-slate-500">No results found</div>;
  }

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-auto pt-32 pb-20 px-12 custom-scrollbar flex items-start">
      <div className="relative flex gap-12 min-w-max px-12 pb-12">
        {/* Horizontal Line */}
        <div className="absolute top-[11px] left-0 right-0 h-[2px] bg-slate-300/50 z-0" />

        {filteredData.map((model, i) => (
          <motion.div 
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex flex-col items-center"
          >
            {/* Timeline Node */}
            <div className="w-6 h-6 rounded-full bg-white border-[3px] border-slate-300 z-10 mb-8 shadow-sm relative">
              {/* Vertical Line */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-8 bg-slate-300/50" />
            </div>

            {/* Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 p-8 w-[320px] flex flex-col items-center border border-slate-100">
              <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">{model.year}</h2>
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-[0.3em] mb-10">{model.name}</h3>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 w-full">
                {model.colors.map((color) => (
                  <motion.div 
                    key={color.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => onSelect?.(model, color)}
                  >
                    <MiniPSP colorHex={color.hex} imageUrl={color.imageUrl} className="w-24 h-12 mb-4" />
                    <span className="text-[10px] font-mono text-slate-500 text-center leading-tight px-2">
                      {color.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
