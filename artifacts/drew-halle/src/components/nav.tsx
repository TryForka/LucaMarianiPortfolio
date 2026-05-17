import { Link } from "wouter";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between uppercase tracking-widest text-[10px] font-mono text-muted-foreground select-none">
      <div className="flex-1 text-left" data-testid="nav-left">
        <Link href="/"><span className="text-white hover:text-white/60 transition-colors cursor-pointer">LUCA MARIANI</span></Link>
      </div>
      <div className="flex-1 text-center hidden md:flex items-center justify-center gap-6" data-testid="nav-center">
        <Link href="/videography"><span className="hover:text-white transition-colors cursor-pointer">VIDEOGRAPHY</span></Link>
        <span className="text-white/20">·</span>
        <Link href="/"><span className="hover:text-white transition-colors cursor-pointer">PHOTOGRAPHY</span></Link>
        <span className="text-white/20">·</span>
        <Link href="/#contact"><span className="hover:text-white transition-colors cursor-pointer">CONTACT</span></Link>
      </div>
      <div className="flex-1 text-right" data-testid="nav-right">© 2026 LUCA FILMS</div>
    </nav>
  );
}
