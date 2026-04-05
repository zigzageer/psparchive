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
  return (
    <div className="w-full h-full overflow-auto pt-40 pb-20 px-12 custom-scrollbar">
      <div className="flex gap-16 md:gap-32 min-w-max relative">
        {/* Horizontal Line */}
        <div className="absolute left-0 right-0 h-px bg-slate-300 top-6" />

        {data.map((model, i) => {
          if (filterModel !== 'all' && model.name !== filterModel) return null;

          const filteredColors = model.colors.filter(c => {
            const matchType = filterType === 'all' || c.type === filterType;
            const matchColor = filterColor === 'all' || c.name.toLowerCase().includes(filterColor.toLowerCase());
            return matchType && matchColor;
          });
          if (filteredColors.length === 0) return null;

          return (
            <motion.div
              key={model.id}
              className="relative flex flex-col items-center w-[320px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Node on the line */}
              <div className="absolute top-6 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-400 rounded-full z-10" />
              {/* Vertical Line hanging down */}
              <div className="absolute top-6 bottom-0 w-px bg-slate-300 -z-10" />

              <div className="mt-16 flex flex-col items-center w-full">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full flex flex-col items-center shadow-sm">
                  <div className="text-5xl font-bold tracking-tighter mb-1 text-slate-900">{model.year}</div>
                  <div className="text-lg font-mono text-slate-500 uppercase tracking-widest mb-8 text-center">{model.name}</div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {filteredColors.map((color, cIdx) => (
                      <motion.div
                        key={color.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1, y: -4 }}
                        transition={{ delay: i * 0.1 + cIdx * 0.02, type: "spring", stiffness: 300 }}
                        className="flex flex-col items-center gap-3 cursor-pointer"
                        onClick={() => onSelect?.(model, color)}
                      >
                        <MiniPSP colorHex={color.hex} imageUrl={color.imageUrl} className="w-24 h-12" />
                        <div className="text-[10px] font-mono text-center max-w-[90px] text-slate-600 opacity-80 hover:opacity-100 transition-opacity leading-tight">
                          {color.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
