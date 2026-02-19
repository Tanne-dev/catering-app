import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json(
      { reply: "Chat är inte konfigurerad än. Kontakta oss gärna via formuläret eller ring oss.", error: "no_webhook" },
      { status: 200 }
    );
  }

  try {
    const body = await request.json();
    const { message, sessionId, userId, conversation, customer, imageBase64, imageMimeType } = body as {
      message?: string;
      sessionId?: string;
      userId?: string;
      conversation?: Array<{ role: string; content: string }>;
      customer?: { fullnamn?: string; email?: string };
      imageBase64?: string;
      imageMimeType?: string;
    };

    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    const hasImage = !!imageBase64 && typeof imageBase64 === "string";
    if (!trimmedMessage && !hasImage) {
      return NextResponse.json({ reply: "Skicka ett meddelande eller bifoga en bild.", error: "invalid_body" }, { status: 400 });
    }

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmedMessage || "Se bifogad bild",
        sessionId: sessionId ?? null,
        userId: userId ?? null,
        conversation: conversation ?? [],
        customer: customer ?? null,
        imageBase64: imageBase64 ?? null,
        imageMimeType: imageMimeType ?? "image/jpeg",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[api/chat] n8n webhook error", res.status, text);
      return NextResponse.json(
        { reply: "Något gick fel. Försök igen eller kontakta oss direkt.", error: "upstream_error" },
        { status: 200 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    let data: any = {};

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      // Nếu n8n trả về plain text, coi như đó là reply
      if (text) {
        data = { reply: text };
      }
    }

    // Log để debug
    console.log("[api/chat] n8n response:", JSON.stringify(data, null, 2));

    // Tìm reply từ nhiều format khác nhau
    const reply =
      data.reply ||
      data.text ||
      data.output ||
      data.response ||
      data.message?.content ||
      (typeof data === "string" ? data : null);

    return NextResponse.json({
      reply: reply || "Tack för ditt meddelande. Vi återkommer!",
      action: data.action,
      collected: data.collected,
    });
  } catch (e) {
    console.error("chat API error", e);
    return NextResponse.json(
      { reply: "Något gick fel. Kontakta oss gärna via formuläret eller ring oss.", error: "server_error" },
      { status: 200 }
    );
  }
}
