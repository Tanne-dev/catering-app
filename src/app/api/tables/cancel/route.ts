import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/tables";

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
    console.error("[api/tables/cancel] n8n webhook error:", e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId } = body;

    if (!tableId) {
      return NextResponse.json(
        { error: "Missing required field: tableId" },
        { status: 400 }
      );
    }

    const result = cancelBooking(tableId);

    if (!result) {
      return NextResponse.json(
        { error: "Table not found or not booked" },
        { status: 404 }
      );
    }

    const payload = {
      event: "table_cancelled",
      data: {
        tableId,
        tableName: result.name,
        previousBooking: result.previousBooking,
      },
    };

    await sendToN8n(payload);

    return NextResponse.json({
      ok: true,
      table: {
        ...result,
        previousBooking: undefined,
        status: "available",
        booking: null,
      },
      message: "Bokningen avbokades!",
    });
  } catch (e) {
    console.error("[api/tables/cancel] error:", e);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
