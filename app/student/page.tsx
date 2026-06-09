"use client";

import { useState } from "react";

export default function StudentPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [risk, setRisk] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        input,
        sessionId: "demo-session", // Phase 7 will make this dynamic
      }),
    });

    const data = await res.json();
    setResponse(data.safety.safe ? input : data.safety.response);
    setRisk(data.safety.riskLevel);
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Student Chat</h1>

      <textarea
        className="border p-2 w-full"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Send
      </button>

      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p className="font-semibold">Response:</p>
          <p>{response}</p>

          <p className="mt-2 text-sm text-gray-500">
            Risk Level: {risk}
          </p>
        </div>
      )}
    </div>
  );
}