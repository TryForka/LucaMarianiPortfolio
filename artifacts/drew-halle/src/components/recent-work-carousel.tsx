import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGetRecentWork } from "@workspace/api-client-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getYoutubeThumbnail(url: string): string {
  const match = url.match(/\/embed\/([^?&/]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  return "";
}

type WorkItem = {
  id: number;
  type: string;
  embedUrl: string;
  title: string;
  category: string;
  dateAdded: string;
  active: boolean;
  aspectRatio?: string | null;
};

function WorkCard({ item }: { item: WorkItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isVideo = item.type === "video";
  const thumbnail = isVideo ? getYoutubeThumbnail(item.embedUrl) : item.embedUrl;

  return (
    <div className="flex-shrink-0 w-[72vw] sm:w-[340px] md:w-[380px] lg:w-[400px] flex flex-col group">
      {/* Media area — fixed 16:9 */}
      <div className="relative w-full aspect-video bg-white/5 border border-white/10 overflow-hidden">
        {isVideo ? (
          isPlaying ? (
            <iframe
              src={`${item.embedUrl}${item.embedUrl.includes("?") ? "&" : "?"}autoplay=1&controls=1`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full cursor-pointer text-left"
              aria-label={`Play ${item.title}`}
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  onError={(e) => {
                    const vid = item.embedUrl.match(/\/embed\/([^?&/]+)/)?.[1];
                    if (vid) (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:border-white group-hover:bg-black/40 transition-all duration-300">
                  <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )
        ) : (
          <img
            src={item.embedUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2 font-mono text-[8px] tracking-[0.2em] text-white/70 uppercase bg-black/70 px-1.5 py-0.5 backdrop-blur-sm">
          {item.category}
        </div>
      </div>

      {/* Labels */}
      <div className="border border-t-0 border-white/10 px-3 py-2.5 flex items-center justify-between gap-2 bg-black">
        <p className="font-mono text-[9px] tracking-widest text-white/70 uppercase truncate">
          {item.title}
        </p>
        <span className="font-mono text-[8px] tracking-widest text-white/30 uppercase flex-shrink-0">
          {item.type === "video" ? "VIDEO" : "PHOTO"}
        </span>
      </div>
    </div>
  );
}

export default function RecentWorkCarousel() {
  const { data: items } = useGetRecentWork();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [items]);

  if (!items || items.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.clientWidth ?? 380;
    el.scrollBy({ left: dir === "right" ? cardWidth + 16 : -(cardWidth + 16), behavior: "smooth" });
  };

  return (
    <section className="w-full bg-black py-16 md:py-20 border-t border-white/10" id="recent-work">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="px-4 md:px-8 flex items-end justify-between gap-4 mb-8 uppercase">
          <div className="flex items-end gap-3">
            <span className="font-mono text-lg md:text-2xl text-white/30">00</span>
            <h2 className="font-sans text-3xl md:text-5xl font-black tracking-widest text-white leading-none">
              RECENT WORK
            </h2>
          </div>

          {/* Arrows — desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-9 h-9 border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "border-white/40 text-white/70 hover:border-white hover:text-white"
                  : "border-white/10 text-white/20 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-9 h-9 border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "border-white/40 text-white/70 hover:border-white hover:text-white"
                  : "border-white/10 text-white/20 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Track — edge-to-edge with px padding on first/last cards */}
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:snap-none px-4 md:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start flex-shrink-0">
              <WorkCard item={item} />
            </div>
          ))}
        </motion.div>

        {/* Mobile hint */}
        <p className="mt-4 px-4 font-mono text-[8px] tracking-[0.3em] text-white/20 uppercase md:hidden">
          SWIPE TO BROWSE
        </p>
      </div>
    </section>
  );
}
