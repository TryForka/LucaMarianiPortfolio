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
            LUCA MARIANI — FILMMAKER · VIDEOGRAPHER · PHOTOGRAPHER
          </p>

          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-3xl md:text-5xl lg:text-6xl font-semibold leading-[0.9] tracking-widest text-white uppercase mb-12"
          >
            CONCERT PHOTOGRAPHY. SPORTS FILMS. BRAND WORK. BASED IN CHICAGO — AVAILABLE WORLDWIDE.
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl"
          >
            <div className="flex flex-col gap-6">
              <p className="font-sans text-lg md:text-xl tracking-widest leading-relaxed text-muted-foreground uppercase">
                I SHOOT CONCERTS, SPORTS, AND BRAND WORK OUT OF CHICAGO — VIDEO AND PHOTO. I STARTED WITH SKIS ON MY FEET AND A CAMERA IN MY HAND. THAT EYE CARRIED OVER INTO EVERYTHING ELSE.
              </p>
              <p className="font-sans text-lg md:text-xl tracking-widest leading-relaxed text-muted-foreground uppercase">
                I SHOOT AT THE SALT SHED FOR ARTISTS LIKE LORD HURON, INDIGO DE SOUZA, AND THE RED CLAY STRAYS. I CUT HYPE FILMS FOR SPORTS PROGRAMS. I DO BRAND WORK FOR RESTAURANTS AND RESORTS.
              </p>
              <p className="font-sans text-lg md:text-xl tracking-widest leading-relaxed text-muted-foreground uppercase">
                CLEAN EDITS, REAL STORY, NO FILLER.
              </p>
            </div>

            <div className="flex flex-col gap-8 font-mono text-xs tracking-widest uppercase">
              <div>
                <p className="text-white/40 mb-2 border-b border-white/10 pb-2">AWARDS</p>
                <p className="text-white leading-loose">CHICAGO STUDENT EMMY<br/>CINEMATOGRAPHY<br/><span className="text-white/60">TWO-TIME NOMINEE</span></p>
              </div>
              <div>
                <p className="text-white/40 mb-2 border-b border-white/10 pb-2">SERVICES</p>
                <p className="text-white leading-loose">
                  CONCERT & LIVE MUSIC<br/>
                  SPORTS HYPE FILMS<br/>
                  BRAND & COMMERCIAL<br/>
                  WEDDINGS<br/>
                  PHOTOGRAPHY<br/>
                  CUSTOM PROJECTS
                </p>
              </div>
              <div>
                <p className="text-white/40 mb-2 border-b border-white/10 pb-2">BASED IN</p>
                <p className="text-white leading-loose">CHICAGO, IL<br/><span className="text-white/60">WILL TRAVEL</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-16 font-mono text-[10px] tracking-widest uppercase text-white/50">
          <p>[ 03 / 07 ]</p>
          <p className="flex items-center gap-2 text-white">↓ FILM</p>
        </div>
      </div>
    </section>
  );
}
