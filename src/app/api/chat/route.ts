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
    const { message, sessionId, conversation } = body as {
      message?: string;
      sessionId?: string;
      conversation?: Array<{ role: string; content: string }>;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Skicka ett meddelande.", error: "invalid_body" }, { status: 400 });
    }

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message.trim(),
        sessionId: sessionId ?? null,
        conversation: conversation ?? [],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("n8n webhook error", res.status, text);
      return NextResponse.json(
        { reply: "Något gick fel. Försök igen eller kontakta oss direkt.", error: "upstream_error" },
        { status: 200 }
      );
    }

    const data = (await res.json()) as { reply?: string; action?: string; collected?: Record<string, string> };
    return NextResponse.json({
      reply: data.reply ?? "Tack för ditt meddelande. Vi återkommer!",
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
