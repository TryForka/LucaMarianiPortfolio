import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Types ──────────────────────────────────────────────────────────────────────

type WorkItem = {
  id: number;
  type: "photo" | "video";
  embedUrl: string;
  title: string;
  category: string;
  dateAdded: string;
  active: boolean;
  aspectRatio?: string | null;
  altText?: string | null;
};

type FormState = {
  type: "photo" | "video";
  embedUrl: string;
  title: string;
  category: string;
  active: boolean;
  aspectRatio: string;
  altText: string;
};

const EMPTY_FORM: FormState = {
  type: "video",
  embedUrl: "",
  title: "",
  category: "Music",
  active: true,
  aspectRatio: "16/9",
  altText: "",
};

const CATEGORIES = ["Music", "Sports", "Hospitality & Events", "Snow"];

// ── API helpers ────────────────────────────────────────────────────────────────

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  let data: unknown = {};
  try { data = await res.json(); } catch { /* empty */ }
  return { ok: res.ok, status: res.status, data };
}

// ── Login screen ───────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { ok, data } = await apiFetch("/portal/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (ok) {
      onLogin();
    } else {
      setError((data as { error?: string })?.error ?? "Invalid password");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-8">
          LUCA FILMS · PORTAL
        </p>
        <h1 className="font-sans text-3xl font-black tracking-widest text-white uppercase mb-8">SIGN IN</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white font-mono text-sm tracking-wide focus:border-white/60 focus:outline-none transition-colors placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="font-mono text-[9px] tracking-widest text-red-400 uppercase">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-white/30 py-3 font-mono text-[10px] tracking-widest text-white uppercase hover:border-white hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40"
          >
            {loading ? "AUTHENTICATING..." : "ENTER"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Portal dashboard ───────────────────────────────────────────────────────────

function PortalDashboard({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Form state
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Manage list state
  const [typeFilter, setTypeFilter] = useState<"all" | "photo" | "video">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState<{ id: number; type: "ok" | "err"; text: string } | null>(null);

  async function fetchItems() {
    setLoadingItems(true);
    const { data } = await apiFetch("/portal/recent-work");
    setItems(Array.isArray(data) ? (data as WorkItem[]) : []);
    setLoadingItems(false);
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleLogout() {
    await apiFetch("/portal/logout", { method: "POST" });
    onLogout();
  }

  // ── Form submit (add or edit) ─────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg(null);

    const payload = {
      type: form.type,
      embedUrl: form.embedUrl,
      title: form.title,
      category: form.category,
      active: form.active,
      aspectRatio: form.aspectRatio || "16/9",
      altText: form.altText || null,
    };

    const url = editingId !== null ? `/portal/recent-work/${editingId}` : "/portal/recent-work";
    const method = editingId !== null ? "PATCH" : "POST";
    const { ok, data } = await apiFetch(url, { method, body: JSON.stringify(payload) });

    setSubmitting(false);
    if (ok) {
      setFormMsg({ type: "ok", text: editingId !== null ? "ENTRY UPDATED" : "ENTRY ADDED SUCCESSFULLY" });
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchItems();
    } else {
      setFormMsg({ type: "err", text: (data as { error?: string })?.error ?? "SAVE FAILED" });
    }
  }

  function startEdit(item: WorkItem) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      embedUrl: item.embedUrl,
      title: item.title,
      category: item.category,
      active: item.active,
      aspectRatio: item.aspectRatio ?? "16/9",
      altText: item.altText ?? "",
    });
    setFormMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormMsg(null);
  }

  // ── Row actions ───────────────────────────────────────────────────────────

  async function toggleFeatured(item: WorkItem) {
    const { ok, data } = await apiFetch(`/portal/recent-work/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({ active: !item.active }),
    });
    if (ok) {
      fetchItems();
      setActionMsg({ id: item.id, type: "ok", text: item.active ? "HIDDEN FROM CAROUSEL" : "ADDED TO CAROUSEL" });
    } else {
      setActionMsg({ id: item.id, type: "err", text: (data as { error?: string })?.error ?? "FAILED" });
    }
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    const { ok, data } = await apiFetch(`/portal/recent-work/${id}`, { method: "DELETE" });
    setDeletingId(null);
    setConfirmDelete(null);
    if (ok) {
      fetchItems();
    } else {
      setActionMsg({ id, type: "err", text: (data as { error?: string })?.error ?? "DELETE FAILED" });
      setTimeout(() => setActionMsg(null), 3000);
    }
  }

  function getThumbnail(item: WorkItem): string | null {
    if (item.type === "photo") return item.embedUrl;
    const match = item.embedUrl.match(/\/embed\/([^?/]+)/);
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    return null;
  }

  // ── Filtered list ─────────────────────────────────────────────────────────

  const filteredItems = items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (featuredOnly && !item.active) return false;
    return true;
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black z-40">
        <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">LUCA FILMS · PORTAL</span>
        <button onClick={handleLogout} className="font-mono text-[9px] tracking-widest text-white/40 uppercase hover:text-white transition-colors">
          LOGOUT
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-20">

        {/* ── SECTION 1: ADD NEW WORK ──────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-sans text-2xl font-black tracking-widest uppercase">
              {editingId !== null ? "EDIT ENTRY" : "ADD NEW WORK"}
            </h2>
            {editingId !== null && (
              <button onClick={cancelEdit} className="font-mono text-[9px] tracking-widest text-white/40 uppercase hover:text-white transition-colors">
                CANCEL EDIT
              </button>
            )}
          </div>
          <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase mb-8">
            {editingId !== null ? `EDITING ENTRY #${editingId}` : "Add a photo or video to your portfolio"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* TYPE */}
            <div>
              <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">TYPE</label>
              <p className="font-mono text-[8px] tracking-widest text-white/20 uppercase mb-3">
                Photo → appears on Photography page · Video → appears on Videography page
              </p>
              <div className="flex gap-0">
                {(["video", "photo"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`px-6 py-2.5 font-mono text-[10px] tracking-widest uppercase border transition-colors ${
                      form.type === t
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/40 border-white/20 hover:border-white/40"
                    }`}
                  >
                    {t === "video" ? "VIDEO" : "PHOTO"}
                  </button>
                ))}
              </div>
            </div>

            {/* LINK / EMBED URL */}
            <div>
              <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">LINK</label>
              <p className="font-mono text-[8px] tracking-widest text-white/20 uppercase mb-3">
                {form.type === "video"
                  ? "YouTube embed URL — e.g. https://www.youtube.com/embed/VIDEO_ID"
                  : "Direct image URL — e.g. https://res.cloudinary.com/…/image.jpg"}
              </p>
              <input
                type="url"
                value={form.embedUrl}
                onChange={(e) => setForm({ ...form, embedUrl: e.target.value })}
                required
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white font-mono text-sm focus:border-white/60 focus:outline-none transition-colors placeholder:text-white/20"
                placeholder={form.type === "video" ? "https://www.youtube.com/embed/…" : "https://…/image.jpg"}
              />
            </div>

            {/* TITLE */}
            <div>
              <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">TITLE</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white font-mono text-sm focus:border-white/60 focus:outline-none transition-colors placeholder:text-white/20"
                placeholder="Enter title"
              />
            </div>

            {/* ASPECT RATIO — videos only */}
            {form.type === "video" && (
              <div>
                <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">ASPECT RATIO</label>
                <p className="font-mono text-[8px] tracking-widest text-white/20 uppercase mb-3">
                  16/9 for landscape · 9/16 for vertical (portrait/phone)
                </p>
                <div className="flex gap-0">
                  {(["16/9", "9/16"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, aspectRatio: r })}
                      className={`px-6 py-2.5 font-mono text-[10px] tracking-widest uppercase border transition-colors ${
                        form.aspectRatio === r
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-white/40 border-white/20 hover:border-white/40"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ARTIST — photos only */}
            {form.type === "photo" && (
              <div>
                <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">ARTIST / SUBJECT <span className="text-white/20">(optional)</span></label>
                <p className="font-mono text-[8px] tracking-widest text-white/20 uppercase mb-3">
                  Shown as an overlay badge on the photo — e.g. "LORD HURON", "RED CLAY STRAYS"
                </p>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) => setForm({ ...form, altText: e.target.value })}
                  className="w-full bg-transparent border border-white/20 px-4 py-3 text-white font-mono text-sm focus:border-white/60 focus:outline-none transition-colors placeholder:text-white/20"
                  placeholder="e.g. LORD HURON"
                />
              </div>
            )}

            {/* CATEGORY */}
            <div>
              <label className="block font-mono text-[9px] tracking-widest text-white/40 uppercase mb-1">CATEGORY</label>
              <p className="font-mono text-[8px] tracking-widest text-white/20 uppercase mb-3">
                Which filter tab this appears under on the work page
              </p>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="w-full bg-black border border-white/20 px-4 py-3 text-white font-mono text-sm focus:border-white/60 focus:outline-none transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* CAROUSEL CHECKBOX */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-white flex-shrink-0"
              />
              <label htmlFor="active" className="cursor-pointer">
                <p className="font-mono text-[9px] tracking-widest text-white/70 uppercase">Also feature in homepage carousel</p>
                <p className="font-mono text-[8px] tracking-widest text-white/25 uppercase mt-0.5">
                  The entry always appears on its work page — this only controls the homepage carousel
                </p>
              </label>
            </div>

            {/* Form message */}
            {formMsg && (
              <p className={`font-mono text-[9px] tracking-widest uppercase ${formMsg.type === "ok" ? "text-green-400" : "text-red-400"}`}>
                {formMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="border border-white/30 px-8 py-3 font-mono text-[10px] tracking-widest text-white uppercase hover:border-white hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-40"
            >
              {submitting ? "SAVING..." : editingId !== null ? "SAVE CHANGES" : "ADD TO PORTFOLIO"}
            </button>
          </form>
        </section>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* ── SECTION 2: MANAGE EXISTING WORK ─────────────────────────────── */}
        <section>
          <h2 className="font-sans text-2xl font-black tracking-widest uppercase mb-2">MANAGE EXISTING WORK</h2>
          <p className="font-mono text-[9px] tracking-widest text-white/30 uppercase mb-8">
            {items.length} total entries · Edit, delete, or toggle carousel visibility
          </p>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {(["all", "photo", "video"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                  typeFilter === f
                    ? "border-white text-white bg-white/10"
                    : "border-white/20 text-white/40 hover:border-white/40"
                }`}
              >
                {f === "all" ? "ALL" : f === "photo" ? "PHOTOS" : "VIDEOS"}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <input
                type="checkbox"
                id="featured-only"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-white"
              />
              <label htmlFor="featured-only" className="font-mono text-[9px] tracking-widest text-white/40 uppercase cursor-pointer hover:text-white transition-colors">
                CAROUSEL ONLY
              </label>
            </div>
          </div>

          {/* List */}
          {loadingItems ? (
            <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">LOADING...</p>
          ) : filteredItems.length === 0 ? (
            <p className="font-mono text-[10px] tracking-widest text-white/20 uppercase">NO ENTRIES MATCH THIS FILTER</p>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const thumb = getThumbnail(item);
                const isConfirming = confirmDelete === item.id;
                const isDeleting = deletingId === item.id;
                const msg = actionMsg?.id === item.id ? actionMsg : null;

                return (
                  <div
                    key={item.id}
                    className={`border px-4 py-3 flex gap-3 items-start transition-colors ${
                      editingId === item.id ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-11 flex-shrink-0 bg-white/5 overflow-hidden">
                      {thumb && <img src={thumb} alt={item.title} className="w-full h-full object-cover" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`font-mono text-[8px] tracking-widest uppercase px-1.5 py-0.5 border ${
                          item.active ? "border-green-500/50 text-green-400" : "border-white/15 text-white/25"
                        }`}>
                          {item.active ? "IN CAROUSEL" : "NOT IN CAROUSEL"}
                        </span>
                        <span className="font-mono text-[8px] tracking-widest text-white/30 uppercase">{item.type}</span>
                        <span className="font-mono text-[8px] tracking-widest text-white/30 uppercase">{item.category}</span>
                      </div>
                      <p className="font-sans font-bold text-white text-xs uppercase tracking-wide truncate">{item.title}</p>
                      <p className="font-mono text-[8px] text-white/25 mt-0.5">
                        {new Date(item.dateAdded).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                      {msg && (
                        <p className={`font-mono text-[8px] tracking-widest uppercase mt-1 ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>
                          {msg.text}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                      {/* Feature toggle */}
                      <button
                        onClick={() => toggleFeatured(item)}
                        className="font-mono text-[8px] tracking-widest uppercase border border-white/20 px-2 py-1 text-white/50 hover:text-white hover:border-white/50 transition-colors"
                        title={item.active ? "Remove from carousel" : "Add to carousel"}
                      >
                        {item.active ? "UNFEATURE" : "FEATURE"}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => editingId === item.id ? cancelEdit() : startEdit(item)}
                        className={`font-mono text-[8px] tracking-widest uppercase border px-2 py-1 transition-colors ${
                          editingId === item.id
                            ? "border-white/40 text-white"
                            : "border-white/20 text-white/50 hover:text-white hover:border-white/50"
                        }`}
                      >
                        {editingId === item.id ? "EDITING" : "EDIT"}
                      </button>

                      {/* Delete */}
                      {isConfirming ? (
                        <>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="font-mono text-[8px] tracking-widest uppercase border border-red-500/60 px-2 py-1 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          >
                            {isDeleting ? "..." : "CONFIRM"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="font-mono text-[8px] tracking-widest uppercase border border-white/10 px-2 py-1 text-white/30 hover:text-white transition-colors"
                          >
                            CANCEL
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(item.id)}
                          className="font-mono text-[8px] tracking-widest uppercase border border-white/20 px-2 py-1 text-white/50 hover:text-red-400 hover:border-red-500/40 transition-colors"
                        >
                          DELETE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Main portal page ───────────────────────────────────────────────────────────

export default function PortalPage() {
  const [authState, setAuthState] = useState<"loading" | "unauthenticated" | "authenticated">("loading");

  useEffect(() => {
    apiFetch("/portal/auth").then(({ data }) => {
      setAuthState((data as { authenticated?: boolean })?.authenticated ? "authenticated" : "unauthenticated");
    });
  }, []);

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="font-mono text-[10px] tracking-widest text-white/20 uppercase">LOADING...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {authState === "unauthenticated" ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginScreen onLogin={() => setAuthState("authenticated")} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PortalDashboard onLogout={() => setAuthState("unauthenticated")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
