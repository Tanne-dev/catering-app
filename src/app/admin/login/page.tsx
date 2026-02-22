"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/", redirect: true });
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // NextAuth v5 may return ok: true even on failure – check res.error first
      if (res?.error) {
        setSuccess(false);
        setError("E-post eller lösenord stämmer inte med admin-kontot. Kontrollera och försök igen.");
      } else if (res?.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1200);
      } else {
        setSuccess(false);
        setError("E-post eller lösenord stämmer inte med admin-kontot. Kontrollera och försök igen.");
      }
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Background */}
      <LazyBackground
        src="/admin-bg.png"
        className="fixed inset-y-0 left-5 right-5 -z-10 bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      <div className="fixed inset-y-0 left-5 right-5 -z-10 bg-white/55" aria-hidden />
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-2xl border border-[#707164]/30 bg-[#1a1916]/80 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo-catering-tanne.png"
              alt="Catering Tanne"
              width={200}
              height={28}
              className="h-8 w-auto object-contain"
              loading="lazy"
            />
          </div>
          <h1 className="text-center text-xl font-semibold text-[#EAC84E]">
            Logga in
          </h1>
          <p className="mt-2 text-center text-sm text-[#E5E7E3]/70">
            Välj hur du vill logga in.
          </p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          {success && (
            <p
              className="mt-4 rounded-lg bg-green-900/40 px-4 py-3 text-sm text-green-200"
              role="alert"
            >
              ✓ Inloggningen lyckades! Omdirigerar till dashboard…
            </p>
          )}

          {/* Gäst – Google */}
          <div className="mt-6">
            <h2 className="text-sm font-medium text-[#E5E7E3]/90">Gäst (kund)</h2>
            <p className="mt-1 text-xs text-[#E5E7E3]/60">
              Logga in med ditt Google-konto för att använda sidan som kund.
            </p>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#707164]/50 bg-[#12110D] px-4 py-3 text-[#E5E7E3] transition-colors hover:bg-[#1a1916] disabled:opacity-60"
            >
              <GoogleIcon />
              {googleLoading ? "Loggar in…" : "Logga in med Google"}
            </button>
          </div>

          <div className="my-6 border-t border-[#707164]/30" />

          {/* Admin */}
          <div>
            <h2 className="text-sm font-medium text-[#E5E7E3]/90">Admin</h2>
            <p className="mt-1 text-xs text-[#E5E7E3]/60">
              Logga in med admin-konto (Supabase Auth eller lösenord i .env).
            </p>
            <form onSubmit={handleAdminSubmit} className="mt-3 space-y-3">
              <div>
                <label htmlFor="admin-email" className="block text-xs text-[#E5E7E3]/80">
                  E-post *
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-4 py-2.5 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  placeholder="admin@cateringtanne.se"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-xs text-[#E5E7E3]/80">
                  Lösenord *
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-4 py-2.5 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-outline w-full py-2.5 text-sm"
              >
                {loading ? "Loggar in…" : "Admin – Logga in"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-[#707164]">
          <a href="/" className="hover:text-[#EAC84E] hover:underline">
            ← Tillbaka till startsidan
          </a>
        </p>
      </div>
    </div>
  );
}
