"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let s = sessionStorage.getItem("chat_session_id");
  if (!s) {
    s = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("chat_session_id", s);
  }
  return s;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          conversation: messages.map((msg) => ({ role: msg.role, content: msg.content })),
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Tack för ditt meddelande." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Något gick fel. Försök igen eller kontakta oss direkt." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#C49B38] text-white shadow-lg transition hover:bg-[#D4A83E] focus:outline-none focus:ring-2 focus:ring-[#EAC84E]"
        aria-label={open ? "Stäng chatt" : "Öppna chatt"}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-5 z-[89] flex h-[480px] w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-[#707164]/30 bg-[#1a1916] shadow-xl overflow-hidden"
          aria-label="Chatt med Catering Tanne"
        >
          <div className="relative flex-shrink-0 h-24 w-full border-b border-[#707164]/30">
            <Image
              src="/vara-tjanster-sushi.png"
              alt=""
              fill
              className="object-cover"
              sizes="340px"
            />
            <div className="absolute inset-0 bg-[#12110D]/60" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="font-semibold text-[#EAC84E] drop-shadow-md">Chatt</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-white/90 hover:bg-white/20 hover:text-white drop-shadow-md"
                aria-label="Stäng"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {messages.length === 0 && (
              <p className="text-sm text-[#E5E7E3]/70">
                Hej! Fråga om våra menyer, priser eller bokning. Vi svarar så gott vi kan.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-[#C49B38] text-[#12110D]"
                    : "mr-auto bg-[#12110D] border border-[#707164]/30 text-[#E5E7E3]"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto max-w-[85%] rounded-lg border border-[#707164]/30 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3]/70">
                ...
              </div>
            )}
          </div>
          <form
            className="border-t border-[#707164]/30 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Skriv ditt meddelande..."
                className="flex-1 rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-[#C49B38] px-4 py-2 text-sm font-medium text-white hover:bg-[#D4A83E] disabled:opacity-50"
              >
                Skicka
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
