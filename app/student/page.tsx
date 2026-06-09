"use client";

import { useState } from "react";

export default function StudentPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [riskScore, setRiskScore] = useState<string>("");
  const [alertReason, setAlertReason] = useState<string>("");

  const sessionId = "student-session";

  function safeString(value: any): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  }

  function riskColor(level: string) {
    switch (level) {
      case "SAFE": return "text-green-600";
      case "LOW": return "text-yellow-600";
      case "MEDIUM": return "text-orange-600";
      case "HIGH": return "text-red-600";
      case "CRITICAL": return "text-red-800 font-bold";
      default: return "";
    }
  }

  async function sendMessage() {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ sessionId, input }),
    });

    const data = await res.json();

    const rewritten = safeString(data.rewritten);
    const output = safeString(data.output);

    if (rewritten) {
      setResponse(rewritten);
    } else if (output) {
      setResponse(output);
    } else {
      setResponse("No response received.");
    }

    setRiskLevel(safeString(data.riskLevel));
    setRiskScore(safeString(data.riskScore));
    setAlertReason(safeString(data.alert));
  }

  return (
    <div className="p-6 w-full max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Student Chat</h1>

      <div className="space-y-4">
        <textarea
          className="w-full border p-3 rounded text-lg"
          rows={4}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 text-white rounded text-lg"
        >
          Send
        </button>
      </div>

      {response && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2 text-xl">Response</h2>
          <p className="whitespace-pre-wrap text-lg">{safeString(response)}</p>
        </div>
      )}

      {(riskLevel || riskScore || alertReason) && (
        <div className="border p-4 rounded bg-gray-100">
          <h2 className="font-semibold mb-2 text-xl">Safety Metadata</h2>

          <p className={`text-lg ${riskColor(riskLevel)}`}>
            <strong>Risk Level:</strong> {riskLevel}
          </p>

          <p className="text-lg">
            <strong>Risk Score:</strong> {riskScore}
          </p>

          {alertReason && (
            <p className="text-lg text-red-600">
              <strong>Alert:</strong> {alertReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}