import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="w-full min-h-[100dvh] bg-black py-24 border-t border-white/10 flex flex-col" id="about">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full flex-1 flex flex-col">
        <div className="flex items-end gap-4 mb-16 uppercase">
          <span className="font-mono text-2xl md:text-4xl text-white/50">03</span>
          <h2 className="font-sans text-5xl md:text-7xl font-bold tracking-widest text-white leading-none">
            ABOUT
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase mb-8">
            DREW HALLÉ — PHOTOGRAPHER · VIDEOGRAPHER · CREATIVE
          </p>

          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-4xl md:text-6xl lg:text-7xl font-semibold leading-[0.9] tracking-widest text-white uppercase mb-12"
            style={{ wordSpacing: "-0.1em" }}
          >
            CONCERT PHOTOGRAPHER, VIDEOGRAPHER, AND MUSIC MARKETING CREATIVE — WITH A UNIQUE BLEND OF VISUAL STORYTELLING AND INDUSTRY EXPERTISE.
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl"
          >
            <p className="font-sans text-xl md:text-2xl tracking-widest leading-relaxed text-muted-foreground uppercase">
              PUBLISHED IN BILLBOARD AND VARIETY MAGAZINE. TOURING EXPERIENCE WITH MULTIPLE ARTISTS. MEDIA CREDENTIALS AT MAJOR FESTIVALS ACROSS NORTH AMERICA. WORKED WITH WARNER MUSIC AND ATLANTIC RECORDS.
            </p>

            <div className="flex flex-col gap-8 font-mono text-xs tracking-widest uppercase">
              <div>
                <p className="text-white/40 mb-2 border-b border-white/10 pb-2">PUBLISHED IN</p>
                <p className="text-white leading-loose">BILLBOARD<br/>VARIETY MAGAZINE</p>
              </div>
              <div>
                <p className="text-white/40 mb-2 border-b border-white/10 pb-2">LABELS</p>
                <p className="text-white leading-loose">WARNER MUSIC<br/>ATLANTIC RECORDS</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-16 font-mono text-[10px] tracking-widest uppercase text-white/50">
          <p>[ 03 / 08 ]</p>
          <p className="flex items-center gap-2 text-white">↓ FILM</p>
        </div>
      </div>
    </section>
  );
}
