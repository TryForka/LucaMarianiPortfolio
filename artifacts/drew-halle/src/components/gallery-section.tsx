import { motion } from "framer-motion";

const IMAGES = [
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69e402867fa26f6c418ac733/1776550552216/_MAH3562-Enhanced-NR2.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ec25f79bc55a01653a1753/1777083907548/_MAH7246-Enhanced-NR.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ec265a125ef53a4a78b615/1777084015971/DH_1.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee788d4583922c02bcb2c5/1777236117966/AfterPB_02.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee78547607771884822780/1777236055202/ABlue-3.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee7a0c252771215793fdff/1777236496725/AfterRed_07-2.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee88acbbad736f06caab54/1777240238418/_MAH7246-Enhanced-NR2.JPG.jpg",
  "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee7a410038cd5c6bd2e0b4/1777236558058/AfterPink_01.jpg"
];

export default function GallerySection() {
  return (
    <section className="w-full bg-black py-24 border-t border-white/10" id="photography">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 uppercase">
          <div className="flex items-end gap-2">
            <span className="font-mono text-xl md:text-2xl text-white/50">05</span>
            <h2 className="font-sans text-4xl md:text-5xl font-bold tracking-widest text-white leading-none">
              GALLERY
            </h2>
          </div>
          <a 
            href="https://www.lucafilms.com/photography" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest text-white hover:text-red-500 transition-colors"
          >
            VIEW ALL PHOTOS →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {IMAGES.map((src, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative aspect-[4/5] bg-white/5 overflow-hidden group cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Gallery image ${idx + 1}`} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              
              <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                FRAME {String(idx + 1).padStart(3, '0')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
