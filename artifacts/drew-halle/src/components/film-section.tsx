import { motion } from "framer-motion";

export default function FilmSection() {
  return (
    <section className="w-full bg-black py-24 border-t border-white/10" id="film">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 uppercase">
          <div className="flex items-end gap-2">
            <span className="font-mono text-xl md:text-2xl text-white/50">04</span>
            <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-widest text-white leading-none">
              FILM
            </h2>
          </div>
          <a 
            href="https://www.lucafilms.com/videography" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest text-white hover:text-red-500 transition-colors"
          >
            VIEW ALL FILMS →
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer"
        >
          {/* Faux video player UI */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
          
          <div className="absolute top-4 left-4 z-20 font-mono text-[10px] tracking-widest text-white uppercase">
            DREW HALLÉ — LIVE REEL
          </div>
          
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 font-mono text-[10px] tracking-widest text-white uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            REC
          </div>
          
          {/* Play button */}
          <div className="z-20 w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-white flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1 md:border-t-[12px] md:border-l-[18px] md:border-b-[12px]" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end font-mono text-[10px] tracking-widest text-white uppercase border-t border-white/20 pt-4">
            <p>00:00:00:00</p>
            <p>1920×1080 · 24FPS</p>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] tracking-widest text-white/50 uppercase">
          <p className="flex items-center gap-2 text-white">
            <span className="w-1 h-1 bg-white" /> PLAYING
          </p>
          <p>01/09 · GFLIP · GET ME OUTTA HERE</p>
        </div>
      </div>
    </section>
  );
}
