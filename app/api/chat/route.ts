import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/turso";
import Groq from "groq-sdk";

import { detectSemanticJailbreak } from "@/lib/safety/semantic";
import { classifyRisk } from "@/lib/safety/risk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { input, sessionId } = await request.json();
    const start = Date.now();

    const semanticRisk = await detectSemanticJailbreak(input);

    const keywordInjection =
      /jailbreak|ignore previous|system override|bypass/i.test(input);

    const injectionDetected =
      keywordInjection || semanticRisk === "JAILBREAK" ? 1 : 0;

    const riskLevel = await classifyRisk(input);

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: input }],
    });

    const output = completion.choices[0].message.content;
    const latencyMs = Date.now() - start;

    await db.execute(
      `INSERT INTO PromptShieldEvents 
        (timestamp, sessionId, input, riskLevel, injectionDetected, latencyMs)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        new Date().toISOString(),
        sessionId,
        input,
        riskLevel,
        injectionDetected,
        latencyMs,
      ]
    );

    return NextResponse.json({
      safety: {
        safe: injectionDetected === 0 && semanticRisk === "SAFE",
        response: output,
        riskLevel,
      },
    });
  } catch (err) {
    console.error("CHAT ROUTE ERROR:", err);

    return NextResponse.json(
      {
        safety: {
          safe: false,
          response: "Server error occurred.",
          riskLevel: "CRITICAL",
        },
      },
      { status: 500 }
    );
  }
}