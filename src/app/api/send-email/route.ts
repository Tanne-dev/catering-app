import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT } from "@/data/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

/** From address – must be verified in Resend. Use onboarding@resend.dev for testing. */
const FROM_EMAIL = process.env.RESEND_FROM ?? "onboarding@resend.dev";

/** Resend i testläge tillåter endast mottagare som kontots e-post. Returnera ett användarvänligt meddelande istället för att visa Resends tekniska fel. */
function isResendTestingError(resendError: { message?: string } | null): boolean {
  if (!resendError?.message) return false;
  const m = resendError.message.toLowerCase();
  return (
    m.includes("only send") ||
    m.includes("testing emails") ||
    m.includes("verify a domain") ||
    m.includes("resend.com/domains")
  );
}

function toFriendlyEmailError(resendError: { message?: string } | null): string {
  if (!resendError?.message) return "Kunde inte skicka e-post. Försök igen eller ring oss.";
  if (isResendTestingError(resendError)) {
    return "E-post kunde inte skickas just nu. Din beställning är sparad – vi återkommer till er. Ring oss gärna om det är brådskande.";
  }
  return resendError.message;
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { type } = body;

    if (type === "quote") {
      const {
        name,
        email,
        phone,
        address,
        event_date,
        guests,
        service,
        message,
        cart_summary,
        order_id,
      } = body;

      const subject = `Skicka förfrågan – ${name}${order_id ? ` (#${order_id})` : ""}`;
      const html = `
        <h2>Ny offertförfrågan</h2>
        <p><strong>Ordernummer:</strong> ${order_id ?? "—"}</p>
        <p><strong>Namn:</strong> ${name ?? ""}</p>
        <p><strong>E-post:</strong> ${email ?? ""}</p>
        <p><strong>Telefon:</strong> ${phone ?? "—"}</p>
        <p><strong>Leveransadress:</strong> ${address ?? "—"}</p>
        <p><strong>Datum:</strong> ${event_date ?? "—"}</p>
        <p><strong>Antal gäster:</strong> ${guests ?? "—"}</p>
        <p><strong>Allergier:</strong> ${service ?? "—"}</p>
        ${cart_summary ? `<pre style="white-space: pre-wrap; background: #f4f4f4; padding: 1rem; border-radius: 4px;">${cart_summary}</pre>` : ""}
        ${message ? `<p><strong>Meddelande:</strong></p><p>${message}</p>` : ""}
      `;

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: CONTACT.email,
        replyTo: email ?? undefined,
        subject,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        if (isResendTestingError(error)) {
          return NextResponse.json({ ok: true, emailSent: false });
        }
        return NextResponse.json(
          { error: toFriendlyEmailError(error) },
          { status: 500 }
        );
      }

      // Bekräftelsemail till kunden
      if (email) {
        const confirmSubject = `Bekräftelse – Offertförfrågan${order_id ? ` #${order_id}` : ""}`;
        const confirmHtml = `
          <h2>Tack för din förfrågan!</h2>
          <p>Vi har tagit emot din förfrågan och återkommer så snart vi kan.</p>
          ${order_id ? `<p><strong>Ordernummer:</strong> ${order_id}</p>` : ""}
          <p>Om du har frågor, kontakta oss på ${CONTACT.email} eller ${CONTACT.phone}.</p>
          <p>Med vänliga hälsningar,<br>Catering Tanne</p>
        `;
        const confirmResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: confirmSubject,
          html: confirmHtml,
        });
        if (confirmResult.error) {
          console.error("Resend confirm error:", confirmResult.error);
        }
      }

      return NextResponse.json(data ? { ...data, emailSent: true } : { ok: true, emailSent: true });
    }

    if (type === "review") {
      const { name, email, rating, message } = body;

      const subject = "Nytt omdöme – Catering Tanne";
      const html = `
        <h2>Nytt omdöme</h2>
        <p><strong>Namn:</strong> ${name ?? ""}</p>
        <p><strong>E-post:</strong> ${email ?? ""}</p>
        <p><strong>Betyg:</strong> ${rating ?? 0}/5 stjärnor</p>
        ${message ? `<p><strong>Meddelande:</strong></p><p>${message}</p>` : ""}
      `;

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: CONTACT.email,
        replyTo: email ?? undefined,
        subject,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        if (isResendTestingError(error)) {
          return NextResponse.json({ ok: true, emailSent: false });
        }
        return NextResponse.json(
          { error: toFriendlyEmailError(error) },
          { status: 500 }
        );
      }
      return NextResponse.json(data ? { ...data, emailSent: true } : { ok: true, emailSent: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Kunde inte skicka e-post.";
    console.error("POST /api/send-email:", err);
    const friendly = toFriendlyEmailError(err instanceof Error ? { message: msg } : null) ?? msg;
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
