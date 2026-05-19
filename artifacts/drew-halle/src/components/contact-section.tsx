import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const inputClass =
    "w-full bg-transparent border-b border-white/15 text-white/80 py-3 focus:outline-none focus:border-white/60 transition-colors font-mono text-xs tracking-widest placeholder:text-white/20";
  const labelClass = "font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1 block";

  return (
    <section className="w-full bg-black" id="contact">
      {/* ── Clapperboard header ── */}
      <div className="w-full">
        <div
          className="w-full h-20 flex items-center justify-center"
          style={{
            background:
              "repeating-linear-gradient(45deg, #ddd6c8 0px, #ddd6c8 18px, #111 18px, #111 36px)",
          }}
        >
          <div className="bg-[#141414] border border-[#2a2a2a] px-8 py-3 flex items-center gap-3 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
            <span className="font-mono text-[13px] md:text-sm tracking-[0.35em] text-white font-bold uppercase">
              GET IN TOUCH
            </span>
          </div>
        </div>
        <div className="w-full h-7 bg-[#222] flex items-center justify-center gap-10 border-b border-white/10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#3a3a3a] border border-[#555]" />
          ))}
        </div>
      </div>

      {/* ── Clapperboard body ── */}
      <div className="max-w-[860px] w-full mx-auto px-4 md:px-0 pb-16">
        <div className="border border-white/10 bg-[#0d0d0d]">
          {/* Metadata row */}
          <div className="flex items-stretch border-b border-red-900/40">
            <div className="border-r border-white/10 pl-5 pr-8 py-4 flex flex-col justify-center" style={{ borderLeft: "3px solid #dc2626" }}>
              <p className="font-mono text-[8px] tracking-widest text-white/40 uppercase mb-1">PRODUCTION</p>
              <p className="font-mono text-xs md:text-sm tracking-widest text-white font-bold uppercase">LUCA MARIANI</p>
            </div>
            <div className="border-r border-white/10 px-6 py-4 flex flex-col justify-center">
              <p className="font-mono text-[8px] tracking-widest text-white/40 uppercase mb-1">SCENE</p>
              <p className="font-mono text-xl font-bold text-white">08</p>
            </div>
            <div className="border-r border-white/10 px-6 py-4 flex flex-col justify-center">
              <p className="font-mono text-[8px] tracking-widest text-white/40 uppercase mb-1">TAKE</p>
              <p className="font-mono text-xl font-bold text-white">01</p>
            </div>
            <div className="px-6 py-4 flex flex-col justify-center">
              <p className="font-mono text-[8px] tracking-widest text-white/40 uppercase mb-1">ROLL</p>
              <p className="font-mono text-xl font-bold text-white">A</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[260px] flex flex-col justify-center font-mono text-sm tracking-widest text-white uppercase"
              >
                <span className="text-white/40 text-[9px] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> ACTION —
                </span>
                Message received —<br />let's create something.
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
                  <textarea required rows={5} placeholder="Tell me about your project..." className={`${inputClass} resize-none`} data-testid="input-message" />
                </div>
                <div className="border-t border-white/10 pt-5 mt-1">
                  <button
                    type="submit"
                    data-testid="button-submit"
                    className="flex items-center gap-2 border border-white/30 px-5 py-2 font-mono text-[10px] tracking-widest uppercase text-white/70 hover:text-white hover:border-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                    ACTION —
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Contact info + socials */}
        <div className="border border-t-0 border-white/10 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a]">
          <div className="flex flex-col gap-1 font-mono text-[10px] tracking-widest text-white/50 uppercase">
            <span className="text-white font-bold">■ LUCA MARIANI</span>
            <a href="mailto:lucafilmsbusiness@gmail.com" aria-label="Email Luca Mariani" className="hover:text-white transition-colors">
              lucafilmsbusiness@gmail.com
            </a>
            <a href="tel:2245349841" aria-label="Call Luca Mariani" className="hover:text-white transition-colors">
              224-534-9841
            </a>
          </div>
          <div className="flex gap-6 font-mono text-[10px] tracking-widest uppercase text-white/40">
            <a href="https://instagram.com/lucafilms__" target="_blank" rel="noopener noreferrer" aria-label="Instagram @lucafilms__" className="hover:text-white transition-colors">INSTAGRAM</a>
            <a href="https://www.tiktok.com/@lucafilms_" target="_blank" rel="noopener noreferrer" aria-label="TikTok @lucafilms_" className="hover:text-white transition-colors">TIKTOK</a>
            <a href="https://linkedin.com/in/luca-mariani-4858852ba" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="hover:text-white transition-colors">LINKEDIN</a>
          </div>
        </div>
      </div>
    </section>
  );
}
