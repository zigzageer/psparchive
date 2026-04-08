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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 max-w-[1600px] mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={`${item.model.name}-${item.color.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ delay: Math.min(i * 0.02, 0.5), type: "spring", stiffness: 300 }}
            className="flex flex-col items-center gap-6 cursor-pointer"
            onClick={() => onSelect?.(item.model, item.color)}
          >
            <MiniPSP colorHex={item.color.hex} imageUrl={item.color.imageUrl} className="w-56 h-28 md:w-64 md:h-32" />
            <div className="text-center flex flex-col items-center">
              <div className="text-sm font-bold uppercase tracking-wider leading-tight mb-1.5 text-slate-800">{item.color.name}</div>
              <div className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                <span>{item.model.name}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{item.model.year}</span>
              </div>
              {item.color.type === 'limited' && (
                <div className="text-[9px] font-mono text-amber-600 uppercase mt-2 border border-amber-200 px-2 py-0.5 rounded-sm bg-amber-50">
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
