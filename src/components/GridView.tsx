import { motion } from 'motion/react';
import { PSPModel } from '../data';
import { slugify } from '../utils';
import blobManifest from '../blob-manifest.json';

const manifest = blobManifest as Record<string, string[]>;

interface GridViewProps {
  data: PSPModel[];
  filterType: 'all' | 'standard' | 'limited';
  filterModel: string;
  filterColor: string;
  onSelect?: (model: PSPModel, color: PSPModel['colors'][0]) => void;
}

function getFrontImage(modelId: string, colorName: string, fallback?: string): string | undefined {
  const key = `${modelId}/${slugify(colorName)}`;
  const urls = manifest[key];
  if (urls) {
    const front = urls.find(u => u.includes('front'));
    if (front) return front;
    return urls[0];
  }
  return fallback;
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
    <div className="w-full h-full overflow-y-auto pt-36 md:pt-28 pb-20 px-4 md:px-8 custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12 max-w-[1400px] mx-auto items-start">
        {items.map((item, i) => {
          const imgUrl = getFrontImage(item.model.id, item.color.name, item.color.imageUrl);

          return (
            <motion.div
              key={`${item.model.name}-${item.color.name}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.4 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
              onClick={() => onSelect?.(item.model, item.color)}
            >
              <div className="flex flex-col items-start">
                {/* PSP image — fixed aspect ratio so all rows align */}
                <div className="relative w-full flex items-center justify-center mb-3">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={item.color.name}
                      className="h-[200px] md:h-[280px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                      style={{ filter: 'drop-shadow(0px 10px 24px rgba(0,0,0,0.25)) drop-shadow(0px 3px 8px rgba(0,0,0,0.1))' }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-3/4 aspect-[16/6] rounded-full"
                      style={{
                        backgroundColor: item.color.hex,
                        boxShadow: '0px 10px 24px rgba(0,0,0,0.2), inset 0 0 15px rgba(0,0,0,0.1)',
                      }}
                    />
                  )}
                </div>

                {/* Info — XMB glow text */}
                <h3
                  className="font-psp text-base md:text-lg tracking-tight text-white leading-tight"
                  style={{ textShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(200,220,255,0.3)' }}
                >
                  {item.color.name}
                </h3>
                <div
                  className="flex items-center gap-2 text-[10px] font-mono text-white/70 uppercase tracking-wider"
                  style={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}
                >
                  <span>{item.model.name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{item.model.year}</span>
                  {item.color.type === 'limited' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span className="text-amber-300" style={{ textShadow: '0 0 8px rgba(255,200,50,0.5)' }}>Limited</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
