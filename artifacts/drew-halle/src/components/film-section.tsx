import { motion } from "framer-motion";

export default function FilmSection() {
  return (
    <section className="w-full bg-black py-24 border-t border-white/10" id="film">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 uppercase">
          <div className="flex items-end gap-2">
            <span className="font-mono text-xl md:text-2xl text-white/50">04</span>
            <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-widest text-white leading-none">
              SHORT FILMS
            </h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center"
        >
          {/* Subtle scanline texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
            }}
          />

          <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
            LUCA FILMS — SHORT FILMS
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/30 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            STANDBY
          </div>

          {/* Coming soon center */}
          <div className="z-10 flex flex-col items-center gap-4 text-center px-4">
            <div className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-2">
              — IN PRODUCTION —
            </div>
            <p className="font-sans text-3xl md:text-5xl font-black tracking-widest text-white uppercase">
              COMING SOON
            </p>
            <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase max-w-xs">
              Short film projects launching 2025 — 2026
            </p>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[10px] tracking-widest text-white/20 uppercase border-t border-white/10 pt-4">
            <p>00:00:00:00</p>
            <p>LUCA FILMS · CHICAGO</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
