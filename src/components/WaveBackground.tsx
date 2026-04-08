import { motion } from 'motion/react';

export function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-[#000000] via-[#0a192f] to-[#000000]">
      <svg
        className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] opacity-60 mix-blend-screen"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,500 C300,300 700,700 1000,500"
          fill="none"
          stroke="url(#wave-grad)"
          strokeWidth="4"
          animate={{
            d: [
              "M0,500 C300,300 700,700 1000,500",
              "M0,500 C400,700 600,300 1000,500",
              "M0,500 C300,300 700,700 1000,500"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,500 C300,300 700,700 1000,500 L1000,1000 L0,1000 Z"
          fill="rgba(255,255,255,0.02)"
          animate={{
            d: [
              "M0,500 C300,300 700,700 1000,500 L1000,1000 L0,1000 Z",
              "M0,500 C400,700 600,300 1000,500 L1000,1000 L0,1000 Z",
              "M0,500 C300,300 700,700 1000,500 L1000,1000 L0,1000 Z"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,520 C200,400 800,600 1000,520"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          animate={{
            d: [
              "M0,520 C200,400 800,600 1000,520",
              "M0,520 C300,600 700,400 1000,520",
              "M0,520 C200,400 800,600 1000,520"
            ]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {/* Sparkles / Noise */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-overlay"></div>
    </div>
  );
}
