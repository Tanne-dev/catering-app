import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Resend webhook endpoint – nhận events từ Resend (email.sent, email.delivered, email.bounced, v.v.)
 *
 * Cấu hình trong Resend Dashboard → Webhooks → Add webhook:
 * - Endpoint URL: https://<domain>/api/resend-webhook
 * - Events: email.sent, email.delivered, email.bounced, email.complained
 * - Copy Signing Secret (whsec_...) → thêm RESEND_WEBHOOK_SECRET vào .env.local
 */

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("[resend-webhook] RESEND_WEBHOOK_SECRET is not set – webhook verification disabled");
    try {
      const body = await request.json();
      console.log("[resend-webhook] received (unverified):", JSON.stringify(body, null, 2));
      return NextResponse.json({ received: true });
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }

  try {
    const payload = await request.text();
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY ?? "re_build_only");
    const result = resend.webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret,
    });

    // Xử lý event theo type
    const eventType = (result as { type?: string }).type;
    const data = (result as { data?: unknown }).data;

    switch (eventType) {
      case "email.sent":
        console.log("[resend-webhook] email.sent:", data);
        break;
      case "email.delivered":
        console.log("[resend-webhook] email.delivered:", data);
        break;
      case "email.bounced":
        console.log("[resend-webhook] email.bounced:", data);
        break;
      case "email.complained":
        console.log("[resend-webhook] email.complained:", data);
        break;
      default:
        console.log("[resend-webhook] event:", eventType, data);
    }

    return NextResponse.json({ received: true, type: eventType });
  } catch (e) {
    console.error("[resend-webhook] verify error:", e);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }
}
