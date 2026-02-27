"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import LazyBackground from "@/components/LazyBackground";

type Order = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  guests: string | null;
  service: string | null;
  message: string | null;
  cart_summary: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Väntar",
  confirmed: "Bekräftad",
  completed: "Slutförd",
  cancelled: "Avbruten",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteOrder, setConfirmDeleteOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setFeedback({ type: "error", msg: "Kunde inte hämta beställningar." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!confirmDeleteOrder) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") closeDeleteConfirm();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [confirmDeleteOrder]);

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as { role?: string })?.role;
    if (role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    loadOrders();
  }, [router, session, status, loadOrders]);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setFeedback({ type: "success", msg: "Status uppdaterad." });
      await loadOrders();
    } catch {
      setFeedback({ type: "error", msg: "Kunde inte uppdatera." });
    } finally {
      setUpdatingId(null);
    }
  }

  function openDeleteConfirm(order: Order) {
    setConfirmDeleteOrder(order);
  }

  function closeDeleteConfirm() {
    setConfirmDeleteOrder(null);
  }

  async function confirmDeleteOrderAction() {
    if (!confirmDeleteOrder) return;
    const orderId = confirmDeleteOrder.id;
    const orderToRemove = confirmDeleteOrder;
    closeDeleteConfirm();
    if (!orderToRemove) return;
    setDeletingId(orderId);
    setFeedback(null);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const errData = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof (errData as { error?: string }).error === "string"
          ? (errData as { error: string }).error
          : "Kunde inte ta bort beställningen.";
        setFeedback({ type: "error", msg });
        setOrders((prev) => [...prev, orderToRemove].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        return;
      }
      setFeedback({ type: "success", msg: "Beställningen borttagen." });
    } catch {
      setFeedback({ type: "error", msg: "Kunde inte ta bort beställningen." });
      setOrders((prev) => [...prev, orderToRemove].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString("sv-SE", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#EAC84E]">Laddar...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh] px-4 py-16">
      {/* Modal xác nhận xoá */}
      {confirmDeleteOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          aria-describedby="delete-confirm-desc"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden
            onClick={closeDeleteConfirm}
          />
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#707164]/40 bg-[#1a1916] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-confirm-title" className="font-serif text-xl font-semibold text-[#EAC84E]" style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}>
              Bekräfta borttagning
            </h2>
            <p id="delete-confirm-desc" className="mt-3 text-[#E5E7E3]/90">
              Vill du verkligen ta bort beställningen från {confirmDeleteOrder.name}? Detta kan inte ångras.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="rounded-lg border border-[#707164]/50 bg-transparent px-4 py-2.5 text-sm font-medium text-[#E5E7E3] transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#EAC84E]/50 focus:ring-offset-2 focus:ring-offset-[#12110D]"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrderAction}
                disabled={deletingId === confirmDeleteOrder.id}
                className="rounded-lg border border-red-500/60 bg-red-900/40 px-4 py-2.5 text-sm font-medium text-red-200 transition-colors hover:bg-red-900/60 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-[#12110D]"
              >
                {deletingId === confirmDeleteOrder.id ? "Tar bort…" : "Ta bort"}
              </button>
            </div>
          </div>
        </div>
      )}
      <LazyBackground
        src="/admin-bg.png"
        className="fixed inset-y-0 left-5 right-5 -z-10 bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      <div className="fixed inset-y-0 left-5 right-5 -z-10 bg-white/55" aria-hidden />

      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-[#707164]/30 bg-[#1a1916]/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <h1
            className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E]"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            Hantera beställningar
          </h1>
          <p className="mt-2 text-[#E5E7E3]/80">
            Visa och uppdatera status på offertförfrågningar från kunder.
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

          {orders.length === 0 ? (
            <p className="mt-6 text-[#E5E7E3]/70">Inga beställningar ännu.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-lg border border-[#707164]/30 bg-[#12110D]/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#E5E7E3]">{order.name}</p>
                      <a
                        href={`mailto:${order.email}`}
                        className="text-sm text-[#C49B38] hover:underline"
                      >
                        {order.email}
                      </a>
                      {order.phone && (
                        <p className="text-sm text-[#E5E7E3]/80">
                          <a href={`tel:${order.phone.replace(/\s/g, "")}`}>{order.phone}</a>
                        </p>
                      )}
                      <p className="mt-1 text-xs text-[#707164]">
                        {formatDate(order.created_at)}
                        {order.event_date && ` · Datum: ${order.event_date}`}
                        {order.guests && ` · ${order.guests} gäster`}
                        {order.service && ` · ${order.service}`}
                      </p>
                      {order.message && (
                        <p className="mt-2 text-sm text-[#E5E7E3]/90">{order.message}</p>
                      )}
                      {order.cart_summary && (
                        <pre className="mt-2 whitespace-pre-wrap rounded bg-[#12110D] p-2 text-xs text-[#E5E7E3]/80">
                          {order.cart_summary}
                        </pre>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="rounded border border-[#707164]/50 bg-[#12110D] px-3 py-1.5 text-sm text-[#E5E7E3] focus:border-[#C49B38] focus:outline-none disabled:opacity-60"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => openDeleteConfirm(order)}
                        disabled={deletingId === order.id}
                        className="rounded border border-red-500/60 bg-red-900/30 px-3 py-1.5 text-sm text-red-200 transition-colors hover:bg-red-900/50 disabled:opacity-60"
                        title="Ta bort beställning"
                      >
                        {deletingId === order.id ? "Tar bort…" : "Ta bort"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
