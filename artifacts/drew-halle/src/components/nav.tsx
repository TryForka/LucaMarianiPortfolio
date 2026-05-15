export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between uppercase tracking-widest text-[10px] font-mono text-muted-foreground select-none">
      <div className="flex-1 text-left text-white" data-testid="nav-left">DREW HALLÉ</div>
      <div className="flex-1 text-center hidden md:block" data-testid="nav-center">MONTRÉAL · WORLDWIDE</div>
      <div className="flex-1 text-right" data-testid="nav-right">© 2026 DREW HALLÉ</div>
    </nav>
  );
}
