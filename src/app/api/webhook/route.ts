import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint – nằm trong app của bạn, dùng để kết nối với n8n.
 *
 * Luồng kết nối: trong n8n bạn cấu hình gọi URL này (n8n → app của bạn).
 * Ví dụ: workflow n8n dùng node "HTTP Request" với URL bên dưới.
 *
 * URL (local):   http://localhost:3000/api/webhook
 * URL (deploy):  https://<domain>/api/webhook
 *
 * Trong n8n:
 * - Method: POST (gửi dữ liệu) hoặc GET (kiểm tra endpoint).
 * - Body: JSON tùy ý.
 * - Header (tùy chọn): x-webhook-secret = N8N_WEBHOOK_SECRET trong .env
 */

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

function isAuthorized(request: NextRequest): boolean {
  if (!WEBHOOK_SECRET) return true; // Không set secret thì chấp nhận mọi request
  const secret = request.headers.get("x-webhook-secret");
  return secret === WEBHOOK_SECRET;
}

/** GET: Kiểm tra endpoint có sẵn sàng không (n8n có thể dùng để test). */
export async function GET() {
  return NextResponse.json(
    { ok: true, message: "Webhook endpoint is ready. Use POST to send data." },
    { status: 200 }
  );
}

/** POST: Nhận dữ liệu từ n8n. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let body: unknown = null;

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      if (text) body = { raw: text };
    }

    // Có thể xử lý payload ở đây: lưu DB, gửi email, trigger logic, v.v.
    // console.log("[webhook] received:", body);

    return NextResponse.json(
      { ok: true, received: true, message: "Webhook processed" },
      { status: 200 }
    );
  } catch (e) {
    console.error("[webhook] error:", e);
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
