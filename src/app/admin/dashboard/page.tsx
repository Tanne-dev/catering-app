"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import LazyBackground from "@/components/LazyBackground";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as { role?: string })?.role;
    if (role !== "admin") {
      router.replace("/admin/login");
    }
  }, [router, session, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#EAC84E]">Laddar...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh] px-4 py-16">
      {/* Background */}
      <LazyBackground
        src="/admin-bg.png"
        className="fixed inset-y-0 left-5 right-5 -z-10 bg-cover bg-center bg-no-repeat"
        aria-hidden
      />
      <div className="fixed inset-y-0 left-5 right-5 -z-10 bg-white/55" aria-hidden />

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-[#707164]/30 bg-[#1a1916]/90 p-8 shadow-xl backdrop-blur-sm">
          <h1
            className="font-serif text-2xl font-semibold tracking-tight text-[#EAC84E]"
            style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', serif" }}
          >
            Administratör Dashboard
          </h1>
          <p className="mt-2 text-[#E5E7E3]/80">
            Välkommen, {session?.user?.name ?? "Admin"}! Här kan du hantera webbplatsen.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/admin/tables"
              className="flex flex-col rounded-xl border border-[#707164]/30 bg-[#12110D]/80 p-6 transition-colors hover:border-[#C49B38]/50 hover:bg-[#1a1916]"
            >
              <span className="text-lg font-medium text-[#E5E7E3]">Hantera bord</span>
              <span className="mt-2 text-sm text-[#E5E7E3]/70">
                Visa och hantera bordreservationer, kalender och bokningar.
              </span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex flex-col rounded-xl border border-[#707164]/30 bg-[#12110D]/80 p-6 transition-colors hover:border-[#C49B38]/50 hover:bg-[#1a1916]"
            >
              <span className="text-lg font-medium text-[#E5E7E3]">Hantera beställningar</span>
              <span className="mt-2 text-sm text-[#E5E7E3]/70">
                Visa och hantera offertförfrågningar från kunder.
              </span>
            </Link>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-lg font-medium text-[#E5E7E3]">Hantera menyer</span>
              <span className="text-sm text-[#E5E7E3]/70">
                Klicka på meny för att redigera rätter:
              </span>
              <div className="mt-1 flex flex-wrap gap-2">
                <Link
                  href="/admin/menus?menu=sushi"
                  className="rounded-lg border border-[#707164]/30 bg-[#12110D]/80 px-4 py-2 text-sm font-medium text-[#E5E7E3] transition-colors hover:border-[#C49B38]/50 hover:bg-[#1a1916]"
                >
                  Sushi
                </Link>
                <Link
                  href="/admin/menus?menu=asiatisk"
                  className="rounded-lg border border-[#707164]/30 bg-[#12110D]/80 px-4 py-2 text-sm font-medium text-[#E5E7E3] transition-colors hover:border-[#C49B38]/50 hover:bg-[#1a1916]"
                >
                  Asiatisk
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-[#707164]">
            <Link href="/" className="hover:text-[#EAC84E] hover:underline">
              ← Tillbaka till startsidan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
