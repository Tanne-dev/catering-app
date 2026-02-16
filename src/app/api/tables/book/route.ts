import { NextRequest, NextResponse } from "next/server";
import { bookTable } from "@/lib/tables";

const N8N_TABLES_WEBHOOK_URL = process.env.N8N_TABLES_WEBHOOK_URL;

async function sendToN8n(payload: object) {
  if (!N8N_TABLES_WEBHOOK_URL) return;
  try {
    await fetch(N8N_TABLES_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("[api/tables/book] n8n webhook error:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, customerName, phone, email, date, time, note } = body;

    if (!tableId || !customerName || !phone || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: tableId, customerName, phone, date, time" },
        { status: 400 }
      );
    }

    const table = bookTable(tableId, {
      customerName,
      phone,
      email: email || undefined,
      date,
      time,
      note: note || undefined,
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table not found or already booked" },
        { status: 404 }
      );
    }

    const payload = {
      event: "table_booked",
      data: {
        tableId,
        tableName: table.name,
        customerName,
        phone,
        email: email || "",
        date,
        time,
        note: note || "",
        bookingId: table.booking?.id,
        createdAt: table.booking?.createdAt,
      },
    };

    await sendToN8n(payload);

    return NextResponse.json({
      ok: true,
      table,
      message: "Bord bokades!",
    });
  } catch (e) {
    console.error("[api/tables/book] error:", e);
    return NextResponse.json(
      { error: "Failed to book table" },
      { status: 500 }
    );
  }
}
