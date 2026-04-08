import { motion } from 'motion/react';
import { MiniPSP } from './MiniPSP';
import { PSPModel } from '../data';

interface GridViewProps {
  data: PSPModel[];
  filterType: 'all' | 'standard' | 'limited';
  filterModel: string;
  filterColor: string;
  onSelect?: (model: PSPModel, color: PSPModel['colors'][0]) => void;
}

export function GridView({ data, filterType, filterModel, filterColor, onSelect }: GridViewProps) {
  const items = data.flatMap(m =>
    m.colors.map(c => ({ color: c, model: m }))
  ).filter(item => {
    const matchModel = filterModel === 'all' || item.model.name === filterModel;
    const matchType = filterType === 'all' || item.color.type === filterType;
    const matchColor = filterColor === 'all' || item.color.name.toLowerCase().includes(filterColor.toLowerCase());
    return matchModel && matchType && matchColor;
  });

  return (
    <div className="w-full h-full overflow-y-auto pt-40 pb-20 px-6 custom-scrollbar">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12 max-w-[1600px] mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={`${item.model.name}-${item.color.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ delay: Math.min(i * 0.02, 0.5), type: "spring", stiffness: 300 }}
            className="flex flex-col items-center gap-4 cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-colors"
            onClick={() => onSelect?.(item.model, item.color)}
          >
            <MiniPSP colorHex={item.color.hex} imageUrl={item.color.imageUrl} className="w-32 h-16" />
            <div className="text-center flex flex-col items-center">
              <div className="text-xs font-bold uppercase tracking-wider leading-tight mb-1.5 text-white drop-shadow-sm">{item.color.name}</div>
              <div className="text-[10px] font-mono text-white/60 uppercase flex items-center gap-2 drop-shadow-sm">
                <span>{item.model.name}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{item.model.year}</span>
              </div>
              {item.color.type === 'limited' && (
                <div className="text-[9px] font-mono text-amber-400 uppercase mt-2 border border-amber-400/30 px-2 py-0.5 rounded-sm bg-amber-400/10">
                  Limited
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
