"use client";

import Image from "next/image";
import React, { useState } from "react";
import type { RefObject } from "react";
import type { CustomerInfo } from "./ChatWidget";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
};

type ChatWidgetUIProps = {
  open: boolean;
  onToggleOpen: () => void;
  customerInfo: CustomerInfo | null;
  onCustomerSubmit: (info: CustomerInfo) => void;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  imagePreview: string | null;
  onImageSelect: (file: File | null) => void;
  loading: boolean;
  onSubmit: () => void;
  messagesListRef: RefObject<HTMLDivElement | null>;
};

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_IMAGE_SIZE_MB = 5;

export function ChatWidgetUI({
  open,
  onToggleOpen,
  customerInfo,
  onCustomerSubmit,
  messages,
  input,
  onInputChange,
  imagePreview,
  onImageSelect,
  loading,
  onSubmit,
  messagesListRef,
}: ChatWidgetUIProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      onImageSelect(null);
      return;
    }
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
      onImageSelect(null);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      onImageSelect(null);
      return;
    }
    onImageSelect(file);
    e.target.value = "";
  }
  const [formFullnamn, setFormFullnamn] = useState("");
  const [formEmail, setFormEmail] = useState("");
  return (
    <>
      <button
        type="button"
        onClick={onToggleOpen}
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
                onClick={onToggleOpen}
                className="rounded p-1 text-white/90 hover:bg-white/20 hover:text-white drop-shadow-md"
                aria-label="Stäng"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div ref={messagesListRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
            {!customerInfo ? (
              <div className="space-y-3">
                <div className="space-y-2 text-sm text-[#E5E7E3]/90">
                  <p>
                    Vår chatbot är en smart digital assistent som hjälper dig snabbt och enkelt.
                  </p>
                  <p>
                    Du kan fråga om beställningens exakta tid, innehåll i rätter, allergener, eller få personliga rekommendationer baserade på dina smakpreferenser.
                  </p>
                </div>
                <p className="text-sm text-[#E5E7E3]/90">
                  Ange dina uppgifter nedan för att starta chatten.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fn = formFullnamn.trim();
                    const em = formEmail.trim();
                    if (!fn || !em) return;
                    onCustomerSubmit({ fullnamn: fn, email: em });
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={formFullnamn}
                    onChange={(e) => setFormFullnamn(e.target.value)}
                    placeholder="Fullständigt namn *"
                    required
                    className="w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  />
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="E-post *"
                    required
                    className="w-full rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  />
                  <button
                    type="submit"
                    disabled={!formFullnamn.trim() || !formEmail.trim()}
                    className="w-full rounded-lg bg-[#C49B38] px-4 py-2 text-sm font-medium text-[#12110D] hover:bg-[#D4A83E] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Starta chatt
                  </button>
                </form>
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <p className="text-sm text-[#E5E7E3]/70">
                    Hej {customerInfo.fullnamn}! Fråga om våra menyer, priser eller bokning. Vi svarar så gott vi kan.
                  </p>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex max-w-[85%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "ml-auto bg-[#C49B38] text-[#12110D]"
                        : "mr-auto bg-[#12110D] border border-[#707164]/30 text-[#E5E7E3]"
                    }`}
                  >
                    {msg.imageUrl && (
                      <div className="relative aspect-video w-full max-w-[200px] overflow-hidden rounded-lg">
                        <Image src={msg.imageUrl} alt="" fill className="object-cover" sizes="200px" />
                      </div>
                    )}
                    {msg.content && <span>{msg.content}</span>}
                  </div>
                ))}
                {loading && (
                  <div className="mr-auto flex max-w-[85%] items-center gap-1.5 rounded-lg border border-[#707164]/30 bg-[#12110D] px-4 py-3">
                    <span className="chat-typing-dot inline-block h-2 w-2 rounded-full bg-[#EAC84E]" aria-hidden />
                    <span className="chat-typing-dot inline-block h-2 w-2 rounded-full bg-[#EAC84E]" aria-hidden />
                    <span className="chat-typing-dot inline-block h-2 w-2 rounded-full bg-[#EAC84E]" aria-hidden />
                  </div>
                )}
              </>
            )}
          </div>
          {customerInfo && (
            <form
              className="border-t border-[#707164]/30 p-3 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              {imagePreview && (
                <div className="relative inline-block">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#707164]/50">
                    <Image src={imagePreview} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onImageSelect(null)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#707164] text-white hover:bg-red-600"
                    aria-label="Ta bort bild"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES}
                  onChange={handleImageChange}
                  className="hidden"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-shrink-0 rounded-lg border border-[#707164]/50 bg-[#12110D] p-2 text-[#E5E7E3] hover:border-[#C49B38] disabled:opacity-50"
                  aria-label="Bifoga bild"
                  title="Bifoga bild"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Skriv ditt meddelande eller bifoga bild..."
                  className="flex-1 rounded-lg border border-[#707164]/50 bg-[#12110D] px-3 py-2 text-sm text-[#E5E7E3] placeholder-[#707164] focus:border-[#C49B38] focus:outline-none focus:ring-1 focus:ring-[#C49B38]"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !imagePreview)}
                  className="rounded-lg bg-[#C49B38] px-4 py-2 text-sm font-medium text-white hover:bg-[#D4A83E] disabled:opacity-50"
                >
                  Skicka
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
