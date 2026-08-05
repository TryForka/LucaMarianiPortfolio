import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { useGetPhotos } from "@workspace/api-client-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Photo = {
  id: string;
  src: string;
  alt: string;
  artist?: string;
};

type PhotoCategory = {
  key: string;
  dbValue: string;
  label: string;
  sub: string;
};

// ── Category config (display order + metadata) ─────────────────────────────────

const CATEGORY_CONFIG: PhotoCategory[] = [
  { key: "music", dbValue: "Music", label: "MUSIC", sub: "Concert films · Live performances · Artist portraits" },
  { key: "snow", dbValue: "Snow", label: "SNOW", sub: "Alpine · Winter landscapes · Nature" },
  { key: "sports", dbValue: "Sports", label: "SPORTS", sub: "Athletic campaigns · Event coverage · Action" },
  { key: "event", dbValue: "Hospitality & Events", label: "EVENTS", sub: "Venues · Brand showcases · Celebrations" },
];

// ── Photo Lightbox ─────────────────────────────────────────────────────────────

function PhotoLightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: Photo[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const photo = photos[index];

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col max-h-[88dvh] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-8 inset-x-0 flex items-center justify-between z-10 px-1">
          <button
            onClick={onClose}
            className="font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white transition-colors flex items-center gap-2"
            aria-label="Close photo lightbox"
          >
            ← BACK
          </button>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/40 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {index + 1} / {photos.length}
          </div>
        </div>

        <div className="border border-white/10 overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={photo.id}
              src={photo.src}
              alt={photo.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block max-h-[80dvh] max-w-[90vw] w-auto h-auto object-contain"
            />
          </AnimatePresence>
        </div>

        <div className="absolute -bottom-8 inset-x-0 flex items-center justify-between z-10 px-1">
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase truncate max-w-[60%]">
            {photo.artist ? `${photo.artist} · ` : ""}{photo.alt}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={prev} className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition-colors" aria-label="Previous photo">
              ← PREV
            </button>
            <button onClick={next} className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition-colors" aria-label="Next photo">
              NEXT →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Photo Card ─────────────────────────────────────────────────────────────────

function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="break-inside-avoid mb-4 cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="overflow-hidden">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="w-full h-auto block opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
        />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full border border-white/70 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </div>
      {photo.artist && (
        <div className="absolute top-2 left-2 font-mono text-[8px] tracking-widest uppercase text-white/60 bg-black/60 px-2 py-0.5">
          {photo.artist}
        </div>
      )}
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Photography() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  const { data: rawItems, isLoading } = useGetPhotos();

  // Group DB items into category buckets in the configured display order
  const categories = useMemo(() => {
    const byDbValue: Record<string, Photo[]> = {};
    (rawItems ?? []).forEach((item) => {
      const key = item.category;
      if (!byDbValue[key]) byDbValue[key] = [];
      byDbValue[key].push({
        id: String(item.id),
        src: item.embedUrl,
        alt: item.title,
        artist: item.altText ?? undefined,
      });
    });

    return CATEGORY_CONFIG.map((cfg) => ({
      ...cfg,
      photos: byDbValue[cfg.dbValue] ?? [],
    })).filter((c) => c.photos.length > 0 || !rawItems); // keep all while loading
  }, [rawItems]);

  const visibleCategories = rawItems ? categories : CATEGORY_CONFIG.map((c) => ({ ...c, photos: [] }));

  const filtered = activeCategory
    ? visibleCategories.filter((c) => c.key === activeCategory)
    : visibleCategories;

  const openLightbox = useCallback((photos: Photo[], index: number) => {
    setLightbox({ photos, index });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Nav />

      <header className="pt-32 pb-16 px-4 md:px-8 border-b border-white/10 max-w-[1600px] mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/">
              <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase hover:text-white transition-colors cursor-pointer flex items-center gap-2 mb-8">
                ← BACK TO HOME
              </span>
            </Link>
            <h1
              className="font-sans font-black uppercase tracking-tighter leading-none text-white whitespace-nowrap"
              style={{ fontSize: "clamp(3rem, 13.5vw, 240px)" }}
            >
              PHOTOGRAPHY
            </h1>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[10px] tracking-widest text-white/30 uppercase mt-auto pb-2">
            <p>LUCA MARIANI · LUCA FILMS</p>
            <p>CHICAGO · WORLDWIDE</p>
            <p className="flex items-center gap-2 text-white/60 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              STILLS · 24.976 FPS
            </p>
          </div>
        </div>

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
          {visibleCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 border transition-colors ${
                activeCategory === cat.key
                  ? "border-white text-white bg-white/10"
                  : "border-white/20 text-white/40 hover:border-white/50 hover:text-white/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 space-y-24">
        {isLoading && (
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">LOADING...</p>
        )}
        {filtered.map((cat, catIdx) => (
          cat.photos.length === 0 ? null : (
            <motion.section
              key={cat.key}
              id={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIdx * 0.05 }}
            >
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-2">
                    {String(catIdx + 1).padStart(2, "0")}
                  </p>
                  <h2
                    className="font-sans font-black uppercase leading-[0.85] text-white"
                    style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
                  >
                    {cat.label}
                  </h2>
                  <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase mt-3">{cat.sub}</p>
                </div>
                <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase hidden md:block">
                  {cat.photos.length} FRAME{cat.photos.length !== 1 ? "S" : ""}
                </span>
              </div>

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {cat.photos.map((photo, photoIdx) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onClick={() => openLightbox(cat.photos, photoIdx)}
                  />
                ))}
              </div>
            </motion.section>
          )
        ))}
      </main>

      <Footer />

      <AnimatePresence>
        {lightbox && (
          <PhotoLightbox
            photos={lightbox.photos}
            startIndex={lightbox.index}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
