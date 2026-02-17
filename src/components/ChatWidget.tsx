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

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(() => getStoredCustomer());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
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

  async function send() {
    const text = input.trim();
    if (!text || loading || !customerInfo) return;
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
          userId: getUserId(),
          conversation: messages.map((msg) => ({ role: msg.role, content: msg.content })),
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
      loading={loading}
      onSubmit={send}
      messagesListRef={listRef}
    />
  );
}
