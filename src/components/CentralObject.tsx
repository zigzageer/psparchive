import { motion } from 'motion/react';

interface CentralObjectProps {
  colorHex: string;
  imageUrl?: string;
}

export function CentralObject({ colorHex, imageUrl }: CentralObjectProps) {
  return (
    <div className="relative z-10 flex items-center justify-center w-full h-full">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {imageUrl ? (
          <motion.div
            className="relative w-80 md:w-[600px] flex items-center justify-center drop-shadow-2xl"
            animate={{
              filter: `drop-shadow(0 0 40px ${colorHex}40)`,
            }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={imageUrl} 
              alt="PSP Color Variation" 
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ) : (
          /* Abstract PSP Shape Fallback */
          <motion.div
            className="w-72 h-32 md:w-[480px] md:h-[200px] rounded-full shadow-2xl relative overflow-hidden border border-white/10"
            animate={{
              backgroundColor: colorHex,
              boxShadow: `0 0 80px ${colorHex}40, inset 0 0 60px rgba(0,0,0,0.6)`,
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Glossy reflection */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-xl transform -translate-y-1/4" />
            
            {/* Screen placeholder */}
            <div className="absolute inset-y-4 inset-x-16 md:inset-y-6 md:inset-x-24 bg-black/90 rounded-sm border-2 border-black shadow-inner flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
               {/* Screen reflection */}
               <div className="absolute -top-10 -right-10 w-full h-full bg-white/5 rotate-45 transform origin-bottom-left" />
            </div>

            {/* D-Pad placeholder */}
            <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12">
              <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-black/60 rounded-sm shadow-inner" />
              <div className="absolute left-0 right-0 top-[35%] bottom-[35%] bg-black/60 rounded-sm shadow-inner" />
            </div>

            {/* Analog stick placeholder */}
            <div className="absolute left-6 md:left-10 bottom-3 md:bottom-5 w-4 h-4 md:w-6 md:h-6 bg-black/50 rounded-full shadow-inner border border-black/30" />

            {/* Buttons placeholder */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 grid grid-cols-2 grid-rows-2 gap-1 md:gap-1.5 rotate-45">
              <div className="bg-black/60 rounded-full shadow-inner" />
              <div className="bg-black/60 rounded-full shadow-inner" />
              <div className="bg-black/60 rounded-full shadow-inner" />
              <div className="bg-black/60 rounded-full shadow-inner" />
            </div>
          </motion.div>
        )}
        
        {/* Floating animation wrapper */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            y: [-10, 10, -10],
            rotateX: [-5, 5, -5],
            rotateY: [-5, 5, -5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}
