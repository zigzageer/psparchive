import { motion } from 'motion/react';

const PS_ICONS = [
  // Triangle (Green)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full text-green-400/50"><polygon points="12,4 21,19 3,19" /></svg>,
  // Circle (Red)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full text-red-500/50"><circle cx="12" cy="12" r="8" /></svg>,
  // Cross (Blue)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full text-blue-500/50"><path d="M7 7L17 17M17 7L7 17" /></svg>,
  // Square (Pink)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full text-pink-400/50"><rect x="5" y="5" width="14" height="14" /></svg>
];

export function OrbitBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Concentric circles */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/10"
          style={{
            width: `${i * 30}vw`,
            height: `${i * 30}vw`,
            minWidth: `${i * 300}px`,
            minHeight: `${i * 300}px`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 50 + i * 20,
            repeat: Infinity,
            ease: "linear",
            direction: i % 2 === 0 ? "reverse" : "normal",
          }}
        >
          {/* Orbiting PS Icons */}
          <div className="absolute top-0 left-1/2 w-5 h-5 -ml-2.5 -mt-2.5 bg-black rounded-full flex items-center justify-center">
            {PS_ICONS[(i - 1) % 4]}
          </div>
          <div className="absolute bottom-0 left-1/2 w-6 h-6 -ml-3 -mb-3 bg-black rounded-full flex items-center justify-center">
            {PS_ICONS[(i) % 4]}
          </div>
          {i % 2 === 0 && (
            <div className="absolute left-0 top-1/2 w-4 h-4 -ml-2 -mt-2 bg-black rounded-full flex items-center justify-center">
              {PS_ICONS[(i + 1) % 4]}
            </div>
          )}
          {i % 3 === 0 && (
            <div className="absolute right-0 top-1/2 w-5 h-5 -mr-2.5 -mt-2.5 bg-black rounded-full flex items-center justify-center">
              {PS_ICONS[(i + 2) % 4]}
            </div>
          )}
        </motion.div>
      ))}
      
      {/* Dashed lines like in the reference */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
