import { motion } from "framer-motion";

const PRESS = [
  { id: "01", name: "BILLBOARD", link: "#" },
  { id: "02", name: "VARIETY", link: "#" },
  { id: "03", name: "MELODIC MAGAZINE", link: "#" }
];

const CLIENTS = [
  "JONAS BROTHERS", "LIVE NATION WOMEN", "JADE LEMAC", "GRAE", "JESSIA", 
  "LIVE NATION CANADA", "ATLANTIC RECORDS", "TASH SULTANA", "NERIAH", 
  "GROUPLOVE", "G FLIP", "ELIJAH WOODS", "TOVE LO", "XANA", "UPSAHL", 
  "GAYLE", "RISE AGAINST", "AUSTIN MILLZ", "BOLDEN.", "JIGITZ", 
  "WARNER MUSIC", "RIGHTCALL MEDIA"
];

export default function PressSection() {
  return (
    <section className="w-full bg-black py-24 border-t border-white/10" id="press">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-16 uppercase text-center">
          <p className="font-mono text-[10px] tracking-widest text-white/50 mb-4">AS SEEN IN · WORKED WITH</p>
          <div className="flex items-start gap-4">
            <span className="font-mono text-xl md:text-2xl text-white/50">06</span>
            <h2 className="font-sans text-4xl md:text-6xl font-bold tracking-widest text-white leading-none">
              PRESS & CLIENTS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-16 border-t border-b border-white/10 py-16">
          {/* Press Column */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs tracking-widest text-white/50 mb-8 uppercase">PRESS</h3>
            <div className="flex flex-col gap-6">
              {PRESS.map((item, idx) => (
                <motion.a 
                  href={item.link}
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex items-center justify-between border-b border-white/10 pb-6 uppercase"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[10px] text-white/30">{item.id}</span>
                    <span className="font-sans text-3xl md:text-4xl font-bold tracking-widest text-white group-hover:text-red-500 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-white/50 group-hover:text-white transition-colors">
                    READ ARTICLE →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Clients Column */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs tracking-widest text-white/50 mb-8 uppercase">CLIENTS & COLLABORATORS</h3>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap gap-x-4 gap-y-2 uppercase leading-loose"
            >
              {CLIENTS.map((client, idx) => (
                <span key={idx} className="font-sans text-xl md:text-2xl font-medium tracking-widest text-white/80 hover:text-white transition-colors">
                  {client}
                  {idx < CLIENTS.length - 1 && <span className="mx-4 text-white/20">·</span>}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 font-mono text-[10px] tracking-widest text-white/50 uppercase text-center md:text-left">
          <p className="max-w-2xl leading-relaxed">
            RECORD LABELS · MANAGEMENT · LIVE EVENTS · DIGITAL CAMPAIGNS · EDITORIAL · TOURING
          </p>
          <div className="flex items-center gap-8">
            <span>[ 06 / 08 ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
