import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/nav";

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.78a4.85 4.85 0 0 1-1.02-.09z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "INSTAGRAM",
    handle: "@lucafilms__",
    href: "https://instagram.com/lucafilms__",
    Icon: IconInstagram,
    color: "hover:text-pink-400",
  },
  {
    label: "TIKTOK",
    handle: "@lucafilms_",
    href: "https://www.tiktok.com/@lucafilms_",
    Icon: IconTikTok,
    color: "hover:text-white",
  },
  {
    label: "LINKEDIN",
    handle: "luca-mariani",
    href: "https://linkedin.com/in/luca-mariani-4858852ba",
    Icon: IconLinkedIn,
    color: "hover:text-blue-400",
  },
];

const inputClass =
  "w-full bg-transparent border-b border-white/15 text-white/80 py-3 focus:outline-none focus:border-white/60 transition-colors font-mono text-xs tracking-widest placeholder:text-white/20";
const labelClass =
  "font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1 block";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />

      {/* Page header */}
      <div className="pt-24 pb-0 px-4 md:px-8 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-4">
            LUCA FILMS · CONTACT
          </p>
          <h1
            className="font-sans font-black uppercase tracking-tighter leading-none text-white whitespace-nowrap"
            style={{ fontSize: "clamp(3rem, 14vw, 240px)" }}
          >
            CONTACT
          </h1>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[10px] tracking-widest text-white/30 uppercase pb-3">
          <p>LUCA MARIANI · LUCA FILMS</p>
          <p>CHICAGO · WORLDWIDE</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-8" />

      {/* Main grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">

        {/* ── Left: Info panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-12"
        >
          {/* Contact details */}
          <div className="flex flex-col gap-6">
            <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase">
              DIRECT CONTACT
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">Name</p>
                <p className="font-sans text-2xl md:text-3xl font-black tracking-widest text-white uppercase">
                  LUCA MARIANI
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">Email</p>
                <a
                  href="mailto:lucafilmsbusiness@gmail.com"
                  className="font-mono text-sm md:text-base font-bold tracking-wider text-white hover:text-white/60 transition-colors break-all"
                >
                  lucafilmsbusiness@gmail.com
                </a>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="font-mono text-[8px] tracking-widest text-white/30 uppercase mb-1">Phone</p>
                <a
                  href="tel:2245349841"
                  className="font-mono text-xl md:text-2xl font-bold tracking-widest text-white hover:text-white/60 transition-colors"
                >
                  224-534-9841
                </a>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase">
              FOLLOW
            </p>
            <div className="flex flex-col gap-3">
              {SOCIALS.map(({ label, handle, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 border border-white/10 px-5 py-4 transition-colors hover:border-white/40 bg-[#0d0d0d] hover:bg-white/5 ${color}`}
                >
                  <span className="text-white/50 group-hover:text-current transition-colors">
                    <Icon />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[8px] tracking-widest text-white/30 uppercase">
                      {label}
                    </span>
                    <span className="font-mono text-sm font-bold tracking-widest text-white group-hover:text-current transition-colors">
                      {handle}
                    </span>
                  </div>
                  <span className="ml-auto font-mono text-[10px] text-white/20 group-hover:text-current transition-colors">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Based in */}
          <div className="border-t border-white/10 pt-6 font-mono text-[9px] tracking-widest text-white/30 uppercase leading-relaxed">
            <p>BASED IN CHICAGO, ILLINOIS</p>
            <p className="mt-1 text-white/20">AVAILABLE FOR TRAVEL · WORLDWIDE</p>
          </div>
        </motion.div>

        {/* ── Right: Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Clapperboard header stripe */}
          <div
            className="w-full h-14 flex items-center justify-center mb-0"
            style={{
              background:
                "repeating-linear-gradient(45deg, #ddd6c8 0px, #ddd6c8 14px, #111 14px, #111 28px)",
            }}
          >
            <div className="bg-[#141414] border border-[#2a2a2a] px-6 py-2.5 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span className="font-mono text-[11px] tracking-[0.35em] text-white font-bold uppercase">
                SEND A MESSAGE
              </span>
            </div>
          </div>

          {/* Hinge */}
          <div className="w-full h-6 bg-[#222] flex items-center justify-center gap-8 border-b border-white/10 mb-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#3a3a3a] border border-[#555]" />
            ))}
          </div>

          {/* Slate metadata */}
          <div className="flex items-stretch border border-white/10 border-t-0 bg-[#0d0d0d]">
            <div className="border-r border-white/10 pl-5 pr-8 py-3 flex flex-col justify-center" style={{ borderLeft: "3px solid #dc2626" }}>
              <p className="font-mono text-[7px] tracking-widest text-white/30 uppercase mb-0.5">PRODUCTION</p>
              <p className="font-mono text-xs tracking-widest text-white font-bold uppercase">LUCA MARIANI</p>
            </div>
            <div className="border-r border-white/10 px-5 py-3 flex flex-col justify-center">
              <p className="font-mono text-[7px] tracking-widest text-white/30 uppercase mb-0.5">SCENE</p>
              <p className="font-mono text-lg font-bold text-white">09</p>
            </div>
            <div className="border-r border-white/10 px-5 py-3 flex flex-col justify-center">
              <p className="font-mono text-[7px] tracking-widest text-white/30 uppercase mb-0.5">TAKE</p>
              <p className="font-mono text-lg font-bold text-white">01</p>
            </div>
            <div className="px-5 py-3 flex flex-col justify-center">
              <p className="font-mono text-[7px] tracking-widest text-white/30 uppercase mb-0.5">ROLL</p>
              <p className="font-mono text-lg font-bold text-white">A</p>
            </div>
          </div>

          {/* Form body */}
          <div className="border border-t-0 border-white/10 bg-[#0d0d0d] p-6 md:p-8">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[280px] flex flex-col justify-center"
              >
                <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> ACTION —
                </span>
                <p className="font-sans text-3xl md:text-4xl font-black tracking-widest text-white uppercase leading-tight">
                  Message received —<br />let's create something.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input required type="text" placeholder="Your name" className={inputClass} data-testid="input-name" />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input required type="email" placeholder="your@email.com" className={inputClass} data-testid="input-email" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <input required type="text" placeholder="What's the shoot?" className={inputClass} data-testid="input-subject" />
                </div>
                <div>
                  <label className={labelClass}>Message</label>
                  <textarea required rows={6} placeholder="Tell me about your project..." className={`${inputClass} resize-none`} data-testid="input-message" />
                </div>
                <div className="border-t border-white/10 pt-5 flex items-center justify-between mt-1">
                  <button
                    type="submit"
                    data-testid="button-submit"
                    className="flex items-center gap-2 border border-white/30 px-6 py-2.5 font-mono text-[10px] tracking-widest uppercase text-white/70 hover:text-white hover:border-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                    ACTION —
                  </button>
                  <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase hidden md:block">
                    24–48 hr response time
                  </span>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
