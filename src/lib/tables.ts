import path from "node:path";
import fs from "node:fs";

export type TableStatus = "available" | "booked";

export interface TableBooking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  note?: string;
  createdAt: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  booking: TableBooking | null;
}

let tablesCache: Table[] | null = null;

function getSeedPath(): string {
  return path.join(process.cwd(), "src", "data", "tables-seed.json");
}

function loadFromSeed(): Table[] {
  try {
    const content = fs.readFileSync(getSeedPath(), "utf-8");
    return JSON.parse(content) as Table[];
  } catch {
    return [];
  }
}

export function getTables(): Table[] {
  if (tablesCache) return tablesCache;
  tablesCache = loadFromSeed();
  return tablesCache;
}

export function bookTable(
  tableId: string,
  booking: Omit<TableBooking, "id" | "createdAt">
): Table | null {
  const tables = getTables();
  const table = tables.find((t) => t.id === tableId);
  if (!table || table.status === "booked") return null;

  const newBooking: TableBooking = {
    ...booking,
    id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  table.status = "booked";
  table.booking = newBooking;
  return table;
}

export interface CancelResult extends Table {
  previousBooking: TableBooking | null;
}

export function cancelBooking(tableId: string): CancelResult | null {
  const tables = getTables();
  const table = tables.find((t) => t.id === tableId);
  if (!table || table.status !== "booked") return null;

  const previousBooking = table.booking;
  table.status = "available";
  table.booking = null;
  return { ...table, previousBooking };
}

export function getTableStats(): { total: number; available: number; booked: number } {
  const tables = getTables();
  const total = tables.length;
  const booked = tables.filter((t) => t.status === "booked").length;
  const available = total - booked;
  return { total, available, booked };
}
