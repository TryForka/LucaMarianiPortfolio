import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  client?: string;
};

type Category = {
  key: string;
  label: string;
  sub: string;
  videos: Video[];
};

const CATEGORIES: Category[] = [
  {
    key: "music",
    label: "MUSIC",
    sub: "Concert films · Live performances · Artist narratives",
    videos: [
      // Add your YouTube video IDs here — e.g. { id: "m1", youtubeId: "dQw4w9WgXcQ", title: "Lord Huron @ The Salt Shed", client: "Lord Huron" }
    ],
  },
  {
    key: "sports",
    label: "SPORTS",
    sub: "Athletic campaigns · Event coverage · Brand films",
    videos: [],
  },
  {
    key: "hospitality",
    label: "HOSPITALITY\n& EVENTS",
    sub: "Venues · Brand showcases · Weddings & celebrations",
    videos: [],
  },
];

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="group relative aspect-video bg-white/5 overflow-hidden cursor-pointer"
    >
      <img
        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border border-white/60 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300">
          <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        {video.client && (
          <p className="font-mono text-[9px] tracking-widest text-white/50 uppercase mb-1">{video.client}</p>
        )}
        <p className="font-sans font-bold text-sm tracking-wide text-white uppercase leading-tight">{video.title}</p>
      </div>
    </motion.div>
  );
}

function PlaceholderCard() {
  return (
    <div className="relative aspect-video bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-white/20 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="font-mono text-[9px] tracking-widest text-white/20 uppercase">VIDEO COMING SOON</p>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl aspect-video"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&controls=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 font-mono text-[10px] tracking-widest text-white/60 hover:text-white uppercase flex items-center gap-2 transition-colors"
        >
          <span>ESC · CLOSE</span>
          <span className="text-base leading-none">×</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Videography() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? CATEGORIES.filter((c) => c.key === activeCategory)
    : CATEGORIES;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Nav />

      {/* Page header */}
      <header className="pt-32 pb-16 px-4 md:px-8 border-b border-white/10 max-w-[1600px] mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/">
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase hover:text-white transition-colors cursor-pointer flex items-center gap-2 mb-8">
                ← BACK TO HOME
              </span>
            </Link>
            <h1
              className="font-sans font-black uppercase tracking-tighter leading-[0.85] text-white"
              style={{ fontSize: "clamp(72px, 12vw, 180px)" }}
            >
              VIDEO<br />GRAPHY
            </h1>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[10px] tracking-widest text-white/30 uppercase mt-auto pb-2">
            <p>LUCA MARIANI · LUCA FILMS</p>
            <p>CHICAGO · WORLDWIDE</p>
            <p className="flex items-center gap-2 text-white/60 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              REC · 24.976 FPS
            </p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-3 mt-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors ${
              activeCategory === null
                ? "border-white text-white bg-white/10"
                : "border-white/20 text-white/40 hover:border-white/50 hover:text-white/70"
            }`}
          >
            ALL
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors ${
                activeCategory === cat.key
                  ? "border-white text-white bg-white/10"
                  : "border-white/20 text-white/40 hover:border-white/50 hover:text-white/70"
              }`}
            >
              {cat.label.replace("\n", " ")}
            </button>
          ))}
        </div>
      </header>

      {/* Category sections */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 space-y-24">
        {filtered.map((cat, catIdx) => (
          <motion.section
            key={cat.key}
            id={cat.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: catIdx * 0.05 }}
          >
            {/* Section header */}
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-2">
                  {String(catIdx + 1).padStart(2, "0")}
                </p>
                <h2
                  className="font-sans font-black uppercase leading-[0.85] text-white whitespace-pre-line"
                  style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
                >
                  {cat.label}
                </h2>
                <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase mt-3">{cat.sub}</p>
              </div>
              <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase hidden md:block">
                {cat.videos.length} FILM{cat.videos.length !== 1 ? "S" : ""}
              </span>
            </div>

            {/* Video grid */}
            {cat.videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.videos.map((v) => (
                  <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <PlaceholderCard key={i} />
                ))}
              </div>
            )}
          </motion.section>
        ))}
      </main>

      <Footer />

      {/* Video modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}
