"use client";

import { useState, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  risk?: string;
};

export default function StudentPage() {
  const [sessionId, setSessionId] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setSessionId(
      crypto.randomUUID?.() ??
        `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,      // <-- FIXED
        sessionId,          // <-- FIXED
      }),
    });

    const data = await res.json();

    const assistantMessage: Message = {
      role: "assistant",
      content: data.response,   // <-- matches route.ts
      risk: data.riskLevel,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 pb-10">
      <div className="p-4 bg-blue-600 text-white text-xl font-semibold">
        PromptShield Live — Student View
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-white border shadow-sm"
            }`}
          >
            <div>{msg.content}</div>

            {msg.risk && (
              <div
                className={`mt-2 text-xs font-semibold ${
                  msg.risk === "high" ? "text-red-600" : "text-green-600"
                }`}
              >
                Risk: {msg.risk}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex space-x-2 z-50 relative">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          type="button"
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}