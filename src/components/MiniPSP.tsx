export function MiniPSP({ colorHex, imageUrl, className = '' }: { colorHex: string, imageUrl?: string, className?: string }) {
  if (imageUrl) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img 
          src={imageUrl} 
          alt="PSP" 
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(3px 5px 10px rgba(0,0,0,0.2))' }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden border border-black/5 ${className}`}
      style={{
        backgroundColor: colorHex,
        boxShadow: `3px 5px 12px rgba(0,0,0,0.15), inset 0 0 10px rgba(0,0,0,0.1)`
      }}
    >
      <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-md transform -translate-y-1/4" />
      <div className="absolute inset-y-[15%] inset-x-[20%] bg-black/90 rounded-sm border border-black shadow-inner flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </div>
      <div className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[12%] h-[30%]">
        <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-black/60 rounded-sm" />
        <div className="absolute left-0 right-0 top-[35%] bottom-[35%] bg-black/60 rounded-sm" />
      </div>
      <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[12%] h-[30%] grid grid-cols-2 grid-rows-2 gap-[2px] rotate-45">
        <div className="bg-black/60 rounded-full" />
        <div className="bg-black/60 rounded-full" />
        <div className="bg-black/60 rounded-full" />
        <div className="bg-black/60 rounded-full" />
      </div>
    </div>
  );
}
