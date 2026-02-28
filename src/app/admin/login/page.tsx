"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim() || undefined,
        password,
        redirect: false,
      });

      // NextAuth v5 may return ok: true even on failure – check res.error first
      if (res?.error) {
        setSuccess(false);
        setError("Lösenord stämmer inte med admin-kontot. Kontrollera och försök igen.");
      } else if (res?.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1200);
      } else {
        setSuccess(false);
        setError("Lösenord stämmer inte med admin-kontot. Kontrollera och försök igen.");
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
            Logga in som administratör.
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

          {/* Admin */}
          <div>
            <h2 className="text-center text-sm font-medium text-[#E5E7E3]/90">Administratör</h2>
            <p className="mt-1 text-xs text-[#E5E7E3]/60">
              Endast för plattformens administratörer.
            </p>
            <form onSubmit={handleAdminSubmit} className="mt-3 space-y-3">
              <div>
                <label htmlFor="admin-email" className="block text-xs text-[#E5E7E3]/80">
                  E-post
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-4 py-2.5 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  placeholder=""
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
                {loading ? "Loggar in…" : "Administratör – Logga in"}
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
