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
        <div className="absolute left-0 right-0 h-px bg-white/20 top-6" />

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
              <div className="absolute top-6 -translate-y-1/2 w-4 h-4 bg-black border-2 border-white rounded-full z-10" />
              {/* Vertical Line hanging down */}
              <div className="absolute top-6 bottom-0 w-px bg-white/10 -z-10" />

              <div className="mt-16 flex flex-col items-center w-full">
                <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full flex flex-col items-center shadow-2xl">
                  <div className="text-5xl font-bold tracking-tighter mb-1">{model.year}</div>
                  <div className="text-lg font-mono text-white/50 uppercase tracking-widest mb-8 text-center">{model.name}</div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {filteredColors.map((color, cIdx) => (
                      <motion.div
                        key={color.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + cIdx * 0.02 }}
                        className="flex flex-col items-center gap-3 group cursor-pointer"
                        onClick={() => onSelect?.(model, color)}
                      >
                        <MiniPSP colorHex={color.hex} imageUrl={color.imageUrl} className="w-24 h-12 group-hover:scale-110 transition-transform" />
                        <div className="text-[10px] font-mono text-center max-w-[90px] opacity-60 group-hover:opacity-100 transition-opacity leading-tight">
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
