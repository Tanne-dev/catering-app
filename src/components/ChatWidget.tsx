"use client";

import { useState, useRef, useEffect } from "react";
import { ChatWidgetUI, type ChatMessage } from "./ChatWidgetUI";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    <ChatWidgetUI
      open={open}
      onToggleOpen={() => setOpen((o) => !o)}
      messages={messages}
      input={input}
      onInputChange={setInput}
      loading={loading}
      onSubmit={send}
      messagesListRef={listRef}
    />
  );
}
