"use client";

import { useState, useEffect, useMemo } from "react";

interface TableBooking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  note?: string;
  createdAt: string;
}

interface TableLayout {
  x: number;
  y: number;
  shape: "round" | "rect" | "square";
  w?: number;
  h?: number;
  r?: number;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "booked";
  booking: TableBooking | null;
  layout?: TableLayout;
}

interface Stats {
  total: number;
  available: number;
  booked: number;
}

const FLOOR_W = 540;
const FLOOR_H = 500;
const CHAIR_SIZE = 8;

/** Fallback layout när API saknar layout – bord i rutnät */
function getLayoutOrDefault(t: Table, index: number): TableLayout {
  if (t.layout) return t.layout;
  const col = index % 5;
  const row = Math.floor(index / 5);
  const isRound = t.capacity <= 2;
  const x = 80 + col * 110;
  const y = 80 + row * 120;
  return isRound
    ? { x, y, shape: "round", r: 35 }
    : { x, y, shape: "rect", w: 70, h: 50 };
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

const MONTHS = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December"
];

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [viewTab, setViewTab] = useState<"plan" | "list">("plan");
  const [timeFilter, setTimeFilter] = useState<"all" | "morning" | "lunch" | "evening">("all");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [newBookingTableId, setNewBookingTableId] = useState("");

  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  async function fetchTables() {
    try {
      const res = await fetch("/api/tables");
      if (!res.ok) throw new Error("Kunde inte hämta bord");
      const data = await res.json();
      setTables(data.tables);
      setStats(data.stats);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTables();
  }, []);

  const calDays = useMemo(() => getMonthDays(calYear, calMonth), [calYear, calMonth]);

  const bookingsForDate = useMemo(() => {
    return tables
      .filter((t) => t.status === "booked" && t.booking && t.booking.date === selectedDate)
      .sort((a, b) => (a.booking?.time ?? "").localeCompare(b.booking?.time ?? ""));
  }, [tables, selectedDate]);

  const groupedByTime = useMemo(() => {
    const map = new Map<string, Table[]>();
    for (const t of bookingsForDate) {
      const time = t.booking?.time ?? "";
      if (!map.has(time)) map.set(time, []);
      map.get(time)!.push(t);
    }
    return map;
  }, [bookingsForDate]);

  function showFeedback(type: "success" | "error", msg: string) {
    setActionFeedback({ type, msg });
    setTimeout(() => setActionFeedback(null), 4000);
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    const tableId = selectedTable?.id ?? newBookingTableId;
    if (!tableId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tables/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte boka");
      closeBookForm();
      showFeedback("success", "Bord bokades!");
      await fetchTables();
    } catch (e) {
      showFeedback("error", e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(tableId: string) {
    if (!confirm("Är du säker på att du vill avboka?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tables/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte avboka");
      showFeedback("success", "Bokningen avbokades!");
      await fetchTables();
    } catch (e) {
      showFeedback("error", e instanceof Error ? e.message : "Något gick fel");
    } finally {
      setSubmitting(false);
    }
  }

  function openNewBooking(table?: Table) {
    setSelectedTable(table ?? null);
    setShowBookForm(true);
    setForm((f) => ({
      ...f,
      date: selectedDate,
      time: f.time || "18:00",
    }));
  }

  function closeBookForm() {
    setShowBookForm(false);
    setSelectedTable(null);
    setNewBookingTableId("");
    setForm({ customerName: "", phone: "", email: "", date: selectedDate, time: "18:00", note: "" });
  }

  const displayDate = new Date(selectedDate + "T12:00:00");
  const dayName = displayDate.toLocaleDateString("sv-SE", { weekday: "long" });
  const dateStr = displayDate.toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#EAC84E]">Laddar...</div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-[calc(100vh-120px)] flex-col lg:flex-row">
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/admin-tables-bg.png)" }}
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 bg-[#12110D]/35"
        aria-hidden
      />
      {/* Left pane: Calendar + Bookings */}
      <aside className="w-full border-r border-[#707164]/30 bg-[#0f0e0b]/75 backdrop-blur-md lg:w-[340px] lg:shrink-0">
        <div className="p-4">
          <h1
            className="font-serif text-xl font-semibold tracking-tight text-[#EAC84E]"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            Hantera bord
          </h1>

          {actionFeedback && (
            <div
              role="alert"
              className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                actionFeedback.type === "success"
                  ? "bg-green-900/40 text-green-200"
                  : "bg-red-900/40 text-red-200"
              }`}
            >
              {actionFeedback.msg}
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-lg bg-red-900/40 px-3 py-2 text-sm text-red-200">{error}</div>
          )}

          {/* Calendar */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear((y) => y - 1);
                  } else setCalMonth((m) => m - 1);
                }}
                className="rounded p-1 text-[#E5E7E3]/70 hover:bg-[#1a1915] hover:text-[#EAC84E]"
              >
                ←
              </button>
              <span className="text-sm font-medium text-[#E5E7E3]">
                {MONTHS[calMonth]} {calYear}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear((y) => y + 1);
                  } else setCalMonth((m) => m + 1);
                }}
                className="rounded p-1 text-[#E5E7E3]/70 hover:bg-[#1a1915] hover:text-[#EAC84E]"
              >
                →
              </button>
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs">
              {["M", "Ti", "O", "To", "F", "L", "S"].map((d, i) => (
                <div key={`wd-${i}`} className="py-1 text-[#E5E7E3]/50">
                  {d}
                </div>
              ))}
              {calDays.map((d, i) =>
                d === null ? (
                  <div key={`e-${i}`} />
                ) : (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setSelectedDate(
                        `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
                      )
                    }
                    className={`rounded py-1.5 text-[#E5E7E3] hover:bg-[#1a1915] ${
                      selectedDate ===
                      `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
                        ? "bg-[#EAC84E]/20 text-[#EAC84E]"
                        : ""
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Booking status */}
          <div className="mt-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
            <span className="text-sm text-[#E5E7E3]/80">Bokning öppen</span>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mt-4 space-y-2 rounded-lg border border-[#707164]/20 bg-[#12110D] p-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#E5E7E3]/70">Bookinger</span>
                <span className="font-medium text-[#E5E7E3]">{stats.booked}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#E5E7E3]/70">Lediga bord</span>
                <span className="font-medium text-green-400">{stats.available}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#E5E7E3]/70">Totalt</span>
                <span className="font-medium text-[#E5E7E3]">{stats.total}</span>
              </div>
            </div>
          )}

          {/* Booking list for selected date */}
          <div className="mt-6">
            <h2 className="text-sm font-medium text-[#E5E7E3]">Bokningar {selectedDate}</h2>
            <div className="mt-2 max-h-[280px] overflow-y-auto space-y-2">
              {Array.from(groupedByTime.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([time, tbls]) => (
                  <div key={time}>
                    <div className="text-xs font-medium text-[#EAC84E]">{time}</div>
                    {tbls.map((t) => (
                      <div
                        key={t.id}
                        className={`mt-1 flex items-center justify-between rounded px-3 py-2 text-sm ${
                          t.status === "booked"
                            ? "bg-amber-900/30 border border-amber-700/40"
                            : "bg-[#1a1915]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-[#E5E7E3]">{t.booking?.customerName}</span>
                          <span className="ml-2 text-[#E5E7E3]/60">
                            {t.name} · {t.booking?.time}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancel(t.id)}
                          disabled={submitting}
                          className="ml-2 shrink-0 text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Avboka
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              {groupedByTime.size === 0 && (
                <div className="rounded bg-[#1a1915] px-3 py-4 text-center text-sm text-[#E5E7E3]/50">
                  Inga bokningar denna dag.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-[#707164]/20 pt-4">
            <a href="/" className="text-sm text-[#EAC84E] underline-offset-4 hover:underline">
              ← Tillbaka till startsidan
            </a>
          </div>
        </div>
      </aside>

      {/* Right pane: Table plan */}
      <div className="flex flex-1 flex-col bg-[#12110D]/70 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#707164]/30 p-4">
          <h2 className="font-medium text-[#E5E7E3]">
            {dayName.charAt(0).toUpperCase() + dayName.slice(1)}, {dateStr}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openNewBooking()}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
            >
              Ny bokning
            </button>
            <button
              type="button"
              className="rounded-lg border border-[#707164]/50 px-4 py-2 text-sm font-medium text-[#E5E7E3] hover:bg-[#1a1915]"
            >
              Walk in
            </button>
          </div>
        </div>

        <div className="border-b border-[#707164]/20 px-4">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setViewTab("plan")}
              className={`relative px-4 py-3 text-sm font-medium ${
                viewTab === "plan"
                  ? "text-[#EAC84E]"
                  : "text-[#E5E7E3]/70 hover:text-[#E5E7E3]"
              }`}
            >
              Bordplan
              {viewTab === "plan" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EAC84E]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setViewTab("list")}
              className={`relative px-4 py-3 text-sm font-medium ${
                viewTab === "list"
                  ? "text-[#EAC84E]"
                  : "text-[#E5E7E3]/70 hover:text-[#E5E7E3]"
              }`}
            >
              Lista
              {viewTab === "list" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EAC84E]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3">
          {(["all", "morning", "lunch", "evening"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setTimeFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                timeFilter === f
                  ? "bg-[#EAC84E]/20 text-[#EAC84E]"
                  : "text-[#E5E7E3]/70 hover:bg-[#1a1915] hover:text-[#E5E7E3]"
              }`}
            >
              {f === "all" ? "Alla" : f === "morning" ? "Frukost" : f === "lunch" ? "Lunch" : "Kväll"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {viewTab === "plan" ? (
            <div className="mx-auto w-fit min-w-0 overflow-x-auto">
              <div
                className="relative rounded-xl border border-[#707164]/30 bg-[#1c1b18]"
                style={{ width: FLOOR_W, height: FLOOR_H, minHeight: FLOOR_H }}
              >
                {tables.map((t, index) => {
                  const layout = getLayoutOrDefault(t, index);
                  const isAvailable = t.status === "available";
                  const fill = isAvailable ? "#4b5563" : "#d97706";
                  const stroke = isAvailable ? "#6b7280" : "#b45309";

                  if (layout.shape === "round") {
                    const r = layout.r ?? 40;
                    const cx = layout.x;
                    const cy = layout.y;
                    return (
                      <div
                        key={t.id}
                        className="absolute cursor-pointer"
                        style={{
                          left: cx - r - CHAIR_SIZE,
                          top: cy - r - CHAIR_SIZE,
                          width: (r + CHAIR_SIZE) * 2,
                          height: (r + CHAIR_SIZE) * 2,
                        }}
                        onClick={() => isAvailable && openNewBooking(t)}
                      >
                        {/* Chairs */}
                        {[0, 90, 180, 270].slice(0, Math.min(t.capacity, 4)).map((deg, i) => {
                          const rad = (deg * Math.PI) / 180;
                          const cx2 = r + CHAIR_SIZE + (r + CHAIR_SIZE * 1.5) * Math.cos(rad);
                          const cy2 = r + CHAIR_SIZE + (r + CHAIR_SIZE * 1.5) * Math.sin(rad);
                          return (
                            <div
                              key={i}
                              className="absolute rounded-sm bg-[#374151]"
                              style={{
                                left: cx2 - CHAIR_SIZE / 2,
                                top: cy2 - CHAIR_SIZE / 2,
                                width: CHAIR_SIZE,
                                height: CHAIR_SIZE,
                              }}
                            />
                          );
                        })}
                        {/* Table */}
                        <div
                          className="absolute flex flex-col items-center justify-center rounded-full border-2"
                          style={{
                            left: CHAIR_SIZE,
                            top: CHAIR_SIZE,
                            width: r * 2,
                            height: r * 2,
                            backgroundColor: fill,
                            borderColor: stroke,
                          }}
                          title={t.name}
                        >
                          <span className="text-lg font-bold text-white">{t.id}</span>
                          <span className="text-xs text-white/90">
                            {t.booking?.time ?? "—"}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  const w = layout.w ?? 60;
                  const h = layout.h ?? 50;
                  const x = layout.x - w / 2 - CHAIR_SIZE;
                  const y = layout.y - h / 2 - CHAIR_SIZE;

                  return (
                    <div
                      key={t.id}
                      className="absolute cursor-pointer"
                      style={{ left: x, top: y, width: w + CHAIR_SIZE * 2, height: h + CHAIR_SIZE * 2 }}
                      onClick={() => isAvailable && openNewBooking(t)}
                    >
                      {/* Chairs - top, bottom, left, right */}
                      {[
                        [w / 2 + CHAIR_SIZE - CHAIR_SIZE / 2, 0],
                        [w / 2 + CHAIR_SIZE - CHAIR_SIZE / 2, h + CHAIR_SIZE * 2 - CHAIR_SIZE],
                        [0, h / 2 + CHAIR_SIZE - CHAIR_SIZE / 2],
                        [w + CHAIR_SIZE * 2 - CHAIR_SIZE, h / 2 + CHAIR_SIZE - CHAIR_SIZE / 2],
                      ]
                        .slice(0, Math.min(t.capacity, 4))
                        .map(([lx, ly], i) => (
                          <div
                            key={i}
                            className="absolute rounded-sm bg-[#374151]"
                            style={{
                              left: lx,
                              top: ly,
                              width: CHAIR_SIZE,
                              height: CHAIR_SIZE,
                            }}
                          />
                        ))}
                      <div
                        className={`absolute flex flex-col items-center justify-center border-2 ${
                          layout.shape === "square" ? "rounded-lg" : "rounded-md"
                        }`}
                        style={{
                          left: CHAIR_SIZE,
                          top: CHAIR_SIZE,
                          width: w,
                          height: h,
                          backgroundColor: fill,
                          borderColor: stroke,
                        }}
                        title={t.name}
                      >
                        <span className="text-lg font-bold text-white">{t.id}</span>
                        <span className="text-xs text-white/90">
                          {t.booking?.time ?? "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#E5E7E3]/80">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 rounded"
                    style={{ backgroundColor: "#4b5563" }}
                  />
                  Ledig
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 rounded"
                    style={{ backgroundColor: "#d97706" }}
                  />
                  Bokad
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#707164]/30">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#707164]/30 bg-[#1a1915]">
                    <th className="px-4 py-3 text-[#EAC84E]">Bord</th>
                    <th className="px-4 py-3 text-[#EAC84E]">Gäst</th>
                    <th className="px-4 py-3 text-[#EAC84E]">Telefon</th>
                    <th className="px-4 py-3 text-[#EAC84E]">Datum</th>
                    <th className="px-4 py-3 text-[#EAC84E]">Tid</th>
                    <th className="px-4 py-3 text-[#EAC84E]">Åtgärd</th>
                  </tr>
                </thead>
                <tbody>
                  {tables
                    .filter((t) => t.status === "booked" && t.booking)
                    .map((t) => (
                      <tr key={t.id} className="border-b border-[#707164]/20">
                        <td className="px-4 py-3">{t.name}</td>
                        <td className="px-4 py-3">{t.booking?.customerName}</td>
                        <td className="px-4 py-3">{t.booking?.phone}</td>
                        <td className="px-4 py-3">{t.booking?.date}</td>
                        <td className="px-4 py-3">{t.booking?.time}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleCancel(t.id)}
                            disabled={submitting}
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Avboka
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {tables.every((t) => t.status === "available") && (
                <div className="px-4 py-8 text-center text-[#E5E7E3]/60">
                  Inga bokningar för tillfället.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Book form modal */}
      {showBookForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-table-title"
          onClick={() => !submitting && closeBookForm()}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#707164]/30 bg-[#12110D] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="book-table-title" className="text-xl font-semibold text-[#EAC84E]">
              {selectedTable ? `Boka ${selectedTable.name}` : "Ny bokning"}
            </h2>
            <form onSubmit={handleBook} className="mt-4 space-y-4">
              {selectedTable && (
                <input type="hidden" name="tableId" value={selectedTable.id} />
              )}
              <div>
                <label htmlFor="customerName" className="block text-sm text-[#E5E7E3]/80">
                  Namn *
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                  className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm text-[#E5E7E3]/80">
                  Telefon *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-[#E5E7E3]/80">
                  E-post
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm text-[#E5E7E3]/80">
                    Datum *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={form.date || selectedDate}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm text-[#E5E7E3]/80">
                    Tid *
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                  />
                </div>
              </div>
              {!selectedTable && (
                <div>
                  <label htmlFor="tableSelect" className="block text-sm text-[#E5E7E3]/80">
                    Bord *
                  </label>
                  <select
                    id="tableSelect"
                    required={!selectedTable}
                    value={newBookingTableId}
                    className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                    onChange={(e) => setNewBookingTableId(e.target.value)}
                  >
                    <option value="">Välj bord</option>
                    {tables
                      .filter((t) => t.status === "available")
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.capacity} platser)
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="note" className="block text-sm text-[#E5E7E3]/80">
                  Anteckning
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  className="mt-1 w-full rounded border border-[#707164]/40 bg-[#1a1915] px-3 py-2 text-[#E5E7E3] focus:border-[#EAC84E]/60 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || (!selectedTable && !newBookingTableId)}
                  className="flex-1 rounded bg-[#EAC84E] px-4 py-2 font-medium text-[#12110D] hover:bg-[#D4A83E] disabled:opacity-50"
                >
                  {submitting ? "Bokar..." : "Boka"}
                </button>
                <button
                  type="button"
                  onClick={closeBookForm}
                  disabled={submitting}
                  className="rounded border border-[#707164]/50 px-4 py-2 text-[#E5E7E3] hover:bg-[#1a1915] disabled:opacity-50"
                >
                  Avbryt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
