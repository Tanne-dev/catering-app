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
