import { motion } from "framer-motion";

const CARDS = [
  {
    id: "N001",
    title: "PHOTO",
    titleSplit: "GRAPHY",
    category: "Concert & Sports Photography",
    meta: "STILLS · 2019—2026",
    image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69e402867fa26f6c418ac733/1776550552216/_MAH3562-Enhanced-NR2.jpg",
    link: "#photography"
  },
  {
    id: "N002",
    title: "FILM &",
    titleSplit: "MOTION",
    category: "Sports & Concert Film",
    meta: "FILMS · LIVE",
    image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ec25f79bc55a01653a1753/1777083907548/_MAH7246-Enhanced-NR.jpg",
    link: "#film"
  }
];

export default function WorkSection() {
  return (
    <section className="w-full min-h-screen bg-black py-24 border-t border-white/10" id="work">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-16 uppercase">
          <div className="flex items-start gap-4">
            <span className="font-mono text-2xl md:text-4xl text-white/50">02</span>
            <h2 className="font-sans text-5xl md:text-7xl font-bold tracking-widest text-white leading-none">
              SELECT WORK
            </h2>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[10px] tracking-widest text-muted-foreground">
            <p>REEL — LUCA MARIANI · MMXIX / MMXXVI</p>
            <p className="flex items-center gap-2 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              REC · N001
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl">
          {CARDS.map((card, idx) => (
            <motion.a 
              href={card.link}
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative flex flex-col gap-6 w-full cursor-pointer"
              data-testid={`card-work-${card.id}`}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
                <div className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-widest text-white uppercase mix-blend-difference">
                  {card.id}
                </div>
                <img 
                  src={card.image} 
                  alt={card.category} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>
              
              <div className="flex flex-col uppercase">
                <p className="font-mono text-[10px] tracking-widest text-white/50 mb-4">{card.category}</p>
                <h3 className="font-sans font-bold text-5xl md:text-6xl tracking-widest leading-[0.85] text-white group-hover:text-red-500 transition-colors">
                  {card.title}<br/>{card.titleSplit}
                </h3>
                
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                    {card.meta}
                  </p>
                  <span className="font-mono text-white group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-8 uppercase font-mono text-[10px] tracking-widest">
          <p className="text-white/60">SCROLL · CLICK TO ENTER →</p>
          <div className="flex items-center gap-8">
            <span className="text-white/40">01 / 02</span>
            <span className="text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              REC · 24.976
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
