import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MiniPSP } from './MiniPSP';
import { PSPModel } from '../data';
import { MonitorSmartphone, Gamepad2, Disc3, Radio, Tv } from 'lucide-react';

interface TimelineViewProps {
  data: PSPModel[];
  filterType: 'all' | 'standard' | 'limited';
  filterModel: string;
  filterColor: string;
  onSelect?: (model: PSPModel, color: PSPModel['colors'][0]) => void;
}

export function TimelineView({ data, filterType, filterModel, filterColor, onSelect }: TimelineViewProps) {
  const [activeCol, setActiveCol] = useState(0);
  const [activeRow, setActiveRow] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);

  const filteredData = data.filter(model => filterModel === 'all' || model.name === filterModel).map(model => ({
    ...model,
    colors: model.colors.filter(color => {
      const typeMatch = filterType === 'all' || color.type === filterType;
      const familyMatch = filterColor === 'all' || color.name.toLowerCase().includes(filterColor.toLowerCase());
      return typeMatch && familyMatch;
    })
  })).filter(model => model.colors.length > 0);

  // Reset indices if data changes and out of bounds
  useEffect(() => {
    if (activeCol >= filteredData.length) {
      setActiveCol(Math.max(0, filteredData.length - 1));
      setActiveRow(0);
    } else if (filteredData[activeCol] && activeRow >= filteredData[activeCol].colors.length) {
      setActiveRow(Math.max(0, filteredData[activeCol].colors.length - 1));
    }
  }, [filteredData, activeCol, activeRow]);

  // Focus container on mount for keyboard events
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredData.length === 0) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveCol(prev => {
          const next = Math.max(0, prev - 1);
          if (next !== prev) setActiveRow(0);
          return next;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveCol(prev => {
          const next = Math.min(filteredData.length - 1, prev + 1);
          if (next !== prev) setActiveRow(0);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveRow(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveRow(prev => Math.min(filteredData[activeCol].colors.length - 1, prev + 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const model = filteredData[activeCol];
        if (model && model.colors[activeRow]) {
          onSelect?.(model, model.colors[activeRow]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCol, activeRow, filteredData, onSelect]);

  // Wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 50) return; // Debounce
    lastWheelTime.current = now;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 0) {
        setActiveCol(prev => {
          const next = Math.min(filteredData.length - 1, prev + 1);
          if (next !== prev) setActiveRow(0);
          return next;
        });
      } else {
        setActiveCol(prev => {
          const next = Math.max(0, prev - 1);
          if (next !== prev) setActiveRow(0);
          return next;
        });
      }
    } else {
      if (e.deltaY > 0) {
        setActiveRow(prev => Math.min(filteredData[activeCol].colors.length - 1, prev + 1));
      } else {
        setActiveRow(prev => Math.max(0, prev - 1));
      }
    }
  };

  if (filteredData.length === 0) return <div className="text-white text-center mt-40">No results found</div>;

  const icons = [Gamepad2, MonitorSmartphone, Disc3, Radio, Tv];

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-hidden outline-none cursor-default" 
      tabIndex={0} 
      onWheel={handleWheel}
    >
      {/* Fixed Crosshair Origin */}
      <div className="absolute left-[30%] top-[35%] w-0 h-0">

        {/* Horizontal Row */}
        <motion.div
          className="absolute flex items-center"
          animate={{ x: activeCol * -180 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        >
          {filteredData.map((model, cIdx) => {
            const Icon = icons[cIdx % icons.length];
            const isActive = cIdx === activeCol;

            return (
              <div
                key={model.id}
                className="absolute flex flex-col items-center justify-center cursor-pointer"
                style={{ left: cIdx * 180, width: 180, marginLeft: -90 }}
                onClick={() => {
                  setActiveCol(cIdx);
                  setActiveRow(0);
                }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                  <Icon size={48} strokeWidth={1.5} />
                </motion.div>

                <motion.div
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
                  className="absolute top-20 text-xl font-bold tracking-widest whitespace-nowrap drop-shadow-md text-white"
                >
                  {model.name}
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Vertical Column */}
        <motion.div
          className="absolute flex flex-col"
          animate={{ y: activeRow * -90 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        >
          {filteredData[activeCol]?.colors.map((color, rIdx) => {
            const isActive = rIdx === activeRow;

            return (
              <div
                key={color.name}
                className="absolute flex items-center gap-6 cursor-pointer"
                style={{ top: rIdx * 90 + 120, left: -60, width: 500 }}
                onClick={() => {
                  if (isActive) {
                    onSelect?.(filteredData[activeCol], color);
                  } else {
                    setActiveRow(rIdx);
                  }
                }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 0.8,
                    opacity: isActive ? 1 : 0.3,
                    x: isActive ? 0 : -10
                  }}
                  className="flex-shrink-0"
                >
                  <MiniPSP colorHex={color.hex} imageUrl={color.imageUrl} className="w-24 h-12" />
                </motion.div>

                <motion.div
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    x: isActive ? 10 : 0,
                    scale: isActive ? 1.05 : 1
                  }}
                  className="flex flex-col"
                >
                  <span className="text-lg font-bold text-white drop-shadow-md whitespace-nowrap">{color.name}</span>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-white/60 uppercase tracking-widest mt-1"
                    >
                      {color.type}
                    </motion.span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
