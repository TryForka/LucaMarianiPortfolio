import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section className="w-full bg-black py-24 border-t border-white/10" id="contact">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-end gap-4 mb-16 uppercase">
          <span className="font-mono text-2xl md:text-4xl text-white/50">07</span>
          <h2 className="font-sans text-5xl md:text-7xl font-bold tracking-widest text-white leading-none">
            GET IN TOUCH
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-32">
          {/* Metadata / Clapperboard */}
          <div className="flex flex-col justify-between">
            <div className="font-mono text-xs tracking-widest uppercase border border-white/20 p-6 bg-[#0a0a0a]">
              <div className="border-b border-white/10 pb-4 mb-4 flex justify-between">
                <span className="text-white/50">PRODUCTION</span>
                <span className="text-white">LUCA FILMS</span>
              </div>
              <div className="border-b border-white/10 pb-4 mb-4 flex justify-between">
                <span className="text-white/50">SCENE</span>
                <span className="text-white">07</span>
              </div>
              <div className="border-b border-white/10 pb-4 mb-4 flex justify-between">
                <span className="text-white/50">TAKE</span>
                <span className="text-white">01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">ROLL</span>
                <span className="text-white">A</span>
              </div>
            </div>

            <div className="mt-16 font-mono text-xs tracking-widest text-white/60 space-y-4">
              <p className="uppercase text-white">■ LUCA MARIANI</p>
              <a href="mailto:lucafilmsbusiness@gmail.com" className="block hover:text-white transition-colors">
                lucafilmsbusiness@gmail.com
              </a>
              <a href="tel:2245349841" className="block hover:text-white transition-colors">
                224-534-9841
              </a>
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <a href="https://instagram.com/lucafilms__" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase">IG</a>
                <a href="https://www.tiktok.com/@luca.mariani.3" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase">TT</a>
                <a href="https://linkedin.com/in/luca-mariani-4858852ba" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase">LI</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full min-h-[400px] flex flex-col justify-center font-sans text-4xl md:text-5xl tracking-widest text-white uppercase leading-tight"
              >
                <span className="text-white/50 font-mono text-xs mb-8">ACTION —</span>
                Message received —<br />
                let's create something.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-mono text-xs tracking-widest uppercase">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-white/50">NAME</label>
                    <input required type="text" className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-white transition-colors" data-testid="input-name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-white/50">EMAIL</label>
                    <input required type="email" className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-white transition-colors" data-testid="input-email" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-white/50">SUBJECT</label>
                  <input required type="text" className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-white transition-colors" data-testid="input-subject" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-white/50">MESSAGE</label>
                  <textarea required rows={6} className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-white transition-colors resize-none" data-testid="input-message" />
                </div>

                <button 
                  type="submit"
                  data-testid="button-submit"
                  className="mt-4 bg-white text-black py-4 px-8 font-bold hover:bg-white/90 transition-colors w-full md:w-auto self-start"
                >
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
