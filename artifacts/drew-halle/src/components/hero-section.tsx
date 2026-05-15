import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black overflow-hidden selection:bg-white selection:text-black">
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      
      {/* Top markers */}
      <div className="absolute top-20 left-4 font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
        01 · INTRO
      </div>
      <div className="absolute top-20 right-4 font-mono text-[10px] text-muted-foreground tracking-widest uppercase text-right">
        FRAME 0001 / 2026
      </div>
      <div className="absolute top-32 left-4 font-mono text-[10px] text-white tracking-widest uppercase">
        LUCA MARIANI · LUCA FILMS
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-20 w-full px-4">
        {/* Top thin line */}
        <div className="w-full max-w-4xl h-[1px] bg-white/10 mb-8" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white font-black leading-[0.8] tracking-tighter uppercase"
          style={{ fontSize: "clamp(100px, 18vw, 260px)" }}
        >
          LUCA<br />MARIANI
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 font-mono text-xs md:text-sm tracking-widest text-muted-foreground uppercase"
        >
          FILMMAKER · VIDEOGRAPHER · PHOTOGRAPHER — CHICAGO
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 font-mono text-[10px] tracking-widest text-white/40 uppercase"
        >
          SONY · FE 50mm · ƒ/1.4 GM · Ø82
        </motion.p>
      </div>

      {/* Bottom markers */}
      <div className="absolute bottom-8 left-4 flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        REC · 24.976 FPS
      </div>

      <div className="absolute bottom-8 right-4 font-mono text-[10px] tracking-widest uppercase text-white/50">
        REC · 24.976 FPS · TC 00:00:01:14
      </div>

      <motion.div 
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest uppercase text-white"
      >
        ↓ SCROLL FOR MENU
      </motion.div>

      {/* Nav links section directly below hero contextually */}
      <div className="w-full mt-32 border-t border-white/10 pt-16 pb-24 px-4 flex flex-col items-center">
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-12">EST. MMXIX · CHICAGO</p>
        
        <div className="font-mono text-xs tracking-widest text-white/60 mb-8 uppercase">[ SCROLL TO OPEN LENS ]</div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 font-sans font-medium text-4xl md:text-6xl tracking-widest uppercase text-white mb-16">
          <a href="#photography" className="hover:text-red-500 transition-colors">PHOTOGRAPHY</a>
          <span className="text-white/20 hidden md:inline">·</span>
          <a href="#film" className="hover:text-red-500 transition-colors">FILM</a>
          <span className="text-white/20 hidden md:inline">·</span>
          <a href="#contact" className="hover:text-red-500 transition-colors">CONTACT</a>
        </div>
        
        <div className="flex flex-col items-center gap-2 font-mono text-[10px] tracking-widest text-white/40 uppercase">
          <p>ƒ/1.4 · 1/250s · ISO 3200</p>
          <p>50MM · SUMMILUX</p>
        </div>
        
        <p className="mt-16 font-mono text-[10px] tracking-widest text-white/60 uppercase">SCROLL TO OPEN</p>
      </div>
    </section>
  );
}
