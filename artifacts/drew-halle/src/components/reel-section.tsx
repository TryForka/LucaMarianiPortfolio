import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const NOISE_SVG = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")';

// ─────────────────────────────────────────────
// HOW TO ADD YOUR REEL:
//   YouTube: paste your video ID below (the part after "watch?v=")
//   Vimeo:   set SOURCE to "vimeo" and paste your numeric video ID
// ─────────────────────────────────────────────
const SOURCE: "youtube" | "vimeo" = "youtube";
const VIDEO_ID = "EWRG-pAbhFY";

function buildSrc() {
  if (SOURCE === "vimeo") {
    return `https://player.vimeo.com/video/${VIDEO_ID}?autoplay=1&muted=1&loop=1&background=1&title=0&byline=0&portrait=0`;
  }
  return `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`;
}

const isPlaceholder = VIDEO_ID === "YOUR_VIDEO_ID_HERE";

export default function ReelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20% 0px" });

  const [textPhase, setTextPhase] = useState<"hidden" | "visible" | "gone">("hidden");

  useEffect(() => {
    if (!isInView) return;
    setTextPhase("visible");
    const timer = setTimeout(() => setTextPhase("gone"), 3000);
    return () => clearTimeout(timer);
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.2"],
  });

  const grainOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] bg-black overflow-hidden"
      id="reel"
    >
      {/* VIDEO LAYER */}
      <motion.div className="absolute inset-0" style={{ opacity: videoOpacity }}>
        {isPlaceholder ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
            <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase text-center px-8">
              ADD YOUR YOUTUBE OR VIMEO VIDEO ID IN<br />
              <span className="text-white/60">src/components/reel-section.tsx</span>
            </p>
          </div>
        ) : (
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/EWRG-pAbhFY?si=cKkJ0s-bkFqt9zCJ&controls=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ border: "none" }}
          />
        )}
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </motion.div>

      {/* GRAIN LAYER — fades out as you scroll in */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ opacity: grainOpacity, backgroundImage: NOISE_SVG }}
      />
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none -z-10"
        style={{ opacity: grainOpacity }}
      />

      {/* OVERLAY TEXT — appears, holds 3 s, then fades out */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={
          textPhase === "visible"
            ? { opacity: 1 }
            : textPhase === "gone"
            ? { opacity: 0 }
            : { opacity: 0 }
        }
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <p className="font-mono text-[10px] tracking-widest text-white/60 uppercase mb-6">
          LUCA MARIANI — CINEMATOGRAPHY REEL
        </p>
        <p
          className="font-sans font-black text-white/10 uppercase tracking-widest text-center"
          style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.85 }}
        >
          LUCA<br />FILMS
        </p>
      </motion.div>

      {/* HUD corners */}
      <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-white/40 uppercase z-20">
        REEL · MMXIX / MMXXVI
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] tracking-widest text-white/40 uppercase z-20 text-right">
        CINEMATOGRAPHY
      </div>
      <div className="absolute bottom-8 left-4 flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white z-20">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        REC · 24.976 FPS
      </div>
      <div className="absolute bottom-8 right-4 font-mono text-[10px] tracking-widest uppercase text-white/40 z-20">
        TC 00:00:00:00
      </div>
    </section>
  );
}
