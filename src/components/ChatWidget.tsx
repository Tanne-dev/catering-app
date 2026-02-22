"use client";

import { useState, useRef, useEffect } from "react";
import { ChatWidgetUI, type ChatMessage } from "./ChatWidgetUI";

export type CustomerInfo = {
  fullnamn: string;
  email: string;
};

const CUSTOMER_STORAGE_KEY = "chat_customer_info";
const USER_ID_STORAGE_KEY = "chat_user_id";

function generateUserId(): string {
  return "user_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now().toString(36);
}

function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_STORAGE_KEY);
}

function storeUserId(userId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  }
}

function getStoredCustomer(): CustomerInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s) as CustomerInfo;
    if (parsed.fullnamn && parsed.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

function storeCustomer(info: CustomerInfo) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(info));
  }
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let s = sessionStorage.getItem("chat_session_id");
  if (!s) {
    s = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("chat_session_id", s);
  }
  return s;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ChatWidget() {
  // #region agent log
  if (typeof window !== "undefined") {
    fetch("http://127.0.0.1:7242/ingest/0cdeab99-f7cb-4cee-9943-94270784127d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "ChatWidget.tsx:init",
        message: "H1 customerInfo post-fix",
        data: { hasStoredCustomer: !!getStoredCustomer(), stateStartsNull: true },
        timestamp: Date.now(),
        hypothesisId: "H1",
        runId: "post-fix",
      }),
    }).catch(() => {});
  }
  // #endregion
  const [open, setOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  useEffect(() => {
    const stored = getStoredCustomer();
    if (stored) setCustomerInfo(stored);
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  function handleCustomerSubmit(info: CustomerInfo) {
    const userId = generateUserId();
    storeUserId(userId);
    setCustomerInfo(info);
    storeCustomer(info);
  }

  function handleImageSelect(file: File | null) {
    setSelectedImage(file);
    if (file) {
      fileToDataUrl(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  }

  async function send() {
    const text = input.trim();
    const imageToSend = selectedImage;
    const hasImage = !!imageToSend;
    if ((!text && !hasImage) || loading || !customerInfo) return;
    const displayText = text || "Se bifogad bild";
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    const imageDataUrl = imageToSend ? await fileToDataUrl(imageToSend) : undefined;
    const newUserMessage: ChatMessage = {
      role: "user",
      content: displayText,
      ...(imageDataUrl && { imageUrl: imageDataUrl }),
    };
    setMessages((m) => [...m, newUserMessage]);
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const conversationWithNew = [
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user" as const, content: displayText },
      ];
      const imageBase64 = imageToSend ? await fileToBase64(imageToSend) : undefined;
      const mimeType = imageToSend?.type ?? "image/jpeg";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: displayText,
          sessionId,
          userId: getUserId(),
          conversation: conversationWithNew,
          imageBase64: imageBase64 ?? undefined,
          imageMimeType: imageBase64 ? mimeType : undefined,
          customer: {
            fullnamn: customerInfo.fullnamn,
            email: customerInfo.email,
          },
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
    <ChatWidgetUI
      open={open}
      onToggleOpen={() => setOpen((o) => !o)}
      customerInfo={customerInfo}
      onCustomerSubmit={handleCustomerSubmit}
      messages={messages}
      input={input}
      onInputChange={setInput}
      imagePreview={imagePreview}
      onImageSelect={handleImageSelect}
      loading={loading}
      onSubmit={send}
      messagesListRef={listRef}
    />
  );
}
