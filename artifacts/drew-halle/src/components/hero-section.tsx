import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch\'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

type Phase = "gate" | "fading" | "video" | "unlocked";

export default function HeroSection() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [lucaFilmsVisible, setLucaFilmsVisible] = useState(false);
  const triggered = useRef(false);

  // Lock scroll while gate is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  const triggerGate = useCallback(() => {
    if (triggered.current) return;
    triggered.current = true;

    setPhase("fading");

    setTimeout(() => {
      setPhase("video");
      setLucaFilmsVisible(true);
    }, 1200);

    // "LUCA FILMS" text fades out after 3s of showing
    setTimeout(() => setLucaFilmsVisible(false), 4200);

    // Unlock scroll — video stays in page flow, just scrolls away naturally
    setTimeout(() => {
      setPhase("unlocked");
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }, 4500);
  }, []);

  useEffect(() => {
    const onWheel = () => triggerGate();
    const onTouch = () => triggerGate();
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "Space", "PageDown"].includes(e.code)) triggerGate();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [triggerGate]);

  const showGate = phase === "gate" || phase === "fading";
  const showVideo = phase === "video" || phase === "unlocked";

  return (
    <>
      <style>{`
        @keyframes grainMove {
          0%   { transform: translate(0px, 0px); }
          10%  { transform: translate(-4px, -6px); }
          20%  { transform: translate(8px, 4px); }
          30%  { transform: translate(-6px, 8px); }
          40%  { transform: translate(4px, -4px); }
          50%  { transform: translate(-8px, 6px); }
          60%  { transform: translate(6px, -8px); }
          70%  { transform: translate(-4px, 4px); }
          80%  { transform: translate(8px, -6px); }
          90%  { transform: translate(-6px, -4px); }
          100% { transform: translate(0px, 0px); }
        }
        .grain-move {
          animation: grainMove 0.08s steps(1) infinite;
          will-change: transform;
        }
      `}</style>

      {/* ── GATE OVERLAY: fixed, fades out on scroll ── */}
      <AnimatePresence>
        {showGate && (
          <motion.div
            key="gate"
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <div
              className="grain-move absolute inset-0 pointer-events-none opacity-35 mix-blend-screen"
              style={{ backgroundImage: NOISE_SVG, backgroundSize: "200px 200px" }}
            />
            <div className="absolute top-20 left-4 font-mono text-[10px] text-white/40 tracking-widest uppercase">01 · INTRO</div>
            <div className="absolute top-20 right-4 font-mono text-[10px] text-white/40 tracking-widest uppercase text-right">FRAME 0001 / 2026</div>
            <div className="absolute top-32 left-4 font-mono text-[10px] text-white/60 tracking-widest uppercase">LUCA MARIANI · LUCA FILMS</div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-4">
              <div className="w-full max-w-4xl h-[1px] bg-white/10 mb-8" />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-white font-black tracking-tighter uppercase leading-[0.85]"
                style={{ fontSize: "clamp(100px, 18vw, 260px)" }}
              >
                LUCA<br />MARIANI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-12 font-mono text-xs md:text-sm tracking-widest text-white/50 uppercase"
              >
                FILMMAKER · VIDEOGRAPHER · PHOTOGRAPHER — CHICAGO
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-4 font-mono text-[10px] tracking-widest text-white/30 uppercase"
              >
                SONY · FE 50mm · ƒ/1.4 GM · Ø82
              </motion.p>
            </div>

            <div className="absolute bottom-8 left-4 flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              REC · 24.976 FPS
            </div>
            <div className="absolute bottom-8 right-4 font-mono text-[10px] tracking-widest uppercase text-white/40">
              REC · 24.976 FPS · TC 00:00:01:14
            </div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest uppercase text-white/60"
            >
              ↓ SCROLL TO ENTER
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION: always in page flow ── */}
      <section className="relative w-full bg-black overflow-hidden" id="hero">

        {/* VIDEO — lives in the page, fades in, scrolls away naturally */}
        <motion.div
          className="relative w-full h-[100dvh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: showVideo ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* clip-path hides YouTube title bar (top) and controls bar (bottom) */}
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(48px 0px)" }}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/EWRG-pAbhFY?si=cKkJ0s-bkFqt9zCJ&controls=0&autoplay=1&mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ border: "none" }}
            />
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* LUCA FILMS overlay */}
          <AnimatePresence>
            {lucaFilmsVisible && (
              <motion.div
                key="lucafilms"
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
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
            )}
          </AnimatePresence>

          {/* HUD corners */}
          <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-white/40 uppercase z-20">REEL · MMXIX / MMXXVI</div>
          <div className="absolute top-4 right-4 font-mono text-[10px] tracking-widest text-white/40 uppercase z-20 text-right">CINEMATOGRAPHY</div>
          <div className="absolute bottom-8 left-4 flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white z-20">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            REC · 24.976 FPS
          </div>
        </motion.div>

        {/* NAV LINKS — below the video, part of normal scroll flow */}
        <div className="relative w-full border-t border-white/10 pt-16 pb-24 px-4 flex flex-col items-center bg-black">
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen"
            style={{ backgroundImage: NOISE_SVG, backgroundSize: "200px 200px" }}
          />
          <p className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-12">EST. MMXIX · CHICAGO</p>
          <div className="font-mono text-xs tracking-widest text-white/40 mb-8 uppercase">[ SELECT A CATEGORY ]</div>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 font-sans font-medium text-4xl md:text-6xl tracking-widest uppercase text-white mb-16">
            <a href="#photography" data-testid="link-photography" className="hover:text-red-500 transition-colors font-bold">PHOTOGRAPHY</a>
            <span className="text-white/20 hidden md:inline">·</span>
            <a href="#film" data-testid="link-film" className="hover:text-red-500 transition-colors font-bold">FILM</a>
            <span className="text-white/20 hidden md:inline">·</span>
            <a href="#contact" data-testid="link-contact" className="hover:text-red-500 transition-colors font-bold">CONTACT</a>
          </div>
          <div className="flex flex-col items-center gap-2 font-mono text-[10px] tracking-widest text-white/30 uppercase">
            <p>ƒ/1.4 · 1/250s · ISO 3200</p>
            <p>50MM · SUMMILUX</p>
          </div>
        </div>
      </section>
    </>
  );
}
