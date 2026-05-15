import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const PRESETS = [
  { name: "PURPLE", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee788d4583922c02bcb2c5/1777236117966/AfterPB_02.jpg" },
  { name: "BLUE", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee78547607771884822780/1777236055202/ABlue-3.jpg" },
  { name: "LABRINTH", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee88d00038cd5c6bd7a389/1777240273430/_MAH84402.JPG.jpg" },
  { name: "RED", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee7a0c252771215793fdff/1777236496725/AfterRed_07-2.jpg" },
  { name: "BLUE II", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee7854fc2c2d2c78238c26/1777236054348/ABlue-2.jpg" },
  { name: "CHAPPELL ROAN", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee88acbbad736f06caab54/1777240238418/_MAH7246-Enhanced-NR2.JPG.jpg" },
  { name: "PURPLE II", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee7996053aed54d37ead96/1777236403155/APurple-1.jpg" },
  { name: "PINK", image: "https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee7a410038cd5c6bd2e0b4/1777236558058/AfterPink_01.jpg" }
];

const LIGHT_SETTINGS = [
  { label: "Exposure", value: "+2" },
  { label: "Contrast", value: "0" },
  { label: "Highlights", value: "-10" },
  { label: "Shadows", value: "+10" },
  { label: "Whites", value: "0" },
  { label: "Blacks", value: "0" }
];

const COLOR_SETTINGS = [
  { label: "Temp", value: "+6" },
  { label: "Tint", value: "-8" },
  { label: "Vibrance", value: "+12" },
  { label: "Saturation", value: "+6" }
];

export default function StoreSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState(PRESETS[0]);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("mouseup", () => setIsDragging(false));
      window.addEventListener("touchend", () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", () => setIsDragging(false));
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <section className="w-full bg-black py-24 border-t border-white/10" id="store">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 uppercase">
          <div className="flex items-end gap-4">
            <span className="font-mono text-2xl md:text-4xl text-white/50">07</span>
            <h2 className="font-sans text-5xl md:text-7xl font-bold tracking-widest text-white leading-none">
              STORE
            </h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-widest text-white/50 mb-1">LIGHTROOM PRESETS · CONCERT PHOTOGRAPHY</p>
            <p className="font-mono text-xs tracking-widest text-white">PRESET STUDIO · {activePreset.name} / COLOR CORRECTION</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-12">
          {/* Before/After Slider */}
          <div 
            ref={sliderRef}
            className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-white/5 overflow-hidden select-none touch-none"
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src={activePreset.image} 
                alt="After" 
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            
            {/* Before Image (Foreground, clipped) */}
            <div 
              className="absolute inset-0 w-full h-full border-r border-white"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img 
                src="https://static1.squarespace.com/static/61461a32bf91ca2c3266e5e9/t/69ee78dd0f5cfb4075ad5f8d/1777236191133/BeforePB_02-1.jpg" 
                alt="Before" 
                className="w-full h-full object-cover grayscale"
                draggable={false}
              />
            </div>

            {/* Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-[1px] h-full bg-white relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white bg-black/50 backdrop-blur-sm flex items-center justify-center gap-1">
                  <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[4px] border-r-white" />
                  <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[4px] border-l-white" />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-white uppercase px-2 py-1 bg-black/50 backdrop-blur-sm">
              BEFORE
            </div>
            <div className="absolute top-4 right-4 font-mono text-[10px] tracking-widest text-white uppercase px-2 py-1 bg-black/50 backdrop-blur-sm">
              AFTER
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white uppercase px-4 py-2 bg-black/80 backdrop-blur-md pointer-events-none">
              DRAG TO COMPARE
            </div>
          </div>

          {/* Faux Lightroom Panel */}
          <div className="w-full bg-[#1e1e1e] border border-white/10 p-6 flex flex-col font-mono uppercase text-xs tracking-widest h-full">
            <h3 className="text-white/50 border-b border-white/10 pb-4 mb-6">Light</h3>
            <div className="flex flex-col gap-4 mb-8">
              {LIGHT_SETTINGS.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between text-white/80">
                  <span>{setting.label}</span>
                  <span className="text-white">{setting.value}</span>
                </div>
              ))}
            </div>

            <h3 className="text-white/50 border-b border-white/10 pb-4 mb-6">Color</h3>
            <div className="flex flex-col gap-4">
              {COLOR_SETTINGS.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between text-white/80">
                  <span>{setting.label}</span>
                  <span className="text-white">{setting.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preset Thumbnails */}
        <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory hide-scrollbar">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setActivePreset(preset)}
              className={`flex-none w-32 md:w-48 aspect-square flex flex-col gap-2 snap-start group outline-none ${activePreset.name === preset.name ? 'opacity-100' : 'opacity-50 hover:opacity-100'} transition-opacity`}
            >
              <div className={`w-full aspect-square border ${activePreset.name === preset.name ? 'border-white' : 'border-transparent'} p-1 transition-colors`}>
                <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-mono text-[10px] tracking-widest text-white text-center w-full uppercase truncate">
                {preset.name}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <a 
            href="https://www.drewhalle.com/store" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block border border-white px-8 py-4 font-mono text-xs tracking-widest text-white hover:bg-white hover:text-black transition-colors uppercase"
          >
            VISIT STORE →
          </a>
        </div>
      </div>
    </section>
  );
}
