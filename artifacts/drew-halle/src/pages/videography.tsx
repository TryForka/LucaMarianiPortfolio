import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

type Video = {
  id: string;
  title: string;
  src: string;
  aspect: "16/9" | "9/16";
  allow?: string;
  referrerPolicy?: string;
};

type Category = {
  key: string;
  label: string;
  sub: string;
  videos: Video[];
};

const ALLOW_STD = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
const REF_STD = "strict-origin-when-cross-origin";

const CATEGORIES: Category[] = [
  {
    key: "music",
    label: "MUSIC",
    sub: "Concert films · Live performances · Artist narratives",
    videos: [
      {
        id: "m1",
        title: "Red Clay Strays",
        src: "https://www.youtube.com/embed/r_59JjsZaz4?controls=0&modestbranding=1&rel=0&playsinline=1",
        aspect: "9/16",
        allow: ALLOW_STD,
      },
    ],
  },
  {
    key: "sports",
    label: "SPORTS",
    sub: "Athletic campaigns · Event coverage · Brand films",
    videos: [
      {
        id: "s1",
        title: "Roll South",
        src: "https://www.youtube-nocookie.com/embed/XG2WVE4Y0cg?si=u48GD5YMB6n6GxiH&controls=0",
        aspect: "16/9",
        allow: ALLOW_STD,
        referrerPolicy: REF_STD,
      },
      {
        id: "s2",
        title: "Glenbrook South Football",
        src: "https://www.youtube-nocookie.com/embed/u4KPLhTTo3g?si=V7RTadZUw6uKyaJp&controls=0",
        aspect: "16/9",
        allow: ALLOW_STD,
        referrerPolicy: REF_STD,
      },
      {
        id: "s3",
        title: "Glenbrook South Hockey",
        src: "https://www.youtube-nocookie.com/embed/vSOkSNK1-E4?si=QA3ee9odZ2WRs7Jj&controls=0",
        aspect: "16/9",
        allow: ALLOW_STD,
        referrerPolicy: REF_STD,
      },
      {
        id: "s4",
        title: "Crystal Ridge Park Follow Cam",
        src: "https://www.youtube.com/embed/VwkKoKVDU3g?modestbranding=1&rel=0&playsinline=1",
        aspect: "9/16",
        allow: ALLOW_STD,
      },
      {
        id: "s5",
        title: "Alpine Valley Park Follow Cam #1",
        src: "https://www.youtube.com/embed/o5AmOaYRXjw?modestbranding=1&rel=0&playsinline=1",
        aspect: "9/16",
        allow: ALLOW_STD,
      },
      {
        id: "s6",
        title: "Alpine Valley Park Follow Cam #3",
        src: "https://www.youtube.com/embed/p-lvvaiAmOQ?modestbranding=1&rel=0&playsinline=1",
        aspect: "9/16",
        allow: ALLOW_STD,
      },
      {
        id: "s7",
        title: "Alpine Valley Park Follow Cam #2",
        src: "https://www.youtube.com/embed/_H6hO0xat2s?modestbranding=1&rel=0&playsinline=1",
        aspect: "9/16",
        allow: ALLOW_STD,
      },
    ],
  },
  {
    key: "hospitality",
    label: "HOSPITALITY\n& EVENTS",
    sub: "Venues · Brand showcases · Weddings & celebrations",
    videos: [
      {
        id: "h1",
        title: "Ovvio",
        src: "https://www.youtube-nocookie.com/embed/vXhoXWMxVr0?si=hyk8Th8K5eyMKj-_&controls=0",
        aspect: "16/9",
        allow: ALLOW_STD,
        referrerPolicy: REF_STD,
      },
      {
        id: "h2",
        title: "Ovvio",
        src: "https://www.youtube-nocookie.com/embed/STKgmNhSFP0?si=CTtxMoX7NUXfw3bd&controls=0",
        aspect: "16/9",
        allow: ALLOW_STD,
        referrerPolicy: REF_STD,
      },
      {
        id: "h3",
        title: "Alpine Valley Resorts Wedding",
        src: "https://www.youtube-nocookie.com/embed/ROQukR7EJgA?si=yfDztzVF7diBHTo4&controls=0",
        aspect: "16/9",
        allow: ALLOW_STD,
        referrerPolicy: REF_STD,
      },
      {
        id: "h4",
        title: "Lake Forest Chiro",
        src: "https://www.youtube.com/embed/xlhhCYGaEqo?si=3GockmbNT9IHYxb0&controls=0&modestbranding=1&rel=0&playsinline=1",
        aspect: "9/16",
        allow: ALLOW_STD,
      },
    ],
  },
];

function VideoCard({ video }: { video: Video }) {
  const [muted, setMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isPortrait = video.aspect === "9/16";

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const next = !muted;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: next ? "mute" : "unMute", args: "" }),
      "*"
    );
    setMuted(next);
  }, [muted]);

  // Ensure JS API is enabled for postMessage mute control
  const src = video.src.includes("enablejsapi") ? video.src : `${video.src}&enablejsapi=1`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-0 w-full"
    >
      {/* Clip-path hides YouTube title bar (top) and progress/controls bar (bottom) */}
      <div
        className={`relative w-full bg-black overflow-hidden ${isPortrait ? "aspect-[9/16]" : "aspect-video"}`}
        style={{ clipPath: "inset(48px 0px)" }}
      >
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full"
          src={src}
          title={video.title}
          frameBorder="0"
          allow={video.allow}
          referrerPolicy={video.referrerPolicy as React.IframeHTMLAttributes<HTMLIFrameElement>["referrerPolicy"]}
          allowFullScreen
        />
      </div>

      {/* Mute toggle — subtle, below the video */}
      <div className="flex items-center justify-between border border-t-0 border-white/10 px-3 py-2 bg-black">
        <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase truncate">{video.title}</p>
        <button
          onClick={toggleMute}
          className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-white/40 hover:text-white transition-colors shrink-0 ml-4"
        >
          {muted ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
              </svg>
              UNMUTE
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06ZM15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
              </svg>
              MUTE
            </>
          )}
        </button>
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

export default function Videography() {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
              {cat.videos.length === 0 &&
                [0, 1, 2].map((i) => <PlaceholderCard key={i} />)}
            </div>
          </motion.section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
