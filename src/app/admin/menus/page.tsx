"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import LazyBackground from "@/components/LazyBackground";

type Menu = { id: string; slug: string; title: string; display_order: number };
type MenuItem = {
  id: string;
  menu_id: string;
  name: string;
  price: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  nigiri: string[];
  uramaki: string[];
  maki: string[];
  allergens: string | null;
};

const MENU_SLUGS = ["sushi", "asiatisk"] as const;

function AdminMenusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [itemsBySlug, setItemsBySlug] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<(typeof MENU_SLUGS)[number]>("sushi");
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    allergens: "",
    nigiri: "",
    uramaki: "",
    maki: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const fetchMenus = useCallback(async () => {
    const res = await fetch("/api/menus");
    if (!res.ok) throw new Error("Failed to fetch menus");
    const data = await res.json();
    setMenus(Array.isArray(data) ? data : [data]);
  }, []);

  const fetchItems = useCallback(async (slug: string) => {
    const res = await fetch(`/api/menus/${slug}/items`);
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []) as MenuItem[];
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await fetchMenus();
      const all: Record<string, MenuItem[]> = {};
      for (const slug of MENU_SLUGS) {
        all[slug] = await fetchItems(slug);
      }
      setItemsBySlug(all);
    } catch {
      setFeedback({ type: "error", msg: "Kunde inte hämta menyer." });
    } finally {
      setLoading(false);
    }
  }, [fetchMenus, fetchItems]);

  const menuParam = searchParams.get("menu");
  const validSlug = MENU_SLUGS.includes(menuParam as (typeof MENU_SLUGS)[number])
    ? (menuParam as (typeof MENU_SLUGS)[number])
    : "sushi";

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as { role?: string })?.role;
    if (role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    loadAll();
  }, [router, session, status, loadAll]);

  useEffect(() => {
    setSelectedSlug(validSlug);
  }, [validSlug]);

  function resetForm() {
    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      allergens: "",
      nigiri: "",
      uramaki: "",
      maki: "",
    });
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditItem(null);
    setShowForm(false);
  }

  function openAdd() {
    resetForm();
    setShowForm(true);
  }

  function toggleSelect(itemId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }

  function toggleSelectAll() {
    const currentItems = itemsBySlug[selectedSlug] ?? [];
    if (selectedIds.size === currentItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentItems.map((i) => i.id)));
    }
  }

  async function handleDeleteSelected() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Ta bort ${ids.length} markerad(e) rätt(er)?`)) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`/api/menus/items/${id}`, { method: "DELETE" }))
      );
      const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !(r.value as Response).ok));
      if (failed.length > 0) {
        setFeedback({ type: "error", msg: `${failed.length} rätt(er) kunde inte tas bort.` });
      } else {
        setFeedback({ type: "success", msg: `${ids.length} rätt(er) borttagna.` });
      }
      setSelectedIds(new Set());
      await loadAll();
    } catch {
      setFeedback({ type: "error", msg: "Kunde inte ta bort." });
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(item: MenuItem) {
    setEditItem(item);
    setForm({
      name: item.name,
      price: item.price,
      description: item.description ?? "",
      image: item.image ?? "",
      allergens: item.allergens ?? "",
      nigiri: Array.isArray(item.nigiri) ? item.nigiri.join(", ") : "",
      uramaki: Array.isArray(item.uramaki) ? item.uramaki.join(", ") : "",
      maki: Array.isArray(item.maki) ? item.maki.join(", ") : "",
    });
    setShowForm(true);
  }

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const menu = menus.find((m) => m.slug === selectedSlug);
      if (!menu) throw new Error("Menu not found");

      let imageUrl = form.image || null;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const upRes = await fetch("/api/upload/menu-image", {
          method: "POST",
          body: fd,
        });
        if (!upRes.ok) {
          const err = await upRes.json();
          throw new Error(err.error ?? "Bilden kunde inte laddas upp.");
        }
        const { url } = await upRes.json();
        imageUrl = url;
      }

      const parseArray = (s: string) =>
        s
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);

      if (editItem) {
        const res = await fetch(`/api/menus/items/${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            price: form.price,
            description: form.description || null,
            image: imageUrl,
            allergens: selectedSlug === "asiatisk" ? form.allergens || null : null,
            nigiri: selectedSlug === "sushi" ? parseArray(form.nigiri) : [],
            uramaki: selectedSlug === "sushi" ? parseArray(form.uramaki) : [],
            maki: selectedSlug === "sushi" ? parseArray(form.maki) : [],
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Update failed");
        }
        setFeedback({ type: "success", msg: "Rätten uppdaterad." });
      } else {
        const res = await fetch("/api/menus/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            menu_id: menu.id,
            name: form.name,
            price: form.price,
            description: form.description || null,
            image: imageUrl,
            allergens: selectedSlug === "asiatisk" ? form.allergens || null : null,
            nigiri: selectedSlug === "sushi" ? parseArray(form.nigiri) : [],
            uramaki: selectedSlug === "sushi" ? parseArray(form.uramaki) : [],
            maki: selectedSlug === "sushi" ? parseArray(form.maki) : [],
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Create failed");
        }
        setFeedback({ type: "success", msg: "Rätten tillagd." });
      }
      resetForm();
      await loadAll();
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof Error ? err.message : "Något gick fel.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Ta bort "${item.name}"?`)) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/menus/items/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setFeedback({ type: "success", msg: "Rätten borttagen." });
      await loadAll();
    } catch {
      setFeedback({ type: "error", msg: "Kunde inte ta bort." });
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#EAC84E]">Laddar...</div>
      </div>
    );
  }

  const items = itemsBySlug[selectedSlug] ?? [];
  const menu = menus.find((m) => m.slug === selectedSlug);

  return (
    <div className="relative min-h-[70vh] px-4 py-16">
      <LazyBackground
        src="/admin-bg.png"
        className="fixed inset-y-0 left-5 right-5 -z-10 bg-cover bg-center bg-no-repeat"
        aria-hidden
      >
        {null}
      </LazyBackground>
      <div className="fixed inset-y-0 left-5 right-5 -z-10 bg-white/55" aria-hidden />

      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-[#707164]/30 bg-[#1a1916]/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <h1
            className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E]"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            Hantera menyer
          </h1>
          <p className="mt-2 text-[#E5E7E3]/80">
            Lägg till, redigera och ta bort rätter. Ändringar sparas i Supabase.
          </p>

          {feedback && (
            <div
              className={`mt-4 rounded-lg px-4 py-2 text-sm ${
                feedback.type === "success"
                  ? "bg-green-900/40 text-green-200"
                  : "bg-red-900/40 text-red-200"
              }`}
              role="alert"
            >
              {feedback.msg}
            </div>
          )}

          <div className="mt-6 flex gap-2 border-b border-[#707164]/30 pb-4">
            {MENU_SLUGS.map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(slug);
                  setSelectedIds(new Set());
                  resetForm();
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSlug === slug
                    ? "bg-[#C49B38] text-[#12110D]"
                    : "bg-[#12110D] text-[#E5E7E3] hover:bg-[#1a1916]"
                }`}
              >
                {slug === "sushi" ? "Sushi" : "Asiatisk"}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#E5E7E3]">
              {menu?.title ?? selectedSlug}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {items.length > 0 && (
                <>
                  <label className="flex cursor-pointer items-center gap-1.5 text-sm text-[#E5E7E3]/90">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === items.length && items.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-[#707164]/50 text-[#C49B38] focus:ring-[#C49B38]"
                    />
                    Markera alla
                  </label>
                  {selectedIds.size > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteSelected}
                      disabled={submitting}
                      className="rounded-lg bg-red-600/80 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      Ta bort {selectedIds.size} markerad(e)
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={openAdd}
                disabled={submitting}
                className="rounded-lg bg-[#C49B38] px-4 py-2 text-sm font-medium text-[#12110D] hover:bg-[#D4A83E] disabled:opacity-60"
              >
                + Lägg till rätt
              </button>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-[#707164]/30 bg-[#12110D]/60 px-4 py-3"
              >
                <label className="flex shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="h-4 w-4 rounded border-[#707164]/50 text-[#C49B38] focus:ring-[#C49B38]"
                    aria-label={`Markera ${item.name}`}
                  />
                </label>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-[#E5E7E3]">{item.name}</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    disabled={submitting}
                    className="rounded px-2 py-1 text-sm text-[#C49B38] hover:bg-white/10 disabled:opacity-60"
                  >
                    Redigera
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={submitting}
                    className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-900/30 disabled:opacity-60"
                  >
                    Ta bort
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {items.length === 0 && !showForm && (
            <p className="mt-4 text-sm text-[#E5E7E3]/60">
              Inga rätter ännu. Klicka &quot;Lägg till rätt&quot; för att börja.
            </p>
          )}

          {showForm && (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-6 space-y-4 rounded-lg border border-[#707164]/30 bg-[#12110D]/80 p-4 scroll-mt-4"
            >
              <h3 className="font-medium text-[#EAC84E]">
                {editItem ? "Redigera rätt" : "Ny rätt"}
              </h3>
              <div>
                <label className="block text-xs text-[#E5E7E3]/80">Namn *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#E5E7E3]/80">Beskrivning</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#E5E7E3]/80">Bild</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setImageFile(f ?? null);
                    if (f) setForm((prev) => ({ ...prev, image: "" }));
                  }}
                  className="mt-1 block w-full text-sm text-[#E5E7E3] file:mr-3 file:rounded-lg file:border-0 file:bg-[#C49B38] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#12110D] file:hover:bg-[#D4A83E]"
                />
                {imageFile && (
                  <p className="mt-1 text-xs text-[#E5E7E3]/70">
                    Vald fil: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} kB)
                  </p>
                )}
                <p className="mt-1 text-xs text-[#707164]">
                  Eller ange sökväg manuellt (t.ex. /dishes/dish.png):
                </p>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, image: e.target.value }));
                    if (e.target.value) setImageFile(null);
                  }}
                  placeholder="/dishes/dish-example.png"
                  disabled={!!imageFile}
                  className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none disabled:opacity-50"
                />
              </div>
              {selectedSlug === "asiatisk" && (
                <div>
                  <label className="block text-xs text-[#E5E7E3]/80">Allergener</label>
                  <input
                    type="text"
                    value={form.allergens}
                    onChange={(e) => setForm((f) => ({ ...f, allergens: e.target.value }))}
                    placeholder="gluten, soja, ägg"
                    className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none"
                  />
                </div>
              )}
              {selectedSlug === "sushi" && (
                <>
                  <div>
                    <label className="block text-xs text-[#E5E7E3]/80">
                      Nigiri (kommaseparerad)
                    </label>
                    <input
                      type="text"
                      value={form.nigiri}
                      onChange={(e) => setForm((f) => ({ ...f, nigiri: e.target.value }))}
                      placeholder="Lax, Räka, Tonfisk"
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#E5E7E3]/80">
                      Uramaki (kommaseparerad)
                    </label>
                    <input
                      type="text"
                      value={form.uramaki}
                      onChange={(e) => setForm((f) => ({ ...f, uramaki: e.target.value }))}
                      placeholder="Avokado & krispig lök"
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#E5E7E3]/80">
                      Maki (kommaseparerad)
                    </label>
                    <input
                      type="text"
                      value={form.maki}
                      onChange={(e) => setForm((f) => ({ ...f, maki: e.target.value }))}
                      placeholder="Blandat urval"
                      className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#C49B38] px-4 py-2 text-sm font-medium text-[#12110D] hover:bg-[#D4A83E] disabled:opacity-60"
                >
                  {submitting ? "Sparar…" : editItem ? "Spara" : "Lägg till"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="rounded-lg border border-[#707164]/50 px-4 py-2 text-sm text-[#E5E7E3] hover:bg-white/5 disabled:opacity-60"
                >
                  Avbryt
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-sm text-[#707164]">
            <Link href="/admin/dashboard" className="hover:text-[#EAC84E] hover:underline">
              ← Tillbaka till dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenusPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#EAC84E]">Laddar...</div>
      </div>
    }>
      <AdminMenusContent />
    </Suspense>
  );
}
